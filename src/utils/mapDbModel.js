const data = {};
const mapDBModel = (albums, songs) => {
  Object.assign(
    data,
    {
      id: albums.id,
      name: albums.name,
      year: albums.year,
      songs,
    },
  );
  return data;
};
const mapPlaylist = (item) => ({
  playlist: {
    id: item[0].playlist_id,
    name: item[0].name,
    username: item[0].username,
    songs: item.map((ele) => ({ id: ele.id, title: ele.id, performer: ele.performer })),
  },
});
const mapActivities = (item) => ({
  playlistId: item[0].id,
  activities: item.map((ele) => ({
    username: ele.username,
    title: ele.title,
    action: ele.action,
    time: ele.time,
  })),

});
module.exports = { mapDBModel, mapPlaylist, mapActivities };
