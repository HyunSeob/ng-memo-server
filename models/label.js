'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Label', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  });
};
