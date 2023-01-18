const { Pool } = require('pg');
const InvariantError = require('../utils/exceptions/InvariantError');
const idGenerator = require('../utils/generator');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  addAlbum({ name, year }) {
    const id = idGenerator('album');
    const query = {
      text: 'INSERT INTO albums VALUES($1,$2,$3) RETURNING id',
      values: [id, name, year],
    };
    const result = this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Albums Gagal Ditambahkan');
    }
    return result.rows[0].id;
  }

  getAlbum() {
    const result = this._pool.query('SELECT * FROM albums');
    if (!result.rows.length) {
      throw new InvariantError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [id],
    };
    const result = this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  editAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$2,year=$3  WHERE id=$1 RETURNING id',
      values: [id, name, year],
    };
    const result = this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id=$1',
      values: [id],
    };
    const result = this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }
}

module.exports = AlbumsService;
