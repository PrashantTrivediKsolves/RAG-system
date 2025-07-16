const fs = require("fs");
const path = require("path");
const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/hf_transformers");

const { QdrantClient } = require("@qdrant/js-client-rest");

(async () => {
  const documents = fs.readFileSync(path.join(__dirname, "../docs/rag.txt"), "utf8");

  const embedder = new HuggingFaceTransformersEmbeddings({
    modelName: "Xenova/all-MiniLM-L6-v2",
  });

  const vectors = await embedder.embedDocuments([documents]);

  const qdrant = new QdrantClient({ url: "http://localhost:6333" });

  await qdrant.createCollection("rag_docs", {
    vectors: { size: 384, distance: "Cosine" },
  });

  await qdrant.upsert("rag_docs", {
    points: [
      {
        id: 1,
        vector: vectors[0],
        payload: { text: documents },
      },
    ],
  });

  console.log("✅ Document embedded and stored using HuggingFace model.");
})();