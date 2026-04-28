const express = require('express');
const { generatePlanController } = require('../controllers/planController');

const router = express.Router();

router.post('/', generatePlanController);

module.exports = router;
