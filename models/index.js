const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const User = require('./user')(sequelize, DataTypes);
const Genre = require('./genre')(sequelize, DataTypes);
const Movie = require('./movie')(sequelize, DataTypes);

User.hasMany(Movie, { foreignKey: 'authorId' });
Movie.belongsTo(User, { foreignKey: 'authorId' });
Genre.hasMany(Movie, { foreignKey: 'genreId' });
Movie.belongsTo(Genre, { foreignKey: 'genreId' });

module.exports = { sequelize, Sequelize, User, Genre, Movie };
