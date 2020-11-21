'use strict';

module.exports = class QyapiApp {
  constructor(app) {
    this.app = app;
  }

  async didReady() {
    const ctx = await this.app.createAnonymousContext();
    const data = ctx.service.plan.getList();
    data.list.forEach(task => {
      ctx.service.schedule.execute(task);
    });
  }

  async beforeClose() {
    const ctx = await this.app.createAnonymousContext();
    ctx.service.schedule.cancelAll();
  }
};