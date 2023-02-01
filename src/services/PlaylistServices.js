const { Pool } = require('pg');

class Playlist {
  constructor() {
    this._pool = new Pool();
  }
  
}
module.exports = Playlist;
