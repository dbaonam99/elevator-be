const express = require('express');
const elevatorController = require('../controllers/elevatorController');

const router = express.Router();

router.get('/elevators', elevatorController.getElevators);
router.post('/door-state', elevatorController.setDoorState);
router.post('/call-elevator', elevatorController.callElevator);
router.post('/add-destination', elevatorController.addDestination);

module.exports = router;
