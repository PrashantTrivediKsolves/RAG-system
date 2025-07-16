import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    try {
      const res = await axios.post("http://localhost:8000/api/ask", { query });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("Error getting response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h2>📚 RAG Chatbot</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask your question..."
      />
      <br />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>
      <div className="response">
        <strong>Answer:</strong>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default App;