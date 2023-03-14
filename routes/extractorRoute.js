const express = require('express');
const extractorController = require('../controllers/extractorController');

const router = express.Router();

router.post('/extractor-video/', extractorController.getTelemetryByFilter);

module.exports = router;
