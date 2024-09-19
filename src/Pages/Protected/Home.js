import React from 'react'
import CustomMarker from '../../assets/images/bike2.png'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Deposits from './Deposits';
import { Copyright } from '@mui/icons-material';
import Maps from './Maps';
import Users from './Users';
export default function Home() {
  return (
    
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12}>
          <Maps 
          status={"all"}/>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
      <Deposits />
   
      
          {/* <Chart /> */}
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
          <Deposits />
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
          <Users />
      </Grid>
    </Grid>
  )
}
