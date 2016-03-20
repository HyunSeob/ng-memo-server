'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Memo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
