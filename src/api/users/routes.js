const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (req, h) => handler.postUser(req, h),
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (req, h) => handler.getUserById(req, h),
  },
  {
    method: 'GET',
    path: '/users',
    handler: (req, h) => handler.getUsersByUsernameHandler(req, h),
  },
];

module.exports = routes;
