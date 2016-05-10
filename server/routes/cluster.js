var express = require('express');
var router = express.Router();
var ml = require('./../machine_learning/musictastelearning');

router.get('/calculate', calculate);

/* GET projects listing. */
function calculate (req, res, next) {
  ml.clustering();
  res.json("success");
};

module.exports = router;
