import React from 'react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import CustomMarker from '../assets/images/bike2.png'
import availableBikeMarker from '../assets/images/blue-bike-small.png';
import inUseBikeMarker from '../assets/images/yellow-bike-small.png';
import underMaintenanceBikeMarker from '../assets/images/orange-bike-small.png';
import reservedBikeMarker from '../assets/images/red-bike-samll.png';
const containerStyle = {
    // width: '400px',
    height: '400px'
};

// const center = {
//     lat: 24.8608,
//     lng: 67.009
// };
const toCenter = (coordinates) => {
    return {
        lat:coordinates[0],
        lng:coordinates[1]
    } // Assuming order is [lat, lng]
};

// Function to convert coordinates from API response to Google Maps format
const toLatLng = (coordinates) => {
    return new window.google.maps.LatLng(coordinates[0], coordinates[1]); // Assuming order is [lat, lng]
};

function MyComponent(props) {
    const [map, setMap] = React.useState(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDpCEB573e6JWBYiQMc9yFmmeQkf82KgZQ"
    })


    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(toCenter(coordinates));
        map.fitBounds(bounds);

        setMap(map)
    }, [])


    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const {id,plateNo,coordinates,status} = props;
    if (!props) return null; // Check if props is passed and is not null
    if (!isLoaded || !props) {
        return null; // Render nothing or a loading indicator if necessary
    }
    console.log(coordinates)
    console.log(id)
    console.log(plateNo)
    if (!isLoaded || !props) {
        return null; // Render nothing or a loading indicator if necessary
    }
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={toCenter(coordinates)}
            zoom={8}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <MarkerF
                key={id} // Use a unique identifier for each marker
                // lat={bike.location.coordinates[0]}
                // lng={bike.location.coordinates[1]}

                position={toLatLng(coordinates)}
                options={{
                    icon: status=="avaliable"?availableBikeMarker:status=="in_use"?inUseBikeMarker:status=="under_maintenance"?underMaintenanceBikeMarker:status=="reserved"?reservedBikeMarker:CustomMarker

                }}
                // Customize marker appearance with options like icon, title, etc.
                title={plateNo} // Example: Set marker title to bike model

            >
            </MarkerF>
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)