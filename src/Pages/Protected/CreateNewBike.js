import React from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { BASE_URL } from '../../config/config';
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function CreateNewBike() {
  const [fuel, setFuel] = React.useState('');
  const navigate = useNavigate();
  const [isloading, setLoader] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState()
  const [error, setError] = React.useState()
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef();
  const plateNoRef = React.useRef();
  const modelRef = React.useRef();
  const fuelEffRef = React.useRef();
  const fuelLevelRef = React.useRef();
  const fuelTankRef = React.useRef();
  const averageRef = React.useRef();
  const dateRef = React.useRef();
  const PetrolTypeRef = React.useRef();

  const handleChangeFuel = (event) => {
    setFuel(event.target.value.toString());
    console.log(fuel)
  };
  const date = new Date()
  // console.log(date)


  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccessMsg('');
    plateNoRef.current.value = '';
    modelRef.current.value = '';
    fuelEffRef.current.value = '';
    fuelLevelRef.current.value = '';
    fuelTankRef.current.value = '';
    averageRef.current.value = '';
    dateRef.current.value = '';
    PetrolTypeRef.current.value = '';
    // navigate('/dashboard/createNewBike');
  };


  // addBike
  let addBike = (event) => {
    event.preventDefault(); // Prevents the default form submission

    setError('');
    setSuccessMsg('');
    setLoader(true);

    const data = new FormData(event.currentTarget);
    const objToSend = {
      plateNo: data.get('plateNo'),
      model: data.get('model'),
      status: "available",
      fuelLevel: data.get('fuelLevel'),
      lastMaintenanceDate: data.get('lastMaintenanceDate') || `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      markerVisible: true,
      fuel: data.get('fuel'),
      mileage: data.get('mileage'),
      fuelEfficiency: data.get('fuelEfficiency'),
      fuelTankCapacity: data.get('fuelTankCapacity'),
    };
    // Check if all required fields are non-empty
    const areAllFieldsValid = Object.values(objToSend).every(value => value !== null && value !== undefined && value !== "");

    if (areAllFieldsValid) {
      axios.post(`${BASE_URL}bike`, objToSend)
        .then((res) => {
          const { success, message } = res.data;
          if (success) {
            setOpen(true);
            setSuccessMsg(message);
            navigate('/dashboard/createNewBike');
          } else {
            setError(message);
          }
          setLoader(false);
        })
        .catch((error) => {
          console.log(error, "error");
          setLoader(false);
        });
    }
    else {
      setError("Required Fields are missing")
      setLoader(false);

    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container component="main" >
          {/* <CssBaseline /> */}
          <Box>
            <Box component="form" noValidate onSubmit={addBike}>
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
                    inputRef={plateNoRef}
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
                    inputRef={modelRef}
                  />
                </Grid>
                {/* Bike Status */}
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="status"
                    label="Bike Status"
                    name="status"
                    placeholder='Status'
                    value={"Avaliable"}
                    disabled
                  />
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
                    inputRef={fuelLevelRef}
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
                    inputRef={fuelEffRef}
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
                    inputRef={fuelTankRef}
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
                    inputRef={averageRef}
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
                    defaultValue={0}
                    type='number'
                    disabled
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
                    value={0}
                    defaultValue={0}
                    disabled
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
                    inputRef={dateRef}
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

                    name='fuel'
                    placeholder='Select Type'
                    onChange={handleChangeFuel}
                    inputRef={PetrolTypeRef}
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isloading ? <CircularProgress color="inherit" /> : "Add Bike"}
                </Button>
                {error ? <Typography color="red" sx={{ flex: 1, textAlign: "center" }}>
                  {error}
                </Typography> : ""}
                {successMsg ? <Typography color="green" sx={{ flex: 1, textAlign: "center" }}>
                  {successMsg}
                </Typography> : ""}
                {/* Modal to Show Succes Message */}


              </Grid>
            </Box>
          </Box>
        </Container>
      </Paper>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Bike Created Successfully
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Edit Bike details from app
          </Typography>
        </Box>
      </Modal>
    </ThemeProvider>
  )
}
