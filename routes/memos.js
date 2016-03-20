'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');
const Promise = require('bluebird');

router.get('/', function(req, res) {
  db.Memo.findAll({
    include: {
      model: db.Label,
      attributes: ['name'],
      through: { attributes: [] } // only name
    }
  })
  .then((memos) => res.status(200).send(memos))
  .catch((err) => res.status(500).send(err));
});

router.post('/', function(req, res) {
  db.Memo.create(req.body.memo)
  .then(function(memo) {
    memo.dataValues.Labels = [];
    res.status(200).send(memo);
  }).catch((err) => res.status(500).send(err));
});

router.put('/:id', function(req, res) {
  let memoGlobal;
  db.Memo.findOne({ where: { id: req.params.id } })
  .then(function(memo) {
    memoGlobal = memo;
    return memo.update(req.body);
  }).then(function() {
    return Promise.each(req.body.Labels, function(label) {
      return db.Label.findOrCreate({
        where: { name: label.name },
        defaults: { name: label.name }
      });
    });
  }).then(function(labels) {
    return memoGlobal.setLabels(labels.map((label) => label.name));
  }).then(function() {
    res.sendStatus(200);
  }).catch(function(err) {
    console.log(err);
    res.status(500).send(err);
  });
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
