const express = require('express');
const { illustrationController } = require('../controllers/illustrationController');

const router = express.Router();
router.post('/', illustrationController);

module.exports = router;
