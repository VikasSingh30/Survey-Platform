const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/surveyController');

router.use(auth); 

router.post('/', controller.createSurvey);
router.get('/', controller.getSurveys);
router.get('/:id', controller.getSurveyById);
router.put('/:id', controller.updateSurvey);
router.delete('/:id', controller.deleteSurvey);
router.post('/:id/publish', controller.publishSurvey);

module.exports = router;
