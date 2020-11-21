'usestrict';

const { Controller } = require('egg');

module.exports = class QyapiController extends Controller {
  async list(ctx) {
    const { list } = ctx.service.plan.getList();
    list.forEach(task => {
      const online = ctx.service.schedule.checkOnline(task);
      Reflect.set(task, 'online', online);
    });

    ctx.body = list;
  }
  async save(ctx) {
    const list = ctx.service.plan.saveList(ctx.request.body);

    // schedule
    list.forEach(task => {
      ctx.service.schedule.execute(task);

      const online = ctx.service.schedule.checkOnline(task);
      Reflect.set(task, 'online', online);
    });

    ctx.body = list;
  }
};