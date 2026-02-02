import { useEffect, useRef, useState } from 'react';
import { MapboxFeature, MapboxGeocodingResponse } from '@/types/mapbox';

interface UseMapboxAutocompleteReturn {
    query: string;
    setQuery: (query: string) => void;
    suggestions: MapboxFeature[];
    isLoading: boolean;
    selectPlace: (place: MapboxFeature) => void;
}

export function useMapboxAutocomplete(
    onSelect?: (place: MapboxFeature) => void
): UseMapboxAutocompleteReturn {
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // Don't search if query is too short
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        // Cancel previous request if still running
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        const searchPlaces = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
                if (!token) {
                    throw new Error('Mapbox token is not configured');
                }

                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&autocomplete=true&limit=5`,
                    { signal: abortControllerRef.current!.signal }
                );
                
                if (!response.ok) {
                    throw new Error(`Mapbox API error: ${response.status}`);
                }

                const data: MapboxGeocodingResponse = await response.json();
                setSuggestions(data.features || []);
            } catch (error) {
                // Ignore abort errors
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the search (wait 300ms after user stops typing)
        const timeoutId = setTimeout(searchPlaces, 300);

        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [query]);

    const selectPlace = (place: MapboxFeature): void => {
        setQuery(place.place_name);
        setSuggestions([]);
        if (onSelect) {
            onSelect(place);
        }
    };

    return {
        query,
        setQuery,
        suggestions,
        isLoading,
        selectPlace,
    };
}