'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/', function(req, res) {
  db.Memo.findAll({ include: db.Label })
  .then((memos) => res.status(200).send(memos))
  .catch((err) => res.status(500).send(err));
});

router.post('/', function(req, res) {
  db.Memo.create(req.body.memo)
  .then((memo) => res.status(200).send(memo))
  .catch((err) => res.status(500).send(err));
});

router.put('/:id', function(req, res) {
  db.Memo.update(req.body, { where: { id: req.params.id }})
  .then(() => res.sendStatus(200))
  .catch((err) => res.status(500).send(err));
});

router.delete('/:id', function(req, res) {
  db.Memo.destroy({ where: { id: req.params.id }})
  .then(() => res.sendStatus(200))
  .catch((err) => res.status(500).send(err));
});

// router.get('/:memoId', function(req, res, next) {
//   db.Memo.
//   res.status(200).send({ message: 'good' });
// });

module.exports = router;
