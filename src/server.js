const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require('./routes/usersRoutes');
const identitiesRoutes = require('./routes/identitiesRoutes');

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/users', usersRoutes);
app.use('/api/identity', identitiesRoutes);

//home route
app.get('/', (req, res) => {
    res.json({
        message: 'Identity & Profile Management API is running'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});