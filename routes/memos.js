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

router.put('/', function(req, res) {
  let labelName;
  db.Label.findOrCreate({ where: { name: req.body.label }})
  .then(function(labels) {
    labelName = labels[0].dataValues.name;
    return db.Memo.findAll({ where: { id: req.body.memos }});
  })
  .then(function(memos) {
    return Promise.each(memos, function(memo) {
      return memo.addLabel(labelName);
    });
  })
  .then(function(memos) {
    res.status(200).send(memos);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send(err);
  });
});

router.delete('/', function(req, res) {
  let deleteIds = req.query.memos.split(',');
  db.Memo.destroy({ where: { id: deleteIds } })
  .then(function() {
    res.sendStatus(200);
  }).catch(function(err) {
    console.log(err);
    res.status(500).send(err);
  });
});

router.get('/:id', function(req, res) {
  db.Memo.findOne({ where: { id: req.params.id }})
  .then(function(memo) {
    res.status(200).send(memo);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
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
    res.status(200).send(memoGlobal);
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

module.exports = router;
