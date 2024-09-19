import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import availableBikeMarker from '../../assets/images/bike2.png';
import inUseBikeMarker from '../../assets/images/yellow-bike-small.png';
import underMaintenanceBikeMarker from '../../assets/images/orange-bike-small.png';
import reservedBikeMarker from '../../assets/images/red-bike-samll.png';
import MapComponent from '../../Components/MapComponent';
import { BASE_URL } from '../../config/config';
function preventDefault(event) {
  event.preventDefault();
}

export default function UpdateDeleteBike() {
  const [searchLoader, setSearchLoader] = React.useState(false)
  const [bikes, setBikes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [delLoader, setDelLoder] = React.useState(false);
  const [editLoader, setEditLoader] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [successMsg, setSuccessMsg] = React.useState()
  const [filteredBike, setFilteredBike] = React.useState()
  const [editDetails, setEditDetails] = React.useState(false)
  const [fuel, setFuel] = React.useState()
  const [open, setOpen] = React.useState(false);
  const plateNoRef = React.useRef(null);
  const date = new Date()

  React.useEffect(() => {

    fetchBikes();
  }, []);
  const handleChangeFuel = (event) => {
    setFuel(event.target.value.toString());
    console.log(fuel)
  };
  const fetchBikes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}bikes`);
      // Replace with your API endpoint
      setBikes(response.data);
      console.log(bikes)
    } catch (error) {
      setError(error || "Error fetching bikes:");
    } finally {
      setLoading(false);
    }
  };



  let searchBikeByPlateNO = (event) => {
    event.preventDefault();
    setSuccessMsg('')
    setError("")
    setEditDetails(false)
    const data = new FormData(event.currentTarget);
    let plateNo = data.get('plateNo')
    let bike = bikes.find(bike => bike.plateNo === plateNo);
    setFilteredBike(bike)
    if (!bike) {
      setError("No Bike Found")
    }
    plateNoRef.current.value = '';  // Clear the search field
  }

  let deleteBike = () => {
    setDelLoder(true)
    setError('')
    setSuccessMsg('')
    // let objToSend = {
    let id = filteredBike._id
    // }
    // console.log(objToSend)
    axios.delete(`${BASE_URL}bike/${id}`)
      .then((res) => {
        console.log(res.data);
        const { success, message } = res.data
        if (success) {
          //true
          console.log(res.data)
          setSuccessMsg(message)
          setFilteredBike('')
          setError("")
          setDelLoder(false)
        } else {
          //false
          console.log(res.data.message)
          setError(res.data.message)
          setDelLoder(false)

        }
      }
      ).catch(
        (error) => { console.log(error, "error") }
      )



  }

  const handleEdit = () => {
    setEditLoader(true)
    setError('')
    setSuccessMsg('')
    if (!editDetails) {
      setEditDetails(true)
      setEditLoader(false)
    } else {
      setEditDetails(false)
      setEditLoader(false)
    }
  }

  const handleClose = () => {
    setOpen(false);
    setError('')
    setSuccessMsg('')
    // navigate('/dashboard/createNewBike');
  }

  const editBike = (event) => {
    event.preventDefault();
    setError('')
    setSuccessMsg('')
    setEditLoader(true)
    const data = new FormData(event.currentTarget);
    let markerVisible;
    if (data.get('status') == "avaliable") {
      markerVisible = true
    }
    else {
      markerVisible = false

    }
    const objToSend = {
      plateNo: data.get('plateNo'),
      model: data.get('model'),
      status: data.get('status'),
      fuelLevel: data.get('fuelLevel'),
      lastMaintenanceDate: data.get('lastMaintenanceDate') || date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getDate(),
      totalEarnings: data.get('totalEarnings'),
      totalCosts: data.get('totalCosts'),
      fuel: data.get('fuel'),
      mileage: data.get('mileage'),
      markerVisible: markerVisible,
      fuelEfficiency: data.get('fuelEfficiency'),
      fuelTankCapacity: data.get('fuelTankCapacity'),

    }

    console.log(objToSend)

    axios.put(`${BASE_URL}bike/${filteredBike._id}`, objToSend)
      .then((res) => {
        console.log(res.data, "response");
        const { success, message, data } = res.data
        if (success) {
          //true
          console.log(res.data)
          setSuccessMsg(message)
          fetchBikes()
          setEditDetails(false)
          setEditLoader(false)
          setFilteredBike(data)
          setOpen(true)
        } else {
          //false
          console.log(res.data.message)
          // alert(res.data.message)
          setError(res.data.message)
          setSearchLoader(false)

        }
      }
      ).catch(
        (error) => { console.log(error, "error") }
      )
  }
  // Convert ISO date string to YYYY-MM-DD format
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 2
          // height: 240,
        }}
      >
        {bikes.length > 0 ? (

          <React.Fragment>
            <Title>Search Bike</Title>


            <Box component="form" noValidate onSubmit={searchBikeByPlateNO}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="plateNo"
                    label="Plate No"
                    name="plateNo"
                    placeholder='MAH-556'
                    inputRef={plateNoRef} 
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {searchLoader ? <CircularProgress color="inherit" /> : "Find Bike"}
              </Button>
              {error ? <Typography color="red" sx={{ flex: 1, textAlign: "center" }}>
                {error}
              </Typography> : ""}
              {successMsg ? <Typography color="green" sx={{ flex: 1, textAlign: "center" }}>
                {successMsg}
              </Typography> : ""}
            </Box>



          </React.Fragment>
        ) : ""}
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 2
          // height: 240,
        }}
      >
        {filteredBike && !editDetails &&
          (<>
            <Box>
              <MapComponent
                id={filteredBike._id}
                plateNo={filteredBike.plateNo}
                coordinates={filteredBike.location.coordinates}
                status={filteredBike.status}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title>Search Result</Title>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 2, backgroundColor: "red" }}
                  onClick={deleteBike}
                >
                  {delLoader ? <CircularProgress color="inherit" /> : "Delete Bike"}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleEdit}
                >
                  {editLoader ? <CircularProgress color="inherit" /> : "Edit Bike"}
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>ID</Typography>
              <Typography variant='h6' component="h2" >{filteredBike._id}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Plate No</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.plateNo}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Model</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.model}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Status</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.status == "avaliable" ? "Avaliable" : filteredBike.status == "in_use" ? "In Use" : filteredBike.status == "under_maintenance" ? "Under Maintenance" : filteredBike.status == "reserved" ? "Reserved" : "Not Defined"}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Fuel</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.fuel}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Fuel Level</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.fuelLevel}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Fuel Effiency</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.fuelEfficiency + " Km"}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Fuel Tank Capacity</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.fuelTankCapacity + " Liter"}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Last Maintenance Date</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.lastMaintenanceDate}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Mileage</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.mileage}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Total Costs</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.totalCosts}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Total Earnings</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.totalEarnings}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Marker Visibile</Typography>
              <Typography variant='h6' component="h2" >{filteredBike.markerVisible ? "Yes" : "NO"}</Typography>
            </Box>



          </>
          )}

        {editDetails && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title>Edit Bike</Title>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleEdit}
              >
                {editLoader ? <CircularProgress color="inherit" /> : "Cancel"}
              </Button>
            </Box>
            <Box component="form" noValidate onSubmit={editBike}>
              <Grid container spacing={2}>
                {/* Plate No */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="plateNo"
                    label="Plate No"
                    name="plateNo"
                    placeholder='ABC-1001'
                    defaultValue={filteredBike.plateNo}
                  />
                </Grid>
                {/* Bike Modal */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="model"
                    label="Bike Model"
                    name="model"
                    placeholder='SuperPower'
                    defaultValue={filteredBike.model}
                  />
                </Grid>
                {/* Bike Status */}

                <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
                  <h3 style={{ margin: 0 }} id="demo-simple-select-label">Status</h3>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth
                    label="Status"
                    defaultValue={filteredBike.status}
                    name='status'
                  // onChange={handleChangeFuel}
                  >
                    <MenuItem value={"avaliable"}>Avaliable</MenuItem>
                    <MenuItem value={"in_use"}>In Use</MenuItem>
                    <MenuItem value={"under_maintenance"} disable>Under Maintenance</MenuItem>
                    <MenuItem value={"reserved"} disable>Reserved</MenuItem>
                  </Select>
                </Grid>
                {/* Fuel Level */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="fuelLevel"
                    label="Fuel Level "
                    name="fuelLevel"
                    placeholder='100%'
                    defaultValue={filteredBike.fuelLevel}
                  />
                </Grid>
                {/* Fuel Effiency */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="fuelEfficiency"
                    label="Fuel Efficiency per Liter "
                    name="fuelEfficiency"
                    placeholder='8 Km'
                    defaultValue={filteredBike.fuelEfficiency}
                  />
                </Grid>
                {/* Fuel Tank Capacity */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="fuelTankCapacity"
                    label="Fuel Tank Capacity "
                    name="fuelTankCapacity"
                    placeholder='9 Liter'
                    defaultValue={filteredBike.fuelTankCapacity}
                  />
                </Grid>
                {/* mileage */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="mileage"
                    label="Average Mileage"
                    name="mileage"
                    placeholder='50km'
                    type='number'
                    defaultValue={filteredBike.mileage}
                  />
                </Grid>
                {/* Total Earning */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="totalEarnings"
                    label="Total Earnings"
                    name="totalEarnings"
                    placeholder='0'
                    defaultValue={filteredBike.totalEarnings}
                    type='number'
                  // disabled
                  />
                </Grid>
                {/* Total Costs */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="totalCosts"
                    label="Total Costs"
                    name="totalCosts"
                    placeholder='0'
                    type='number'
                    defaultValue={filteredBike.totalCosts}
                  // disabled
                  />
                </Grid>
                {/* Last Maintenance Date */}
                <Grid item xs={3} style={{ display: "flex", alignItems: "center", justifyContent: '' }}>
                  <h3 style={{ margin: 0 }} >Last Maintenance Date</h3>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="lastMaintenanceDate"
                    name="lastMaintenanceDate"
                    placeholder=''
                    type='date'
                    defaultValue={filteredBike ? formatDate(filteredBike.lastMaintenanceDate) : ''}
                  />
                </Grid>
                {/* Fuel Type */}
                <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
                  <h3 style={{ margin: 0 }} id="demo-simple-select-label">Fuel Type</h3>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth
                    label="Fuel"
                    defaultValue={filteredBike.fuel}
                    name='fuel'
                    placeholder='Select Type'
                    onChange={handleChangeFuel}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Petrol"}>Petrol</MenuItem>
                    <MenuItem value={"Diesel"}>Diesel</MenuItem>
                    <MenuItem value={"Electric"} disable>Electric</MenuItem>
                  </Select>
                </Grid>

                {/* submit button */}

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {editLoader ? <CircularProgress color="inherit" /> : "Confirm Edit"}
              </Button>
              {error ? <Typography color="red" sx={{ flex: 1, textAlign: "center" }}>
                {error}
              </Typography> : ""}
              {successMsg ? <Typography color="green" sx={{ flex: 1, textAlign: "center" }}>
                {successMsg}
              </Typography> : ""}
            </Box>
          </>
        )}
      </Paper>

      {/* Modal to Show Succes Message */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "green" }}>
            {successMsg}
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Edit Bike details from app
          </Typography> */}
        </Box>
      </Modal>


      {/* All bikes */}
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
            <Title>Bike Record</Title>
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

                {bikes.map((bike) => (
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
          </React.Fragment>
        ) : (
          <p>No bikes found</p>
        )}
      </Paper>
    </>
  );
}