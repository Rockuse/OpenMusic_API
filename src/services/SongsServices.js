const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const NotFoundError = require('../utils/exceptions/NotFoundError');
const idGenerator = require('../utils/generator');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration = 0, albumId = '',
  }) {
    const id = idGenerator('songs');
    const query = {
      text: 'INSERT INTO "Songs" values($1,$2,$3,$4,$5,$6,$7) RETURNING ID',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSong() {
    const result = await this._pool.query('SELECT * FROM "Songs"');
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows;
  }

  async getSongById(id, { title = '', performer = '' }) {
    const query = {
      // eslint-disable-next-line quotes
      text: `SELECT * FROM "Songs" where id = $1 ${(title.length) ? `AND title like '%${title}%'` : ""} ${(performer.length) ? `AND performer like '%${performer}%'` : ""}`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }

  async editSongById(id, payload) {
    const {
      title, year, genre, performer, duration, albumId,
    } = payload;
    const query = {
      text: 'UPDATE "Songs" set title=$1, year=$2, genre=$3, performer=$4, duration=$5, albumId=$6 where id=$7 RETURNING ID',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(query);
    }
    return result.rows[0].id;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM "Songs" where id=$1 RETURNING ID',
      values: [id],
    };
    const result = this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(query);
    }
    return result.rows[0].id;
  }
}

module.exports = AlbumsService;
