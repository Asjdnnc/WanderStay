/**
 * geminiService.js
 * ------------------------------------------------------------------
 * Thin wrapper around the official Google Gen AI Node SDK (@google/genai).
 * Centralises client creation and structured JSON generation so the rest of
 * the AI layer never talks to the SDK directly. The Gemini API key lives only
 * in backend env vars and is never sent to the frontend.
 */
const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Text-generation model used for review summaries and RAG answers.
const GENERATION_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client = null;

/**
 * Lazily create (and cache) the GoogleGenAI client. Throws a clear error if the
 * API key is missing so callers can surface a safe message to the user.
 */
function getClient() {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured on the server");
    }
    if (!client) {
        client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }
    return client;
}

/**
 * Generate a response from Gemini and force structured JSON output using the
 * SDK's responseSchema mechanism (rather than parsing free-form text).
 *
 * @param {Object} params
 * @param {string} params.systemInstruction - System prompt / grounding rules.
 * @param {string} params.prompt            - The user/content prompt.
 * @param {Object} params.responseSchema    - Gemini responseSchema object.
 * @returns {Promise<Object>} Parsed JSON object matching the schema.
 */
async function generateStructured({ systemInstruction, prompt, responseSchema }) {
    const ai = getClient();
    
    console.log(`[Gemini API] Calling generateContent with model: ${GENERATION_MODEL}`);

    const response = await ai.models.generateContent({
        model: GENERATION_MODEL,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.2,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        // Defensive: even with responseSchema, guard against malformed JSON.
        throw new Error("Failed to parse structured JSON from Gemini");
    }
}

module.exports = {
    getClient,
    generateStructured,
    GENERATION_MODEL,
    isConfigured: () => Boolean(GEMINI_API_KEY),
};
