const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {}
  Genre.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Genre name is required' },
          notEmpty: { msg: 'Genre name is required' },
        },
      },
    },
    { sequelize, modelName: 'Genre' }
  );
  return Genre;
};
