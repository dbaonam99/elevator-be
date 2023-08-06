const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { NUM_ELEVATORS, DEFAULT_DOOR_STATE, NUM_FLOORS, IDLE } = require('../utils/constants');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  elevators: new Array(NUM_ELEVATORS).fill(null).map((_, index) => ({
    id: index + 1,
    doorState: DEFAULT_DOOR_STATE,
    currentFloor: 1,
    floorAmount: NUM_FLOORS,
    direction: IDLE,
    moving: false,
  })),
}).write();

module.exports = {
  db,
};
