import { Locate, LocateFixed, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useState, useRef, useEffect } from "react";
import { useMapboxAutocomplete } from "@/hooks/useMapboxAutocomplete";
import { MapboxFeature } from "@/types/mapbox";
import { reverseGeocode } from "@/utils/mapbox";

interface InputProps {
    placeholder: string;
    className?: string;
    icon: "pickup" | "dropoff";
    onPlaceSelect?: (place: MapboxFeature | null) => void;
    initialPlace?: MapboxFeature | null;
    userLocation?: [number, number] | null;
    userCountry?: string | null;
}

export default function Input({
    placeholder,
    className,
    icon,
    onPlaceSelect,
    initialPlace,
    userLocation,
    userCountry,
}: InputProps) {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [hasBeenCleared, setHasBeenCleared] = useState<boolean>(false);
    const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { query, setQuery, suggestions, isLoading, selectPlace } =
        useMapboxAutocomplete(onPlaceSelect, userLocation, userCountry);

    useEffect(() => {
        if (initialPlace && !query && !hasBeenCleared) {
            setQuery(initialPlace.place_name);
        }
    }, [initialPlace, query, hasBeenCleared, setQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPlace = (place: MapboxFeature): void => {
        selectPlace(place);
        setIsFocused(false);
        setHasBeenCleared(false);
    };

    const handleClear = (): void => {
        setQuery("");
        setIsFocused(false);
        setHasBeenCleared(true);
        if (onPlaceSelect) {
            onPlaceSelect(null);
        }
    };

    const handleGetCurrentLocation = async (): Promise<void> => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { longitude, latitude } = position.coords;

                try {
                    // Reverse geocode to get address from coordinates
                    const place = await reverseGeocode(longitude, latitude);

                    if (place) {
                        setQuery(place.place_name);
                        setHasBeenCleared(false);

                        // Notify parent component
                        if (onPlaceSelect) {
                            onPlaceSelect(place);
                        }
                    }
                } catch (error) {
                    console.error("Error getting location:", error);
                    alert("Failed to get your location");
                } finally {
                    setIsGettingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert(
                    "Unable to retrieve your location. Please check your permissions.",
                );
                setIsGettingLocation(false);
            },
        );
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div
                className={twMerge(
                    "bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4",
                    className,
                )}
            >
                {/* Clickable Location Icon */}
                <button
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex-shrink-0 p-1 hover:bg-gray-300 rounded-full transition disabled:opacity-50"
                    type="button"
                    aria-label="Use current location"
                    title="Use current location"
                >
                    {icon === "pickup" ? (
                        <Locate
                            className={`${isGettingLocation ? "text-blue-500 animate-pulse" : "text-gray-600"} flex-shrink-0`}
                            size={20}
                        />
                    ) : (
                        <LocateFixed
                            className={`${isGettingLocation ? "text-blue-500 animate-pulse" : "text-gray-600"} flex-shrink-0`}
                            size={20}
                        />
                    )}
                </button>

                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="bg-transparent w-full outline-none text-black"
                />

                {/* Clear button */}
                {query && (
                    <button
                        onClick={handleClear}
                        className="flex-shrink-0 p-1 hover:bg-gray-300 rounded-full transition"
                        type="button"
                        aria-label="Clear input"
                    >
                        <X size={16} className="text-gray-600" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isFocused && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            onClick={() => handleSelectPlace(suggestion)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        >
                            <p className="text-sm font-medium text-black">
                                {suggestion.text}
                            </p>
                            <p className="text-xs text-gray-500">
                                {suggestion.place_name}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading indicator */}
            {isFocused && isLoading && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg p-3">
                    <p className="text-sm text-gray-500">Searching...</p>
                </div>
            )}

            {/* Getting location indicator */}
            {isGettingLocation && (
                <div className="absolute z-10 w-full bg-white border border-blue-200 rounded-lg mt-1 shadow-lg p-3">
                    <p className="text-sm text-blue-600">
                        Getting your location...
                    </p>
                </div>
            )}
        </div>
    );
}
