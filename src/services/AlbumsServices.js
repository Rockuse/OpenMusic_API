/* eslint-disable import/no-extraneous-dependencies */
const { Pool } = require('pg');
const autoBind = require('auto-bind');
const InvariantError = require('../utils/exceptions/InvariantError');
const NotFoundError = require('../utils/exceptions/NotFoundError');
const SongsService = require('./SongsServices');
const idGenerator = require('../utils/generator');
const mapDBModel = require('../utils/mapDbModel');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
    autoBind(this);
  }

  async addAlbum({ name, year }) {
    const id = idGenerator('album');
    const query = {
      text: 'INSERT INTO albums VALUES($1,$2,$3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Albums Gagal Ditambahkan');
    }
    // console.log(typeof result.rows[0].id);
    return result.rows[0].id;
  }

  async getAlbum() {
    const result = await this._pool.query('SELECT * FROM albums');
    if (!result.rows.length) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [id],
    };
    const albums = await this._pool.query(query);
    if (!albums.rows.length) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    const songs = await new SongsService().getSongByAlbum(id);
    return mapDBModel(albums.rows[0], songs);
  }

  async editAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$2,year=$3  WHERE id=$1 RETURNING id',
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
      text: 'DELETE FROM albums WHERE id=$1 RETURNING ID',
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
