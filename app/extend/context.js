'use strict';
module.exports = {
  get db() {
    return this.app.db;
  },
  get schedule() {
    return this.app.schedule;
  }
};