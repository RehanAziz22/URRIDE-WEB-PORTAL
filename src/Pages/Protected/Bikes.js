import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Title from './Title';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import Maps from './Maps';
import shaoAllBikeMarker from '../../assets/images/green-bike.png';
import availableBikeMarker from '../../assets/images/blue-bike.png';
import inUseBikeMarker from '../../assets/images/yellow-bike.png';
import underMaintenanceBikeMarker from '../../assets/images/orange-bike.png';
import reservedBikeMarker from '../../assets/images/red-bike.png';


function preventDefault(event) {
  event.preventDefault();
}

export default function Bikes() {
  const [bikes, setBikes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Add state to handle which markers to show
  const [showAvailable, setShowAvailable] = React.useState(false);
  const [showInUse, setShowInUse] = React.useState(false);
  const [showUnderMaintenance, setShowUnderMaintenance] = React.useState(false);
  const [showReserved, setShowReserved] = React.useState(false);

    // State for filtering markers and table data
    const [selectedStatus, setSelectedStatus] = React.useState('all'); // Default to showing all

  React.useEffect(() => {
    const fetchbikes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}bikes`);
        // Replace with your API endpoint
        setBikes(response.data);
        console.log(response.data)
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchbikes();
    handleShowAllPress()
  }, []);

  // Filter the bikes based on the selected status
  const filteredBikes = selectedStatus === 'all' ? bikes : bikes.filter(bike => bike.status === selectedStatus);

  // Handlers for button presses
  const handleShowAllPress = () => {
    setSelectedStatus('all')
    setShowAvailable(true);
    setShowInUse(true);
    setShowUnderMaintenance(true);
    setShowReserved(true);
  };

  const handleAvailablePress = () => {
    setSelectedStatus('available')
    setShowAvailable(true);
    setShowInUse(false);
    setShowUnderMaintenance(false);
    setShowReserved(false);
  };

  const handleInUsePress = () => {
    setSelectedStatus('in_use')
    setShowAvailable(false);
    setShowInUse(true);
    setShowUnderMaintenance(false);
    setShowReserved(false);
  };

  const handleUnderMaintenancePress = () => {
    setSelectedStatus('under_maintenance')
    setShowAvailable(false);
    setShowInUse(false);
    setShowUnderMaintenance(true);
    setShowReserved(false);
  };

  const handleReservedPress = () => {
    setSelectedStatus('reserved')
    setShowAvailable(false);
    setShowInUse(false);
    setShowUnderMaintenance(false);
    setShowReserved(true);
  };
  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          // height: 240,
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", textAlign: "center", justifyContent: "space-around", }}>
          <Box>
            <Button onClick={handleShowAllPress} sx={{ borderRadius: "100%",  }}>
              <img src={shaoAllBikeMarker} width={80} />
            </Button>
            <h4 style={{margin:0}}>Show All</h4>
          </Box>  <Box>
            <Button onClick={handleAvailablePress} sx={{ borderRadius: "100%" }}>
              <img src={availableBikeMarker} width={80} />
            </Button>
            <h4 style={{margin:0}}>Available</h4>
          </Box>
          <Box>
            <Button onClick={handleInUsePress} sx={{ borderRadius: "100%" }}>
              <img src={inUseBikeMarker} width={80} />
            </Button>
            <h4 style={{margin:0}}>In Use</h4>
          </Box>
          <Box>
            <Button onClick={handleUnderMaintenancePress} sx={{ borderRadius: "100%" }}>
              <img src={underMaintenanceBikeMarker} width={80} />
            </Button>
            <h4 style={{margin:0}}>Under Maintenance</h4>
          </Box>
          <Box>
            <Button onClick={handleReservedPress} sx={{ borderRadius: "100%" }}>
              <img src={reservedBikeMarker} width={80} />
            </Button>
            <h4 style={{margin:0}}>Reserved</h4>
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          // height: 240,
        }}
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching Bikes: {error.message}</p>}
        {bikes.length > 0 ? (

          <React.Fragment>
            <Maps
              showAvailable={showAvailable}
              showInUse={showInUse}
              showUnderMaintenance={showUnderMaintenance}
              showReserved={showReserved}
            />
            <Box sx={{ mt: 2 }}>

              <Title >Bike Record</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Plate No</TableCell>
                    <TableCell>Modal</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fuel</TableCell>
                    <TableCell>Fuel Level</TableCell>
                    <TableCell>Earning</TableCell>
                    <TableCell align="right">ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {filteredBikes.map((bike) => (
                    <TableRow key={bike._id}>
                      <TableCell>{bike.plateNo}</TableCell>
                      <TableCell>{bike.model}</TableCell>
                      <TableCell>{bike.status}</TableCell>
                      <TableCell>{bike.fuelLevel}</TableCell>
                      <TableCell>{bike.fuel}</TableCell>
                      <TableCell >{`Rs ${bike.totalEarnings}`}</TableCell>
                      <TableCell align="right">{bike._id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
              </Link>
            </Box>

          </React.Fragment>
        ) : (
          <p>No bikes found</p>
        )}
      </Paper>
    </>
  );
}