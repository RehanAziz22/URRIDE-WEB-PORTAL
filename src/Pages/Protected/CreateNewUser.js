import * as React from 'react';
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
import { BASE_URL } from '../../config/config';
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function CreateNewUser() {
  const [contactVerified, setContactVerified] = React.useState(false)
  const [otpVerified, setOtpVerified] = React.useState(false)
  const [isloading, setLoader] = React.useState(false)
  const [isSignup, setIsSignup] = React.useState(false)
  const [user, setUser] = React.useState()
  const [count, setCount] = React.useState(60)
  const [successMsg, setSuccessMsg] = React.useState()
  const [error, setError] = React.useState()

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setContactVerified(false)
    setOtpVerified(false)
    setError('')
    setSuccessMsg('')
    navigate('/dashboard/createNewUser');
  }
  const navigate = useNavigate();

  // Count Down to 60Sec to resend OTP
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (count == 0) {
        clearInterval(interval)
      }
      else {
        setCount(count - 1)
      }
    }, 1000);
    return () => {
      clearInterval(interval)
    }
  }, [count])


  // signup
  let signup = (event) => {
    event.preventDefault();
    setError('')
    setSuccessMsg('')
    setLoader(true)
    const data = new FormData(event.currentTarget);
    const objToSend = {
      mobileNumber: data.get('contact'),
    }
    console.log(objToSend)

    axios.post(`${BASE_URL}signup`, objToSend)
      .then((res) => {
        console.log(res.data, "response");
        const { success, msg, user } = res.data
        if (success) {
          //true
          console.log(res.data)
          setSuccessMsg(msg)
          setLoader(false)
          // addSignupUser(user)
          setUser(user)
          // setIsSignup(true)
          setContactVerified(true)
        } else {
          //false
          console.log(res.data.message)
          // alert(res.data.message)
          setError(res.data.message)
          setLoader(false)

        }
      }
      ).catch(
        (error) => { console.log(error, "error") }
      )
  }

  // Verify Otp
  const otpValidate = (event) => {
    event.preventDefault();
    setLoader(true)
    setError("")
    setSuccessMsg('')
    const data = new FormData(event.currentTarget);

    const objToSend = {
      mobileNumber: user.mobileNumber,
      otp: data.get("otp")

    }
    axios.post(`${BASE_URL}verify-otp`, objToSend)
      .then((res) => {
        console.log(res.data, "response");
        const { status, message, user } = res.data
        if (status) {
          //true
          console.log(res.data)
          setSuccessMsg(message)
          setLoader(false)
          // addLoginUser(user)

          // navigation.navigate('createPin', user)
          // setIsSignup(false)
          setOtpVerified(true)
        } else {
          //false
          console.log(res.data.message)
          // alert(res.data.message)
          setError(res.data.message)
          setLoader(false)

        }
      }
      ).catch(
        (error) => { console.log(error, "error") }
      )
  }

  // Resend OTP
  const resendOTP = () => {
    // setLoader(true)
    setError("")
    setSuccessMsg('')
    setCount(60)
    const objToSend = {
      mobileNumber: user.mobileNumber,
    }
    axios.post(`${BASE_URL}resend-otp`, objToSend)
      .then((res) => {
        console.log(res.data, "response");
        const { status, msg, data } = res.data
        if (status) {
          //true
          console.log(res.data)
          setSuccessMsg(msg)
          setLoader(false)
          // addLoginUser(user)
        } else {
          //false
          console.log(res.data.msg)
          // alert(res.data.message)
          setError(res.data.msg)
          setLoader(false)

        }
      }
      ).catch(
        (error) => { console.log(error, "error") }
      )
  }

  // Validate Pin
  let pinValidate = (event) => {
    event.preventDefault();
    setLoader(true)
    setError('')
    setSuccessMsg('')

    const data = new FormData(event.currentTarget);

    let enteredPin = data.get("pin");
    let confirmPin = data.get("confirmPin");
    console.log(user)
    const objToSend = {
      id: user._id,
      pin: confirmPin
    }
    if (enteredPin == confirmPin) {
      console.log("PIN Matched")
      axios.post(`${BASE_URL}gen-pin`, objToSend)
        .then((res) => {
          console.log(res.data, "response");
          const { status, message, user } = res.data
          if (status) {
            //true
            console.log(res.data)
            setSuccessMsg(message)
            setLoader(false)
            setOpen(true)


          } else {
            //false
            console.log(res.data.message)
            // alert(res.data.message)
            setError(res.data.message)
            setLoader(false)

          }
        }
        ).catch(
          (error) => { console.log(error, "error") }
        )
    }
    else {
      setLoader(false)
      setError("Pin does not match")
    }
  }
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
            {/* Add Contact Number */}
            {!contactVerified &&
              <Box component="form" noValidate onSubmit={signup}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="contact"
                      label="Contact"
                      name="contact"
                      placeholder='+92 XXXXXXXXXX'
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isloading ? <CircularProgress color="inherit" /> : "Create User"}
                </Button>
                {error ? <Typography color="red" sx={{ flex: 1, textAlign: "center" }}>
                  {error}
                </Typography> : ""}
                {successMsg ? <Typography color="green" sx={{ flex: 1, textAlign: "center" }}>
                  {successMsg}
                </Typography> : ""}
              </Box>
            }

            {/* Verify OTP Pin */}
            {contactVerified && !otpVerified &&

              <Box component="form" noValidate onSubmit={otpValidate}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="otp"
                      label="OTP"
                      name="otp"
                      placeholder='XXXX'
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>

                  {count == 0 &&

                    (<Button sx={{ color: count == 0 ? "#4CB1DC" : "black", display: "flex", justifyContent: "center", marginTop: 2 }} onClick={resendOTP}>Resend OTP</Button>)
                  }
                  {count !== 0 &&
                    (<Typography sx={{ display: "flex", textAlign: "center", marginTop: 2 }} >{count + ' seconds'}</Typography>)
                  }</Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isloading ? <CircularProgress color="inherit" /> : "Verify"}
                </Button>
                {error ? <Typography color="red" sx={{ flex: 1, textAlign: "center" }}>
                  {error}
                </Typography> : ""}
                {successMsg ? <Typography color="green" sx={{ flex: 1, textAlign: "center" }}>
                  {successMsg}
                </Typography> : ""}
              </Box>
            }

            {/* Create 4 Digit Pin */}
            {otpVerified &&

              <Box component="form" noValidate onSubmit={pinValidate}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="pin"
                      label="Pin"
                      name="pin"
                      placeholder='XXXX'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="confirmPin"
                      label="Confirm Pin"
                      name="confirmPin"
                      placeholder='XXXX'
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isloading ? <CircularProgress color="inherit" /> : "Create Pin"}
                </Button>
                {error ? <Typography color="red" sx={{ flex: 1, textAlign: "center" }}>
                  {error}
                </Typography> : ""}
                {successMsg ? <Typography color="green" sx={{ flex: 1, textAlign: "center" }}>
                  {successMsg}
                </Typography> : ""}
              </Box>
            }
          </Box>
        </Container>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Created Successfully
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Edit Name and other details from app
          </Typography>
        </Box>
      </Modal>

    </ThemeProvider>
  );
}