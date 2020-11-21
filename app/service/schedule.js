'use strict';
const { Service } = require('egg');
const schedule = require('node-schedule');
const axios = require('axios');

const week = 7 * 24 * 60 * 60 * 1000;
// const week = 3 * 1000;

module.exports = class ScheduleService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  cancelAll() {
    const keys = this.ctx.schedule.keys();
    for (const key of keys) {
      this.cancel(key);
    }
  } 
  checkOnline({ id }) {
    return this.ctx.schedule.has(id);
  }
  cancel(id) {
    if (this.ctx.schedule.has(id)) {
      const job = this.ctx.schedule.get(id);
      job.cancel();
      this.ctx.schedule.delete(id);
      this.app.logger.info('cancel, id:', id);
    }
  }
  send(task) {
    const { message = '默认文案', webhook, id } = task;
    this.app.logger.info('sending, id:', id);

    axios({
      method: 'POST',
      url: webhook,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content: message
        }
      })
    });
  }
  execute(task) {
    const { id, time, open = false, useRepeat = false, repeat = 0, webhook, message = '默认文案' } = task;

    // cancel
    this.cancel(id);
    if (!open) {
      return;
    }

    const baseTick = new Date(time).getTime();
    const internal = useRepeat ? repeat * week : 0;
    const nextTick = this._getNextTick(baseTick, internal);
    if (!nextTick) {
      this.app.logger.info('no next tick, id:', id);
      return;
    }

    let repeatBaseTick = nextTick;
    this.app.logger.info('execute, id:', id, 'tick:', repeatBaseTick);

    const job = schedule.scheduleJob(repeatBaseTick, () => {
      this.send({ message, webhook });
      
      // 循环
      if (internal > 0) {
        const nextTick = this._getNextTick(repeatBaseTick, internal);
        job.reschedule(nextTick);
        repeatBaseTick = nextTick;
        this.app.logger.info('execute, id:', id, 'tick:', repeatBaseTick);
      } else {
        this.cancel(id);
      }
    });

    // set
    this.ctx.schedule.set(id, job);
  }
  _getNextTick(nextTick, internal = 0) {
    const now = Date.now();
    if (internal > 0) {
      while (now >= nextTick) {
        nextTick += internal;
      }
    } else {
      nextTick = now >= nextTick ? null : nextTick;
    }
    return nextTick;
  }
};