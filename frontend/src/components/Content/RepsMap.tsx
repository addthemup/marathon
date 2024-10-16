import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBll4XqFE-lq4IqHMMrDua3CvA20x_NYeo'; // Google Maps API key

// Map configuration
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const defaultCenter = {
  lat: 34.9, // Approximate center latitude
  lng: -79.1, // Approximate center longitude
};
const defaultZoom = 6; // Default zoom level

interface RepsMapProps {
  selectedRep: number | null; // The currently selected rep ID
}

const RepsMap = ({ selectedRep }: RepsMapProps) => {
  const [geocodedMarkers, setGeocodedMarkers] = useState([]);
  const mapRef = useRef<google.maps.Map | null>(null); // Map reference

  // Load geocodedMarkers from localStorage
  useEffect(() => {
    const markers = JSON.parse(localStorage.getItem('geocodedMarkers')) || [];
    setGeocodedMarkers(markers);
  }, []);

  // Filter the markers based on the selected sales rep
  const filteredMarkers = selectedRep
    ? geocodedMarkers.filter(marker => marker.salesRep?.id === selectedRep)
    : geocodedMarkers; // If no rep is selected, show all markers

  // Fit map bounds to show all markers of the selected rep
  useEffect(() => {
    if (mapRef.current && filteredMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredMarkers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
      });
      mapRef.current.fitBounds(bounds); // Adjust the map to fit all the markers within view
    }
  }, [filteredMarkers]);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={defaultZoom}
        onLoad={(map) => (mapRef.current = map)} // Store the map reference
      >
        {/* Render filtered markers */}
        {filteredMarkers.map((marker) => {
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
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default RepsMap;
