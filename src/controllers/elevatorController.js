const { db } = require('../models/elevatorModel');
const { UP, DOWN } = require('../utils/constants');

const getElevators = (req, res) => {
  const elevators = db.get('elevators').value();
  res.json(elevators);
};

const setDoorState = (req, res) => {
  const { elevatorId, state } = req.body;
  const elevator = db.get('elevators').find({ id: elevatorId }).value();
  elevator.doorState = state;
  db.get('elevators').find({ id: elevatorId }).assign(elevator).write();
  res.json(db.get('elevators').value());
};

const callElevator = (req, res) => {
  const { floor, direction } = req.body;
  const elevators = db.get('elevators').value();

  let closestElevator = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  elevators.forEach((elevator) => {
    if (!elevator.moving) {
      const distance = Math.abs(elevator.currentFloor - floor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElevator = elevator;
      }
    }
  });

  if (closestElevator.currentFloor < floor) {
    closestElevator.direction = UP;
  } else if (closestElevator.currentFloor > floor) {
    closestElevator.direction = DOWN;
  }

  closestElevator.requestedFloor = floor;
  closestElevator.requestedDirection = direction;

  db.get('elevators').find({ id: closestElevator.id }).assign(closestElevator).write();

  res.json(db.get('elevators').value());
};

const addDestination = (req, res) => {
  const { elevatorId, destinationFloor } = req.body;
  const elevator = db.get('elevators').find({ id: elevatorId }).value();

  elevator.requestedFloor = destinationFloor;
  elevator.requestedDirection = elevator.direction;
  elevator.direction = elevator.currentFloor < destinationFloor ? UP : DOWN;
  elevator.doorState = 'close';

  db.get('elevators').find({ id: elevatorId }).assign(elevator).write();

  res.json(db.get('elevators').value());
};

module.exports = {
  getElevators,
  setDoorState,
  callElevator,
  addDestination,
};
