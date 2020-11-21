'usestrict';

const { Controller } = require('egg');

module.exports = class QyapiController extends Controller {
  async send(ctx) {
    const task = ctx.request.body
    ctx.service.schedule.send(task);
    ctx.body = task;
  }
  // async start(ctx) {
  //   const data = ctx.service.plan.getList();
  //   data.list.forEach(task => {
  //     ctx.service.schedule.execute(task);
  //   });
  // }
};