import axios from "axios";
const API_URL = "http://localhost:3000/api/manager";

// import React, { useEffect, useState } from "react";
const getReports = async () => {
    try {
        console.log("trying to get reports in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}/manegeReports`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}

const getReport = async (selectedTicketId) => { 
    try {
        console.log("trying to get report in server from ==", selectedTicketId);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        console.log("config: ", config);
        const res = await axios.get(`${API_URL}/getReport/${selectedTicketId}`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const editReport = async (form) => {
    try {
        console.log("trying to edit report in server");
        console.log("form: ", form);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const res = await axios.put(`${API_URL}/updateReport/${form.id}`, form, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const getTickets = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}/getTickets`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const createReport = async (form) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        console.log("trying to create report in server ", form);
        const res = await axios.post(`${API_URL}/createReport`, form, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}

const reportService = {
    getReports,
    getTickets,
    createReport,
    getReport,
    editReport
}
export default reportService;