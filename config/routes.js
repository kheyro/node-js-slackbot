const express = require('express');
const router = express.Router();

const c = require('../app/controllers');

router
  .route('/')
  .get(c.application.getIndex)
  .post(c.application.postIndex);

module.exports = router;
