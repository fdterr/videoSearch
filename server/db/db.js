const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');

// const db = new Sequelize(
//   process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
//   {
//     logging: false
//   }
// )

const username = process.env.user_name;
const password = process.env.password;

const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${username}:${password}@localhost:5432/${databaseName}`,
  {
    logging: false
  }
);
module.exports = db;

if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close());
}
