// Import necessary components and libraries
import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const CreateTicket = () => {
  const [ticketData, setTicketData] = useState({
    category: '',
    subCategory: '',
    title: '',
    description: '',
    priority: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getSubcategories = () => {
    switch (ticketData.category) {
      case 'hardware':
        return ['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment', 'Other'];
      case 'software':
        return ['Operating system', 'Application software', 'Custom software', 'Integration issues', 'Other'];
      case 'network':
        return ['Email issues', 'Internet connection problems', 'Website errors', 'Other'];
      default:
        return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/createTicket', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Ticket creation response:', response.data);

      setTicketData({
        category: '',
        subCategory: '',
        title: '',
        description: '',
        priority: '',
      });
    } catch (error) {
      console.error('Error creating ticket:', error.response.data);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Create Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="category">Category</InputLabel>
          <Select
            label="Category"
            id="category"
            name="category"
            value={ticketData.category}
            onChange={handleChange}
            required  // Add required attribute
          >
            <MenuItem value="hardware">Hardware</MenuItem>
            <MenuItem value="software">Software</MenuItem>
            <MenuItem value="network">Network</MenuItem>
          </Select>
        </FormControl>

        {/* Subcategory Dropdown */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="subCategory">Subcategory</InputLabel>
          <Select
            label="Subcategory"
            id="subCategory"
            name="subCategory"
            value={ticketData.subCategory}
            onChange={handleChange}
            required  // Add required attribute
          >
            {getSubcategories().map((subcategory) => (
              <MenuItem key={subcategory} value={subcategory}>
                {subcategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Title, Description, and Priority Inputs */}
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Title"
          name="title"
          value={ticketData.title}
          onChange={handleChange}
          required  // Add required attribute
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Description"
          name="description"
          value={ticketData.description}
          onChange={handleChange}
          multiline
          rows={4}
          required  // Add required attribute
        />

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="priority">Priority</InputLabel>
          <Select
            label="Priority"
            id="priority"
            name="priority"
            value={ticketData.priority}
            onChange={handleChange}
            required  // Add required attribute
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary">
          Create Ticket
        </Button>
      </form>
    </div>
  );
};

export default CreateTicket;