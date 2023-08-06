const express = require('express');
const cors = require('cors');
const { PORT, MOVEMENT_INTERVAL } = require('./utils/constants');
const handleElevatorMovements = require('./services/elevatorService');

const elevatorRoutes = require('./routes/elevatorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

setInterval(handleElevatorMovements, MOVEMENT_INTERVAL);

app.use('/api', elevatorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
