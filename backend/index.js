import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/mongodb.js';
import patientRoute from './routes/patientRoute.js';
import doctorRoute from './routes/doctorRoute.js';
import adminRoute from './routes/adminRoute.js';
import generalRoute from './routes/generalRoute.js';
import cors from 'cors';

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

//config
connectDB();

//middlewares

app.use(express.json());
app.use(cors());

//endpoints

app.use("/api/patient", patientRoute)
app.use("/api/doctor", doctorRoute)
app.use("/api/admin", adminRoute)
app.use("/api/general", generalRoute)

//localhost:5000/

app.get('/', (req, res) => {
    res.send('Api is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});