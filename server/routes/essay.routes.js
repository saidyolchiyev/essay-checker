const { Router } = require('express');
const { evaluateEssay } = require('../controllers/essay.controller');

const router = Router();

// POST /api/essay/evaluate
router.post('/evaluate', evaluateEssay);

module.exports = router;