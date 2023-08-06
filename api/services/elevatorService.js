const { db } = require('../models/elevatorModel');
const { IDLE, UP, DOWN, DOOR_INTERVAL, MOVEMENT_INTERVAL } = require('../utils/constants');

const moveElevator = (elevator) => {
  const { currentFloor, requestedFloor, requestedDirection } = elevator;

  if (currentFloor === requestedFloor) {
    elevator.direction = IDLE;
    elevator.requestedDirection = null;
    elevator.moving = false;
    return;
  }

  if (elevator.direction === IDLE) {
    elevator.direction = currentFloor < requestedFloor ? UP : DOWN;
    elevator.moving = true;
  }

  if (requestedFloor && currentFloor < requestedFloor) {
    elevator.currentFloor++;
    elevator.direction = UP;
    elevator.moving = true;
  } else if (requestedFloor && currentFloor > requestedFloor) {
    elevator.currentFloor--;
    elevator.direction = DOWN;
    elevator.moving = true;
  }

  if (elevator.direction === requestedDirection && currentFloor === requestedFloor) {
    elevator.requestedFloor = null;
    elevator.requestedDirection = null;
    elevator.moving = false;
  }
};

const handleElevatorMovements = () => {
  const elevators = db.get('elevators').value();

  elevators.forEach((elevator) => {
    if (elevator.direction !== IDLE) {
      moveElevator(elevator);
    }

    if (elevator.currentFloor === elevator.requestedFloor) {
      elevator.doorState = 'open';
      elevator.moving = false;

      setTimeout(() => {
        elevator.doorState = 'close';
        elevator.requestedFloor = null;
        elevator.requestedDirection = null;
      }, DOOR_INTERVAL);
    }
  });

  db.set('elevators', elevators).write();
};

module.exports = handleElevatorMovements;
