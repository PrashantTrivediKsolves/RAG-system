const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/hf_transformers");

const { QdrantClient } = require("@qdrant/js-client-rest");

async function retrieve(query) {
  const embedder = new HuggingFaceTransformersEmbeddings({
    modelName: "Xenova/all-MiniLM-L6-v2",
  });

  const queryVector = await embedder.embedQuery(query);
  const qdrant = new QdrantClient({ url: "http://localhost:6333" });

  const result = await qdrant.search("rag_docs", {
    vector: queryVector,
    top: 3,
  });

  return result.map((r) => r.payload.text);
}

module.exports = retrieve;