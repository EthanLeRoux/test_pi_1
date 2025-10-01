const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const motionRoutes = require('./routes/motionroutes');

//load env vars
dotenv.config();

const app = express();

// app.use(cors({
//     origin: `${process.env.CORS_ALLOWED_URL}`,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
app.use(bodyParser.json());
app.use('/api/motion',motionRoutes);