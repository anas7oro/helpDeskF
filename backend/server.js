const cron = require('node-cron');
require('dotenv').config();
const {createBackup} = require('./controllers/adminController');
const express = require('express')
const app = express()
const cors = require('cors');


const PORT = process.env.PORT || 5000 

const connectDB = require('./config/db.js');

connectDB(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [],
    methods: ["POST" , "GET"],
    credentials: true
}));

const managerRoutes = require('./routes/managerRoutes'); 
const agentRoutes =require('./routes/agentRoutes')

app.use('/api/users' , require('./routes/userRoutes'));
app.use('/api/admin' , require('./routes/adminRoutes'));
app.use('/api/frontend' , require('./routes/frontendRoutes'));

app.use('/api/agent', (req, res, next) => {console.log(`A ${req.method} request was made to ${req.originalUrl}`);
next();}, agentRoutes); 
app.use('/api/manager', (req, res, next) => {console.log(`A ${req.method} request was made to ${req.originalUrl}`);
next();}, managerRoutes);

app.use('*', (req, res) => {res.status(404).send('API endpoint not found');});
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})
//backup at 12:00 am everyday
cron.schedule('0 0 * * *', () => createBackup());
