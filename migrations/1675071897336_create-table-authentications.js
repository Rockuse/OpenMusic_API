/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.createTable('user_album_likes', {
    id: {
      type: 'TEXT',
      notNull: true,
    },
    user_id: {
      type: 'TEXT',
      notNull: true,
    },
    album_id: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.sql("INSERT INTO albums(id, name, year) VALUES ('undefined', 'undefined', '2023')");
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
  pgm.dropTable('user_album_likes');
};
