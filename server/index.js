const express = require("express");
const cors = require("cors");
const axios = require("axios");
const retrieve = require("./search");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

app.get("/",(req, res)=>
{
  res.send("Hello");

})

app.post("/api/ask", async (req, res) => {
  const { query } = req.body;
  console.log(query);

  const docs = await retrieve(query);
  const prompt = `Answer this using the context below:\n\nContext:\n${docs.join(
    "\n\n"
  )}\n\nQuestion:\n${query}`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.json({ answer: response.data.choices[0].message.content });
});

app.listen(8000, () => console.log("Server listening on http://localhost:8000"));