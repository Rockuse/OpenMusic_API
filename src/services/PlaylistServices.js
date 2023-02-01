const { Pool } = require('pg');

class Playlist {
  constructor() {
    this._pool = new Pool();
  }
  addPlaylist(){}
}
module.exports = Playlist;
