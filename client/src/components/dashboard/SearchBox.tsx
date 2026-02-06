import Input from "./Input";
import { MapboxFeature } from "@/types/mapbox";
import { useEffect, useState } from "react";
import { reverseGeocode } from "@/utils/mapbox";
import CarOptions from "./CarOptions";
import { useMapboxRoute } from "@/hooks/useMapboxRoute";

interface SearchBoxProps {
    onPickupSelect: (place: MapboxFeature | null) => void;
    onDropoffSelect: (place: MapboxFeature | null) => void;
    pickup: MapboxFeature | null;
    dropoff: MapboxFeature | null;
}

export default function SearchBox({
    onPickupSelect,
    onDropoffSelect,
    pickup,
    dropoff,
}: SearchBoxProps) {
    const [initialPickup, setInitialPickup] = useState<MapboxFeature | null>(
        null,
    );
    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null,
    );
    const [userCountry, setUserCountry] = useState<string | null>(null);

    const { route, isLoading: routeLoading } = useMapboxRoute(pickup, dropoff);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported");
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { longitude, latitude } = position.coords;
                const coords: [number, number] = [longitude, latitude];

                setUserLocation(coords);

                const place = await reverseGeocode(longitude, latitude);

                if (place) {
                    setInitialPickup(place);
                    onPickupSelect(place);

                    // Extract country code from the place context
                    const countryContext = place.context?.find((c) =>
                        c.id.startsWith("country."),
                    );
                    if (countryContext?.short_code) {
                        setUserCountry(countryContext.short_code);
                    }
                }

                setIsLoadingLocation(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsLoadingLocation(false);
            },
        );
    }, [onPickupSelect]);

    return (
        <section className="p-2 border-[2px] rounded-xl">
            <p className="text-[20px] font-bold">Get a ride</p>

            {isLoadingLocation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                        Getting your location...
                    </p>
                </div>
            )}

            <Input
                placeholder="Pickup location"
                icon="pickup"
                onPlaceSelect={onPickupSelect}
                initialPlace={initialPickup}
                userLocation={userLocation}
                userCountry={userCountry}
            />
            <Input
                placeholder="Dropoff location"
                icon="dropoff"
                onPlaceSelect={onDropoffSelect}
                userLocation={userLocation}
                userCountry={userCountry}
            />

            {route && !routeLoading && <CarOptions distance={route.distance} />}
        </section>
    );
}
