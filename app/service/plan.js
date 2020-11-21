'use strict';
const { Service } = require('egg');
const Collection = require('../lib/db/collection');
const Query = require('../lib/db/query');

module.exports = class QyapiService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.colllection = new Collection(ctx.db, 'plan');
  }
  getList() {
    const query = new Query();
    const list = this.colllection.getPager(query);

    return list;
  }
  get(id) {
    return this.colllection.getByWhere({ id });
  }
  save(json) {
    Reflect.deleteProperty(json, 'online');

    const found = this.colllection.getByWhere({ id: json.id }).value();
    if (found) {
      return this.colllection.update({ id: json.id }, json);
    }
    json.id = this.ctx.db.getUniqueId();
    return this.colllection.add(json);
  }
  saveList(list) {
    const jsons = list.map(json => {
      return this.save(json);
    });
    return jsons;
  }
  delete(id) {
    return this.colllection.delete({ id });
  }
};