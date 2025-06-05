const express = require('express');
const router = express.Router();
const controller = require('../controllers/publicSurveyController');

router.get('/:id/public', controller.getPublicSurvey);
router.post('/:id/responses', controller.submitResponse);

module.exports = router;
