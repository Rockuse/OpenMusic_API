const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUser(request, h) {
    await this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const id = await this._service.addUser({ username, password, fullname });
    const res = h.response({
      status: 'success',
      data: { userId: id },
      message: 'User berhasil ditambahkan',
    });
    res.code(201);
    return res;
  }

  async getUserById(request, h) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    const res = h.response({
      status: 'success',
      data: { user },

    });
    return res;
  }

  async getUsersByUsernameHandler(request, h) {
    const { username = '' } = request.query;
    const users = await this._service.getUsersByUsername(username);
    const res = h.response({
      status: 'success',
      data: { users },

    });
    return res;
  }
}

module.exports = UsersHandler;
