import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { SimpleGrid, Text, Checkbox, UnstyledButton, Avatar, Paper } from '@mantine/core';
import { CircularProgress, Box } from '@mui/material';
import { fetchAccounts } from '../Api/AccountsApi';  
import axios from 'axios';
import classes from '../Content/ImageCheckboxes.module.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBll4XqFE-lq4IqHMMrDua3CvA20x_NYeo';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 34.9,
  lng: -79.1,
};

const defaultZoom = 6;

function SalesRepCheckbox({ checked, onChange, fullName, profilePic }) {
  return (
    <Paper shadow="sm" padding="md">
      <UnstyledButton onClick={() => onChange(!checked)} className={classes.button} data-checked={checked || undefined}>
        <Avatar src={profilePic || 'default-placeholder.png'} alt={fullName} width={40} height={40} />
        <div className={classes.body}>
          <Text fw={500} size="sm">{fullName}</Text>
        </div>
        <Checkbox checked={checked} onChange={() => { }} tabIndex={-1} styles={{ input: { cursor: 'pointer' } }} />
      </UnstyledButton>
    </Paper>
  );
}

export function AccountsMap() {
  const [accounts, setAccounts] = useState([]);
  const [geocodedMarkers, setGeocodedMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesReps, setSalesReps] = useState([]);  // Store unique sales reps
  const [selectedSalesReps, setSelectedSalesReps] = useState([]);  // Selected sales rep filter (multiple)
  const mapRef = useRef(null);  // Reference to the map object

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const geocodeAccounts = useCallback(async (accountsData) => {
    const markers = [];

    for (const account of accountsData) {
      const address = `${account.address}, ${account.city}, ${account.state}, ${account.zip_code}`;
      try {
        const geocodeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (geocodeResponse.data.results.length > 0) {
          const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
          markers.push({ id: account.id, name: account.name, position: { lat, lng }, salesRep: account.sales_rep });
        } else {
          console.log(`Failed to geocode address for account ${account.name}`);
        }
      } catch (error) {
        console.error(`Error geocoding ${address}:`, error);
      }
    }

    if (mapRef.current && markers.length > 0) {
      fitMapToBounds(markers);
    }

    return markers;
  }, []);

  useEffect(() => {
    const loadAccounts = async () => {
      const cachedAccounts = loadFromLocalStorage('accounts');
      const cachedMarkers = loadFromLocalStorage('geocodedMarkers');
      const cachedSelectedReps = loadFromLocalStorage('selectedSalesReps');

      if (cachedAccounts && cachedMarkers) {
        setAccounts(cachedAccounts);
        setGeocodedMarkers(cachedMarkers);
        populateSalesReps(cachedAccounts);

        if (cachedSelectedReps) {
          setSelectedSalesReps(cachedSelectedReps);
        }

        setLoading(false);
      } else {
        try {
          const data = await fetchAccounts();
          setAccounts(data);

          const markers = await geocodeAccounts(data);
          setGeocodedMarkers(markers);
          populateSalesReps(data);

          saveToLocalStorage('accounts', data);
          saveToLocalStorage('geocodedMarkers', markers);
        } catch {
          setError('Failed to load account data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadAccounts();
  }, [geocodeAccounts]);

  const populateSalesReps = (accountsData) => {
    const uniqueSalesReps = accountsData
      .filter(account => account.sales_rep && account.sales_rep.id)
      .map(account => ({
        id: account.sales_rep.id,
        full_name: account.sales_rep.full_name,
        profile_pic: account.sales_rep.profile_pic || 'default-placeholder.png',
      }))
      .filter((value, index, self) => self.findIndex(rep => rep.id === value.id) === index);

    setSalesReps(uniqueSalesReps);
  };

  const fitMapToBounds = (markers) => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => {
      bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
    });
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds);
    }
  };

  const handleSalesRepSelection = (id, isChecked) => {
    setSelectedSalesReps(prevSelected => {
      const updatedSelected = isChecked
        ? [...prevSelected, id]
        : prevSelected.filter(repId => repId !== id);

      saveToLocalStorage('selectedSalesReps', updatedSelected);
      return updatedSelected;
    });
  };

  const filteredMarkers = selectedSalesReps.length > 0
    ? geocodedMarkers.filter(marker => selectedSalesReps.includes(marker.salesRep?.id))
    : geocodedMarkers;

  if (loading || geocodedMarkers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="500px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Paper withBorder={true}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 6 }} spacing="lg" mb="lg">
          {salesReps.map((rep) => (
            <SalesRepCheckbox
              key={rep.id}
              fullName={rep.full_name}
              profilePic={rep.profile_pic}
              checked={selectedSalesReps.includes(rep.id)}
              onChange={(isChecked) => handleSalesRepSelection(rep.id, isChecked)}
            />
          ))}
        </SimpleGrid>
      </Paper>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={defaultZoom}
          onLoad={(map) => (mapRef.current = map)}
        >
          {filteredMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.name}
              onClick={() => console.log(`Clicked on ${marker.name}`)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
