import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { Loader, Box, Text } from '@mantine/core';  // Use Mantine's Loader instead of CircularProgress

const GOOGLE_MAPS_API_KEY = 'AIzaSyBll4XqFE-lq4IqHMMrDua3CvA20x_NYeo';

// Set the initial map options
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default zoom level for individual account view
const defaultZoom = 15; // More zoomed-in for a single location

interface BranchAccountMapProps {
  address: string;
}

export const BranchAccountMap = ({ address }: BranchAccountMapProps) => {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Geocode the account's address to get lat/lng
  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          setMarkerPosition({ lat, lng });
        } else {
          setError('Failed to geocode the address');
        }
      } catch (err) {
        setError('Error fetching geocode data');
        console.error('Geocoding error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      geocodeAddress(); // Call geocoding if address is provided
    } else {
      setError('No address provided');
      setLoading(false);
    }
  }, [address]);

  // Show loading spinner while geocoding
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Loader />
      </Box>
    );
  }

  // Show error message if geocoding failed
  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition || { lat: 0, lng: 0 }} // Center on the geocoded location or default
        zoom={defaultZoom}
      >
        {/* Show marker if the position is available */}
        {markerPosition && <Marker position={markerPosition} title={address} />}
      </GoogleMap>
    </LoadScript>
  );
};
