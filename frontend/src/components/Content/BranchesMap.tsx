import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBll4XqFE-lq4IqHMMrDua3CvA20x_NYeo'; // Google Maps API key

// Map configuration
const mapContainerStyle = {
  width: '100%',
  height: '30%',
};
const defaultCenter = {
  lat: 35, // Approximate center latitude
  lng: -80, // Approximate center longitude
};
const defaultZoom = 6; // Default zoom level

const BranchesMap = () => {
  const [geocodedMarkers, setGeocodedMarkers] = useState([]); // Markers for the map
  const [selectedBranch, setSelectedBranch] = useState(null); // Selected branch info (id, name, lat, lng)
  const mapRef = useRef<google.maps.Map | null>(null); // Map reference

  // Load branch markers from localStorage on component mount
  useEffect(() => {
    const markers = JSON.parse(localStorage.getItem('geocodedMarkers')) || []; // Correct key for loading markers
    setGeocodedMarkers(markers);
  }, []);

  // Fit map bounds to show all markers on load
  useEffect(() => {
    if (mapRef.current && geocodedMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      geocodedMarkers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
      });
      mapRef.current.fitBounds(bounds); // Adjust map to fit markers
    }
  }, [geocodedMarkers]);

  // Handle marker click to select a branch location and store it in localStorage
  const handleMarkerClick = (marker) => {
    const selectedBranchInfo = {
      id: marker.id,
      name: marker.name,
      lat: marker.position.lat,  // Include lat
      lng: marker.position.lng,  // Include lng
    };
    setSelectedBranch(selectedBranchInfo);
    localStorage.setItem('selectedBranch', JSON.stringify(selectedBranchInfo)); // Store branch id, name, lat, lng
    console.log('Selected branch saved:', selectedBranchInfo);
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={defaultZoom}
        onLoad={(map) => (mapRef.current = map)} // Store the map reference
      >
        {/* Render branch markers */}
        {geocodedMarkers.map((marker) => {
          const lat = marker.position.lat;
          const lng = marker.position.lng;

          if (typeof lat !== 'number' || typeof lng !== 'number') {
            console.warn(`Skipping marker for ${marker.name} due to invalid lat/lng.`);
            return null; // Skip marker if lat/lng are invalid
          }

          return (
            <Marker
              key={marker.id}
              position={{ lat, lng }}
              title={marker.name}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Use red-dot for default markers
              }}
              onClick={() => handleMarkerClick(marker)} // Select the branch by clicking the marker
            />
          );
        })}

        {/* Marker for selected branch */}
        {selectedBranch && (
          <Marker
            position={{ lat: selectedBranch.lat, lng: selectedBranch.lng }}  // Now lat and lng are present
            title={selectedBranch.name}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Use green-dot for selected branch
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default BranchesMap;
