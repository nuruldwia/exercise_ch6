require('dotenv').config();
const express = require('express');
const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

const userRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));