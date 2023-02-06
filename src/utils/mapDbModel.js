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
    id: item.playlist_id[0],
    name: item.name[0],
    username: item.username[0],
    songs: item.map((ele) => [{ id: ele.id, title: ele.id, performer: ele.performer }]),
  },
});
module.exports = { mapDBModel, mapPlaylist };
