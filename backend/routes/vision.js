const express = require('express');
const { visionController } = require('../controllers/visionController');

const router = express.Router();
router.post('/', visionController);

module.exports = router;
