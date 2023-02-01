const { Pool } = require('pg');
const idGenerator = require('../utils/generator');

class Playlist {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = idGenerator('playlist');
    
  }
}
module.exports = Playlist;
