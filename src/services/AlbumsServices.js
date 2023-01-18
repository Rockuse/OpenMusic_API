const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const NotFoundError = require('../utils/exceptions/NotFoundError');

const idGenerator = require('../utils/generator');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = idGenerator('album');
    const query = {
      text: 'INSERT INTO "Albums" VALUES($1,$2,$3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Albums Gagal Ditambahkan');
    }
    console.log(typeof result.rows[0].id);
    return result.rows[0].id;
  }

  async getAlbum() {
    const result = await this._pool.query('SELECT * FROM "Albums"');
    if (!result.rows.length) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM "Albums" WHERE id=$1',
      values: [id],
    };
    const result = await this._pool.query(query);
    // console.log(result.rows);
    if (!result.rows.length) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    return result.rows[0];
  }

  async editAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE "Albums" SET name=$2,year=$3  WHERE id=$1 RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM "Albums" WHERE id=$1 RETURNING ID',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }
}

module.exports = AlbumsService;
