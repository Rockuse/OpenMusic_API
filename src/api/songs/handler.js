const autoBind = require('auto-bind');

class Songs {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }
}

module.exports = Songs;
