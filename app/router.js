'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/api/plan/list', controller.plan.list);
  router.post('/api/plan/save', controller.plan.save);

  router.post('/api/schedule/send', controller.schedule.send);
};
