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
import { BASE_URL } from '../../config/config';

function preventDefault(event) {
    event.preventDefault();
}

export default function UpdateDeleteUser() {
    const [isloading, setLoader] = React.useState(false)
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [delLoader, setDelLoder] = React.useState(false);
    const [editLoader, setEditLoader] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [successMsg, setSuccessMsg] = React.useState()
    const [filteredUser, setFilteredUser] = React.useState()
    const [editDetails, setEditDetails] = React.useState(false)

    React.useEffect(() => {

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}users`);
            // Replace with your API endpoint
            setUsers(response.data.data);
            console.log(users)
        } catch (error) {
            setError(error || "Error fetching users:");
        } finally {
            setLoading(false);
        }
    };



    let searchUserMobileNumber = (event) => {
        event.preventDefault();
        setSuccessMsg('')
        setError("")
        setEditDetails(false)
        const data = new FormData(event.currentTarget);
        let contact = data.get('contact')
        let user = users.find(user => user.mobileNumber === contact);
        setFilteredUser(user)
        if (!user) {
            setError("No User Found")
        }
    }

    let deleteUser = () => {
        setDelLoder(true)
        setError('')
        setSuccessMsg('')
        let objToSend = {
            id: filteredUser._id
        }
        console.log(objToSend)
        axios.delete(`${BASE_URL}user`, { data: objToSend })
            .then((res) => {
                console.log(res.data);
                const { status, message } = res.data
                if (status) {
                    //true
                    console.log(res.data)
                    setSuccessMsg(message)
                    setFilteredUser('')
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
        if (!editDetails) {
            setEditDetails(true)
            setEditLoader(false)
        } else {
            setEditDetails(false)
            setEditLoader(false)
        }
    }
    const editUser = (event) => {
        event.preventDefault();
        setSuccessMsg('')
        setError("")
        const data = new FormData(event.currentTarget);
        let firstName = data.get('firstName')
        let email = data.get('email')
        if (editDetails) {
            console.log(firstName, email, "user Updated")
            const objToSend = {
                id: filteredUser._id,
                firstName,
                email,
                mobileNumber:filteredUser.mobileNumber
            }
            axios.put(`${BASE_URL}user`, objToSend)
                .then((res) => {
                    console.log(res.data, "response");
                    const { status, message, data } = res.data
                    if (status) {
                        //true
                        console.log(res.data)
                        // setEditDetails((e) => !e)
                        setFilteredUser(data)
                        setEditLoader(false)
                        setEditDetails(false)
                        fetchUsers()
                    } else {
                        //false
                        console.log(res.data.message)
                        // alert(res.data.message)
                        setError(res.data.message)
                        setEditLoader(false)

                    }
                }
                ).catch(
                    (error) => { console.log(error, "error") }
                )

        }
    }

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
                {users.length > 0 ? (

                    <React.Fragment>
                        <Title>Search User</Title>


                        <Box component="form" noValidate onSubmit={searchUserMobileNumber}>
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
                                {isloading ? <CircularProgress color="inherit" /> : "Find User"}
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
                {filteredUser && !editDetails &&
                    (<>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Title>Search Result</Title>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, mr: 2, backgroundColor: "red" }}
                                    onClick={deleteUser}
                                >
                                    {delLoader ? <CircularProgress color="inherit" /> : "Delete User"}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={handleEdit}
                                >
                                    {editLoader ? <CircularProgress color="inherit" /> : "Edit User"}
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>ID</Typography>
                            <Typography variant='h6' component="h2" >{filteredUser._id}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Name</Typography>
                            <Typography variant='h6' component="h2" >{filteredUser.firstName}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Email</Typography>
                            <Typography variant='h6' component="h2" >{filteredUser.email}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant='h6' component="h2" sx={{ fontWeight: "bold" }}>Name</Typography>
                            <Typography variant='h6' component="h2" >{filteredUser.mobileNumber}</Typography>
                        </Box>





                    </>
                    )}

                {editDetails && (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Title>Edit User</Title>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleEdit}
                            >
                                {editLoader ? <CircularProgress color="inherit" /> : "Cancel"}
                            </Button>
                        </Box>
                        <Box component="form" noValidate onSubmit={editUser}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        name="firstName"
                                        defaultValue={filteredUser.firstName}
                                        placeholder='First Name'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        defaultValue={filteredUser.email}
                                        placeholder='Email'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="contact"
                                        label="Contact"
                                        name="contact"
                                        defaultValue={filteredUser.mobileNumber}
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
                                {isloading ? <CircularProgress color="inherit" /> : "Confirm Edit"}
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


            {/* All Users */}
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    // height: 240,
                }}
            >
                {loading && <p>Loading...</p>}
                {users.length > 0 ? (

                    <React.Fragment>
                        <Title>User Record</Title>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Account Balance</TableCell>
                                    <TableCell align="right">Total Rides</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.mobileNumber}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        {/* <TableCell>{user.}</TableCell>
                  <TableCell align="right">{`$${user.}`}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                            See more orders
                        </Link>
                    </React.Fragment>
                ) : (
                    <p>No users found</p>
                )}
            </Paper>
        </>
    );
}