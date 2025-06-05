const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/respondentController');

router.use(auth); 
router.get('/', controller.getAllRespondents);
router.get('/:id', controller.getRespondentDetails);

module.exports = router;
