const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const NotFoundError = require('../utils/exceptions/NotFoundError');
const idGenerator = require('../utils/generator');
const { mapPlaylist } = require('../utils/mapDbModel');

class Playlist {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = idGenerator('playlist');
    const query = {
      text: 'INSERT INTO playlists values($1,$2,$3) returning id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist Gagal ditambahkan');
    }
    return result.rows[0];
  }

  async getPlaylist({ id }) {
    const results = await this._pool.query(`SELECT * FROM playlist where id=\'${id}\'`);
    if (!results.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return results.rows;
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = idGenerator('playlist');
    const query = {
      text: 'INSERT INTO playlist_songs values($1,$2,$3) returning id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Song Gagal ditambahkan ke playlist');
    }
  }

  async getSongsFromPlaylist({ id }) {
    const query = {
      text: 'Select c.*,b.playlist_id from playlist a '
      + 'inner join playlist_songs b on b a.id=b.playlist_id'
      + 'inner join songs c on c.id=b.song_id'
      + 'inner join users d on d.id='
      + 'where a.id=$1',
      values: [id],
    };
    const results = await this._pool.query(query);
    if (!results.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return mapPlaylist(results.rows);
  }

  async deleteSongFromPlaylist({ playlistId, songId }) {
    const query = {
      text: 'delete from playlist_songs where playlist_id=$1 and song_id=$2 returning id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Song dari Playlist Gagal dihapus');
    }
  }
}
module.exports = Playlist;
