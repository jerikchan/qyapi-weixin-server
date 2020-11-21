'use strict';
const Factory = require('../lib/db/factory');
const DBSymbol = Symbol('Application#db');
const ScheduleSymbol = Symbol('Service#Schedule');

module.exports = {
  get db() {
    if (!this[DBSymbol]) {
      this[DBSymbol] = Factory();
    }
    return this[DBSymbol];
  },
  get schedule() {
    if (!this[ScheduleSymbol]) {
      this[ScheduleSymbol] = new Map();
    }
    return this[ScheduleSymbol];
  },
};