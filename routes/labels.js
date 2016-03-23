'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', function(req, res) {
  db.Label.findAll({ include: db.Memo })
  .then((labels) => res.status(200).send(labels))
  .catch((err) => res.status(500).send(err));
});

router.put('/:name', function(req, res) {
  db.Label.findOne({ where: { name: req.params.name } })
  .then((label) => label.update({ name: req.body.name }))
  .then((label) => res.status(200).send(label))
  .catch((err) => res.status(500).send(err));
});

module.exports = router;
