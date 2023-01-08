const auth = require('./auth');
const search = require('./buscar');
const categories = require('./categories');
const products = require('./products');
const user = require('./user');
const uploads = require('./uploads');

module.exports = {
  ...auth,
  ...search,
  ...categories,
  ...products,
  ...user,
  ...uploads,
};