const OpenAI = require('openai');
const { SYSTEM_PROMPT, RESPONSE_SCHEMA } = require('../prompts/essayPrompt');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function evaluateEssayWithAI(topicPrompt, essayText) {
  try {
    const userMessage = `
PROMPT / QUESTION:
"${topicPrompt}"

STUDENT ESSAY SUBMISSION:
"${essayText}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2, // Low temperature for consistent scoring
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'essay_evaluation',
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
    });

    const parsedResult = JSON.parse(response.choices[0].message.content);

    // Calculate raw score out of 5.0
    const rawTotal = 
      parsedResult.rawScores.categoryA.score +
      parsedResult.rawScores.categoryB.score +
      parsedResult.rawScores.categoryC.score +
      parsedResult.rawScores.categoryD.score;

    // Scale to official DİM score out of 16.5
    const finalScore = Number((rawTotal * 3.3).toFixed(1));

    return {
      ...parsedResult,
      rawTotal: Number(rawTotal.toFixed(1)),
      finalScore,
    };
  } catch (error) {
    console.error('Error in evaluateEssay service:', error);
    throw new Error(`Failed to evaluate essay: ${error.message}`);
  }
}

module.exports = { evaluateEssayWithAI };