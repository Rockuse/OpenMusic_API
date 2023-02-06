/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
    },
    user_id: {
      type: 'VARCHAR(50)',
    },
  });
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
    },
    song_id: {
      type: 'VARCHAR(50)',
    },
  });
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'TEXT',
    },
    song_id: {
      type: 'INTEGER',
    },
    user_id: {
      type: 'TEXT',
    },
    action: {
      type: 'TEXT',
    },
    time: {
      type: 'INTEGER',
    },
  });
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint(
    'songs',
    'fk_songs.song_id_album.id',
    'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE',
  );

  pgm.addConstraint('playlist_songs', 'fk_songs.song_id_song.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'fk_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  pgm.addConstraint('collaborations', 'unique_collabs', 'UNIQUE(playlist_id, user_id)');

  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.song_id_album.id', { ifExists: true });
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id', { ifExists: true });
  pgm.dropConstraint('playlist_songs', 'fk_songs.song_id_song.id', { ifExists: true });
  pgm.dropConstraint('playlist_songs', 'fk_songs.playlist_id_playlist.id', { ifExists: true });
  pgm.dropConstraint('playlist_song_activities', 'fk_songs.playlist_id_playlist.id', { ifExists: true });
  pgm.dropConstraint('collaborations', 'unique_collabs', { ifExists: true });
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', { ifExists: true });
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id', { ifExists: true });

  pgm.dropTable('users');
  pgm.dropTable('collaborations');
  pgm.dropTable('playlists');
  pgm.dropTable('playlist_songs');
  pgm.dropTable('playlist_song_activities');
};
