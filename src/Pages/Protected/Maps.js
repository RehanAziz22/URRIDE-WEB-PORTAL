import React from 'react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import availableBikeMarker from '../../assets/images/blue-bike-small.png';
import inUseBikeMarker from '../../assets/images/yellow-bike-small.png';
import underMaintenanceBikeMarker from '../../assets/images/orange-bike-small.png';
import reservedBikeMarker from '../../assets/images/red-bike-samll.png';
import { BASE_URL } from '../../config/config';
const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 24.8608,
  lng: 67.009
};

// Function to convert coordinates from API response to Google Maps format
const toLatLng = (coordinates) => {
  return new window.google.maps.LatLng(coordinates[0], coordinates[1]); // Assuming order is [lat, lng]
};
export default function Maps({ showAvailable, showInUse, showUnderMaintenance, showReserved }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDpCEB573e6JWBYiQMc9yFmmeQkf82KgZQ"
  })
  const [bikes, setBikes] = React.useState([]);
  const [availableBikes, setAvailableBikes] = React.useState([]);
  const [inUseBikes, setInUseBikes] = React.useState([]);
  const [underMaintenanceBikes, setUnderMaintenanceBikes] = React.useState([]);
  const [reservedBikes, setReservedBikes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const [map, setMap] = React.useState(null)


  // Fetch bike data from your API (replace with your actual fetching logic)
  React.useEffect(() => {
    const fetchbikes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}bikes`);
        const allBikes = response.data;

        // Filter bikes based on status
        const available = allBikes.filter(bike => bike.status === 'available');
        const inUse = allBikes.filter(bike => bike.status === 'in_use');
        const underMaintenance = allBikes.filter(bike => bike.status === 'under_maintenance');
        const reserved = allBikes.filter(bike => bike.status === 'reserved');

        // Store the filtered arrays in state
        setBikes(allBikes);
        setAvailableBikes(available);
        setInUseBikes(inUse);
        setUnderMaintenanceBikes(underMaintenance);
        setReservedBikes(reserved);

        console.log('Available Bikes:', available);
        console.log('In Use Bikes:', inUse);
        console.log('Under Maintenance Bikes:', underMaintenance);
        console.log('Reserved Bikes:', reserved);
      } catch (error) {
        setError(error);
      }
    };

    fetchbikes();
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={4}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        streetViewControl: false,
        mapTypeControl: false
      }}
    >
     {showAvailable && availableBikes.map((bike) => (
        <MarkerF
          key={bike._id}
          position={toLatLng(bike.location.coordinates)}
          options={{ icon: availableBikeMarker }}
          title={bike.plateNo}
        />
      ))}

      {showInUse && inUseBikes.map((bike) => (
        <MarkerF
          key={bike._id}
          position={toLatLng(bike.location.coordinates)}
          options={{ icon: inUseBikeMarker }}
          title={bike.plateNo}
        />
      ))}

      {showUnderMaintenance && underMaintenanceBikes.map((bike) => (
        <MarkerF
          key={bike._id}
          position={toLatLng(bike.location.coordinates)}
          options={{ icon: underMaintenanceBikeMarker }}
          title={bike.plateNo}
        />
      ))}

      {showReserved && reservedBikes.map((bike) => (
        <MarkerF
          key={bike._id}
          position={toLatLng(bike.location.coordinates)}
          options={{ icon: reservedBikeMarker }}
          title={bike.plateNo}
        />
      ))}

    </GoogleMap>
  ) : <></>
}

