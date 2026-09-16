const { evaluateEssayWithAI } = require('../services/openai.service');

async function evaluateEssay(req, res) {
  try {
    const { topicPrompt, essayText } = req.body;

    if (!topicPrompt || topicPrompt.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Please provide a valid essay topic or prompt.' 
      });
    }

    if (!essayText || essayText.trim().length < 20) {
      return res.status(400).json({ 
        error: 'Essay text must be at least 20 characters long.' 
      });
    }

    const result = await evaluateEssayWithAI(topicPrompt, essayText);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Academic Evaluation Error:', error);
    return res.status(500).json({ 
      error: 'Failed to evaluate essay. Please try again.' 
    });
  }
}

module.exports = { evaluateEssay };