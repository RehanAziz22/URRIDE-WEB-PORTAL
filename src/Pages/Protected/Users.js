import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { BASE_URL } from '../../config/config';


function preventDefault(event) {
  event.preventDefault();
}

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}users`);
        // Replace with your API endpoint
        setUsers(response.data.data);
        console.log(users)
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        // height: 240,
      }}
    >
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching users: {error.message}</p>}
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
  );
}