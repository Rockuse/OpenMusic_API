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

module.exports = mapDBModel;
