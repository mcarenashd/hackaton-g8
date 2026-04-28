const express = require('express');
const { generatePlanController } = require('../controllers/generateController');

const router = express.Router();

router.post('/', generatePlanController);

module.exports = router;
