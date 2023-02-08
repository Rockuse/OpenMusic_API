const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const idGenerator = require('../utils/generator');

class CollaborationServices {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = idGenerator('colla');
    const query = {
      text: 'INSERT INTO collaborations values ($1,$2,$3) returning id',
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Collaboration gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deleteCollaborations(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id={$1} and user_id{$2} returning id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Collaboration gagal dihapus');
    }
  }

  async verifyCollaborations(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id={$1} and user_id{$2} returning id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationServices;
