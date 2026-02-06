"use client";

import { useRef, useEffect, useState } from "react";
import ReactMapGL, {
    Marker,
    NavigationControl,
    MapRef,
    Source,
    Layer,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapboxFeature } from "@/types/mapbox";
import { useMapboxRoute } from "@/hooks/useMapboxRoute";
import { Locate } from "lucide-react";

interface MapComponentProps {
    pickup: MapboxFeature | null;
    dropoff: MapboxFeature | null;
}

export default function MapComponent({ pickup, dropoff }: MapComponentProps) {
    const mapRef = useRef<MapRef>(null);
    const [currentLocation, setCurrentLocation] = useState<
        [number, number] | null
    >(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Fetch route when pickup and dropoff are set
    const { route } = useMapboxRoute(pickup, dropoff);

    // Get user's current location
    const getCurrentLocation = (): void => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;
                setCurrentLocation([longitude, latitude]);
                setLocationError(null);

                // Fly to current location
                if (mapRef.current) {
                    mapRef.current.flyTo({
                        center: [longitude, latitude],
                        zoom: 14,
                        duration: 1000,
                    });
                }
            },
            (error) => {
                setLocationError("Unable to retrieve your location");
                console.error("Geolocation error:", error);
            },
        );
    };

    const getInitialViewState = () => {
        if (pickup) {
            return {
                longitude: pickup.center[0],
                latitude: pickup.center[1],
                zoom: 12,
            };
        }

        return {
            longitude: -74.006,
            latitude: 40.7128,
            zoom: 10,
        };
    };

    // When pickup or dropoff changes, adjust the map view
    useEffect(() => {
        if (!mapRef.current || (!pickup && !dropoff)) return;

        const bounds: [number, number][] = [];

        if (pickup) bounds.push(pickup.center);
        if (dropoff) bounds.push(dropoff.center);

        if (bounds.length === 1) {
            mapRef.current.flyTo({
                center: bounds[0],
                zoom: 14,
                duration: 1000,
            });
        } else if (bounds.length === 2) {
            mapRef.current.fitBounds(
                [bounds[0], bounds[1]] as [[number, number], [number, number]],
                {
                    padding: 100,
                    duration: 1000,
                },
            );
        }
    }, [pickup, dropoff]);

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-red-500">Mapbox token not configured</p>
            </div>
        );
    }

    // Route line layer style
    const routeLayerStyle = {
        id: "route",
        type: "line" as const,
        paint: {
            "line-color": "#3b82f6", // Blue color
            "line-width": 4,
            "line-opacity": 0.75,
        },
    };

    return (
        <div className="relative w-full h-full">
            <ReactMapGL
                ref={mapRef}
                initialViewState={getInitialViewState()}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={token}
            >
                <NavigationControl position="top-right" />

                {/* Current Location Button */}
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={getCurrentLocation}
                        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
                        title="Get current location"
                    >
                        <Locate size={20} className="text-blue-600" />
                    </button>
                </div>

                {/* Route Line */}
                {route && (
                    <Source
                        id="route"
                        type="geojson"
                        data={{
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "LineString",
                                coordinates: route.geometry.coordinates,
                            },
                        }}
                    >
                        <Layer {...routeLayerStyle} />
                    </Source>
                )}

                {/* Current Location Marker */}
                {currentLocation && (
                    <Marker
                        longitude={currentLocation[0]}
                        latitude={currentLocation[1]}
                        anchor="center"
                    >
                        <div className="relative">
                            <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                            <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
                        </div>
                    </Marker>
                )}

                {/* Pickup Marker */}
                {pickup && (
                    <Marker
                        longitude={pickup.center[0]}
                        latitude={pickup.center[1]}
                        anchor="bottom"
                    >
                        <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                                P
                            </span>
                        </div>
                    </Marker>
                )}

                {/* Dropoff Marker */}
                {dropoff && (
                    <Marker
                        longitude={dropoff.center[0]}
                        latitude={dropoff.center[1]}
                        anchor="bottom"
                    >
                        <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                                D
                            </span>
                        </div>
                    </Marker>
                )}
            </ReactMapGL>

            {/* Route Info Display */}
            {route && (
                <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
                    <h3 className="font-bold text-sm mb-2">
                        Route Information
                    </h3>
                    <p className="text-sm text-gray-600">
                        Distance:{" "}
                        <span className="font-medium">
                            {(route.distance / 1000).toFixed(2)} km
                        </span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Duration:{" "}
                        <span className="font-medium">
                            {Math.round(route.duration / 60)} min
                        </span>
                    </p>
                </div>
            )}

            {/* Location Error */}
            {locationError && (
                <div className="absolute top-20 left-4 bg-red-100 p-3 rounded-lg shadow-lg z-10">
                    <p className="text-sm text-red-600">{locationError}</p>
                </div>
            )}
        </div>
    );
}
