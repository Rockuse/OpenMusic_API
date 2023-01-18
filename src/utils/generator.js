const { nanoid } = require('nanoid');

const idGenerator = (text) => `${text}-${nanoid()}`;
module.exports = idGenerator;
