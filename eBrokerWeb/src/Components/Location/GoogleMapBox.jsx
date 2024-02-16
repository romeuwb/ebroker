import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

const GoogleMapBox = ({ onSelectLocation, apiKey, latitude, longitude }) => {
    const libraries = ["places"];
    const [initialLocation, setInitialLocation] = useState({
        lat: latitude ? parseFloat(latitude) : 23.2419997,
        lng: longitude ? parseFloat(longitude) : 69.6669324,
    });

    const [location, setLocation] = useState(initialLocation);
    const [mapError, setMapError] = useState(null);
    const [searchText, setSearchText] = useState("");

    // Declare autocomplete as a ref
    const autocompleteRef = useRef(null);

    useEffect(() => {
        setLocation(initialLocation);
    }, [initialLocation]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const reverseGeocodedData = await performReverseGeocoding(latitude, longitude);

                if (reverseGeocodedData) {
                    // Extract relevant information from reverse geocoding result
                    const { formatted_address, city, country, state } = reverseGeocodedData;

                    // Create a new location object with the updated values
                    const updatedLocation = {
                        lat: latitude,
                        lng: longitude,
                        formatted_address: formatted_address,
                        city: city,
                        country: country,
                        state: state,
                    };

                    // Update the initialLocation state with the new location

                    onSelectLocation(updatedLocation);
                }
            } catch (error) {
                // Handle any errors that may occur during the geocoding process
                console.error("Error performing reverse geocoding:", error);
            }
        };

        fetchData();
    }, []);

    const onMarkerDragStart = () => {
    };

    const onMarkerDragEnd = async (e) => {
        try {
            // Perform reverse geocoding to get the address based on new coordinates
            const reverseGeocodedData = await performReverseGeocoding(e.latLng.lat(), e.latLng.lng());

            if (reverseGeocodedData) {
                // Extract relevant information from reverse geocoding result
                const { formatted_address, city, country, state } = reverseGeocodedData;

                // Create a new location object with the updated values
                const updatedLocation = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    formatted_address: formatted_address,
                    city: city,
                    country: country,
                    state: state,
                };
                // Update the initialLocation state with the new location
                setInitialLocation(updatedLocation);

                // Update the location state after the reverse geocoding is successful
                setLocation(updatedLocation);

                // Update the initialLocation prop with the new location
                onSelectLocation(updatedLocation);
            } else {
                console.error("No reverse geocoding data available");
            }
        } catch (error) {
            console.error("Error performing reverse geocoding:", error);
        }
    };
    const performReverseGeocoding = async (lat, lng) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);

            if (!response.ok) {
                throw new Error("Failed to fetch data. Status: " + response.status);
            }

            const data = await response.json();

            if (data.status === "OK" && data.results && data.results.length > 0) {
                const result = data.results[0];
                const formatted_address = result.formatted_address;
                const { city, country, state } = extractCityFromGeocodeResult(result);

                return {
                    formatted_address,
                    city,
                    country,
                    state,
                };
            } else {
                throw new Error("No results found");
            }
        } catch (error) {
            console.error("Error performing reverse geocoding:", error);
            return null;
        }
    };
    const extractCityFromGeocodeResult = (geocodeResult) => {
        let city = null;
        let country = null;
        let state = null;

        // Iterate through address components to find relevant information
        for (const component of geocodeResult.address_components) {
            if (component.types.includes("locality")) {
                city = component.long_name;
            } else if (component.types.includes("country")) {
                country = component.long_name;
            } else if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
            }
        }

        return { city, country, state };
    };

    const handleMapLoadError = () => {
        setMapError("Failed to load the map. Please check your API key and network connection.");
    };

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };
    const handlePlaceSelect = () => {
        if (autocompleteRef.current && searchText.trim() !== "") {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                // Extract the formatted address or provide a fallback value
                const formatted_address = place.formatted_address || "Address not available";

                const { city, country, state } = extractCityFromGeocodeResult(place);
                const updatedLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    formatted_address: formatted_address,
                    city: city,
                    country: country,
                    state: state,
                };
                setSearchText(formatted_address);
                setLocation(updatedLocation);
                onSelectLocation(updatedLocation);
            } else {
                console.error("No geometry available for selected place.");
            }
        }
    };

    return (
        <div>
            {mapError ? (
                <div>{mapError}</div>
            ) : (
                <LoadScript googleMapsApiKey={apiKey} libraries={libraries} onError={handleMapLoadError}>
                    <Autocomplete
                        onLoad={(autocomplete) => {
                            // Store the Autocomplete instance in the ref
                            autocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={handlePlaceSelect} // Handle place selection
                    >
                        <div id="search_location">
                            <input type="text" placeholder="Search for a location" value={searchText} onChange={handleSearchTextChange} />
                        </div>
                    </Autocomplete>
                    <GoogleMap zoom={11} center={location} mapContainerStyle={{ height: "350px" }}>
                        <Marker position={location} draggable={true} onDragStart={onMarkerDragStart} onDragEnd={onMarkerDragEnd} />
                    </GoogleMap>
                </LoadScript>
            )}
        </div>
    );
};

export default GoogleMapBox;
