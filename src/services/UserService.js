const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const idGenerator = require('../utils/generator');
const NotFoundError = require('../utils/exceptions/NotFoundError');
const InvariantError = require('../utils/exceptions/InvariantError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);
    const id = idGenerator('user');
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users values($1,$2,$3,$4) returning id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const result = await this._pool.query(`select * from users where username=\'${username}\'`);
    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async getUsers() {
    const query = { text: 'SELECT * FROM users' };
    const result = this._pool.query(query);
    return result.rows;
  }

  async getUserById(id) {
    const query = { text: `SELECT id, username, fullname FROM users where id=\'${id}\'` };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UserService;
