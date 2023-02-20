/* eslint-disable import/no-extraneous-dependencies */
const { Pool } = require('pg');
const autoBind = require('auto-bind');
const InvariantError = require('../../utils/exceptions/InvariantError');
const NotFoundError = require('../../utils/exceptions/NotFoundError');
const SongsService = require('./SongsServices');
const idGenerator = require('../../utils/generator');
const { mapDBModel } = require('../../utils/mapDbModel');
class AlbumsService {
  constructor(cache) {
    this._pool = new Pool();
    this._songService= new SongsService()
    this._cacheService= cache
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
    return result.rows[0].id;
  }

  async getAlbum() {
    const result = await this._pool.query('SELECT * FROM albums');
    if (!result.rowCount) {
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
    if (!albums.rowCount) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    const songs = await this._songService.getSongByAlbum(id);
    return mapDBModel(albums.rows[0], songs);
  }

  async editAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$2,year=$3  WHERE id=$1 RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
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
    if (!result.rowCount) {
      throw new NotFoundError('Albums Tidak Ditemukan');
    }
    return result.rows;
  }

  // V3
  async editAlbumCoverById(id, path) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [path, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  async addAlbumLikeById(albumId, userId) {
    const id = idGenerator('like');

    const queryCheckLike = {
      text: `SELECT id FROM user_album_likes 
      WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const resultCheck = await this._pool.query(queryCheckLike);

    if (!resultCheck.rowCount) {
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Gagal menambahkan like');
      }
    } else {
      await this.deleteAlbumLikeById(albumId, userId);
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async deleteAlbumLikeById(albumId, userId) {
    const query = {
      text: `DELETE FROM user_album_likes 
      WHERE user_id = $1 AND album_id = $2 
      RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus like');
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getAlbumLikesById(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      const likes = parseInt(result);
      return {
        cache: true,
        likes,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Gagal mengambil like');
      }

      const likes = parseInt(result.rows[0].count);

      await this._cacheService.set(`album-likes:${albumId}`, likes);
      return {
        cache: false,
        likes,
      };
    }
  }
}

module.exports = AlbumsService;
