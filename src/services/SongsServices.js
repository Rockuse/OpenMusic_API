const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const idGenerator = require('../utils/generator');

class AlbumsService {
  constructor() {
    this.Pool = new Pool();
  }
}

module.exports = AlbumsService;
