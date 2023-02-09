const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const NotFoundError = require('../utils/exceptions/NotFoundError');
const AuthorizationError = require('../utils/exceptions/AuthorizationError');
const CollaborationServices = require('./CollaborationServices');
const idGenerator = require('../utils/generator');
const { mapPlaylist, mapActivities } = require('../utils/mapDbModel');

class Playlists {
  constructor() {
    this._pool = new Pool();
    this._collaborationServices = new CollaborationServices();
  }

  // -------VERIFY------------
  async verifyPlaylistAccess(credentialId, id = '') {
    try {
      await this.verifyPlaylistOwner(credentialId, id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      try {
        await this._collaborationServices.verifyCollaborations(id, credentialId);
      } catch {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
    }
  }

  async verifyPlaylistOwner(credentialId, id) {
    // -------console.log(`select * from  playlists where id=\'${id}\'`);------------
    const playlist = await this._pool.query(`select * from  playlists where id=\'${id}\'`);
    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const { owner } = playlist.rows[0];
    if (credentialId !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  // -------PLAYLIST------------
  async addPlaylist({ name, credentialId }) {
    const id = idGenerator('playlist');
    const query = {
      text: 'INSERT INTO playlists values($1,$2,$3) returning id',
      values: [id, name, credentialId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist Gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllPlaylist(credentialId) {
    const results = await this._pool.query(`SELECT playlists.id,username,name FROM playlists inner join users on owner = users.id where owner=\'${credentialId}\'`);
    if (!results.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return results.rows;
  }

  async getPlaylist({ id }) {
    const results = await this._pool.query(`SELECT * FROM playlists where id=\'${id}\'`);
    if (!results.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return results.rows;
  }

  async deletePlaylist(id, credentialId) {
    await this.addPlaylistActivities('delete', id, credentialId);
    await this._pool.query(`delete from playlist_songs where playlist_id=\'${id}\'; `);
    await this._pool.query(`delete from playlist_song_activities where playlist_id=\'${id}\'; `);
    const result = await this._pool.query(`delete from playlists where id=\'${id}\' returning id;`);
    if (!result.rowCount) {
      throw new InvariantError('Song dari Playlist Gagal dihapus');
    }
  }

  // -------SONGS------------
  async addSongToPlaylist({ id, songId, credentialId }) {
    const psId = idGenerator('ps');
    const query = {
      text: 'INSERT INTO playlist_songs values($1,$2,$3) returning id',
      values: [psId, id, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Song Gagal ditambahkan ke playlist');
    }
    await this.addPlaylistActivities('add', id, credentialId, songId);
    return result.rows[0].id;
  }

  async getSongsFromPlaylist(id) {
    const query = {
      text: 'Select c.*,b.playlist_id,a.name,d.username from playlists a '
      + 'inner join playlist_songs b on a.id=b.playlist_id '
      + 'inner join songs c on c.id=b.song_id '
      + 'inner join users d on d.id= a.owner '
      + 'where a.id=$1',
      values: [id],
    };
    const results = await this._pool.query(query);
    if (!results.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return mapPlaylist(results.rows);
  }

  async deleteSongFromPlaylist(playlistId, songId, credentialId) {
    await this.addPlaylistActivities('delete', playlistId, credentialId, songId);
    const query = {
      text: 'delete from playlist_songs where playlist_id=$1 and song_id=$2 returning id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Song dari Playlist Gagal dihapus');
    }
  }

  // -------ACTIVITIES------------
  async addPlaylistActivities(action, playlistId, credentialId, songId = '') {
    const paId = idGenerator('pa');
    const query = {
      text: `INSERT INTO playlist_song_activities( id, playlist_id, song_id, user_id, action, time) 
      SELECT \'${paId}\' id, playlist_id, song_id, \'${credentialId}\' user_id, \'${action}\' action, now() time from playlist_songs where 1=1 
      ${songId !== '' ? `and song_id=\'${songId}\'` : ' '} 
      and playlist_id=\'${playlistId}\' returning id`,
    };
    // console.log(query.text);
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist Activities Gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistActivities(id) {
    const query = {
      text: `SELECT DISTINCT e.username,d.title,b.action,b.time,a.id FROM playlists  a 
      inner join playlist_song_activities b on a.id=b.playlist_id
      inner join playlist_songs c on a.id=c.playlist_id
      inner join songs d on d.id=b.song_id
      inner join users e on e.id=b.user_id
      where a.id=\'${id}\'
      order by b.time`,
    };
    // console.log(query.text);
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Activities tidak ditemukan');
    }
    return mapActivities(result.rows);
  }
}

module.exports = Playlists;
