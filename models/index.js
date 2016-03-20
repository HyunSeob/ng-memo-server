'use strict';

require('dotenv').config();
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    'dialect': process.env.DATABASE_DIALECT,
    'host': process.env.DATABASE_HOST
  }
);

let Memo = sequelize.import(path.join(__dirname, 'memo'));
let Label = sequelize.import(path.join(__dirname, 'label'));

Memo.belongsToMany(Label, { through: 'MemoLabel' });
Label.belongsToMany(Memo, { through: 'MemoLabel' });

let db = {};

db.Memo = Memo;
db.Label = Label;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
