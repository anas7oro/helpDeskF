// Import necessary components and libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const ViewMyTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/getMyTickets'); // Adjust the endpoint accordingly
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error.response.data);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Tickets
      </Typography>
      {tickets.length === 0 ? (
        <Typography variant="body1">No tickets found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Status</TableCell>
                {/* Add more columns as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{ticket.subCategory}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  {/* Add more cells for additional columns */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ViewMyTickets;