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
  .then((label) => { console.log('label', label); return label.update({ name: req.body.name }); })
  .then((label) => { return res.status(200).send(label); })
  .catch((err) => { console.log(err); res.status(500).send(err); });
});

module.exports = router;
