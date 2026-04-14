const express = require('express');
const router = express.Router();
const { listExperiences, getExperience, createExperience, voteExperience } = require('../controllers/experienceController');

router.get('/', listExperiences);
router.get('/:id', getExperience);
router.post('/', createExperience);
router.post('/:id/vote', voteExperience);

module.exports = router;
