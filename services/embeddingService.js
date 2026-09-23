/**
 * embeddingService.js
 * ------------------------------------------------------------------
 * Reusable embedding generation using a Gemini-supported EMBEDDING model
 * (NOT the text-generation model). The same function is used for both
 * property documents and user search queries so vectors are always comparable.
 */
const { getClient } = require("./geminiService");

// Dedicated Gemini embedding model. gemini-embedding-001 supports a configurable
// output dimensionality; we pin it so property docs and queries always match.
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

// Vector size stored in Qdrant. Must stay identical for indexing and querying.
const EMBEDDING_DIMENSION = Number(process.env.EMBEDDING_DIMENSION || 768);

/**
 * Generate an embedding vector for a single piece of text.
 *
 * @param {string} text
 * @returns {Promise<number[]>} A numeric embedding vector of EMBEDDING_DIMENSION.
 */
async function generateEmbedding(text) {
    if (!text || typeof text !== "string" || !text.trim()) {
        throw new Error("Cannot generate an embedding for empty text");
    }

    const ai = getClient();
    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: {
            outputDimensionality: EMBEDDING_DIMENSION,
        },
    });

    const values = response?.embeddings?.[0]?.values;
    if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Embedding model returned an empty vector");
    }
    return values;
}

module.exports = {
    generateEmbedding,
    EMBEDDING_MODEL,
    EMBEDDING_DIMENSION,
};
