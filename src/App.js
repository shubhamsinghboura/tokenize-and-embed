import React, { useState } from "react";
import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const enc = new Tiktoken(o200k_base);

function App() {
  const [inputText, setInputText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [decodedText, setDecodedText] = useState("");
  const [embedding, setEmbedding] = useState([]);

  const handleTokenize = () => {
    const tokenized = enc.encode(inputText);
    setTokens(tokenized);
    setDecodedText(enc.decode(tokenized));
  };

  const handleEmbedding = async () => {
    try {
      const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputText,
      });
      setEmbedding(res.data[0].embedding);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🔢 Tokenizer, Decoder & Embedding Tool</h2>

        <textarea
          placeholder="Enter text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.textarea}
          rows={4}
        />

        <div style={styles.buttonRow}>
          <button onClick={handleTokenize} style={styles.button}>
            Tokenize & Decode
          </button>
          <button
            onClick={handleEmbedding}
            style={{ ...styles.button, backgroundColor: "#28a745" }}
          >
            Get Embedding
          </button>
        </div>

        {tokens.length > 0 && (
          <>
            <label style={styles.label}>Tokens:</label>
            <pre style={styles.outputBlock}>{JSON.stringify(tokens)}</pre>

            <label style={styles.label}>Decoded Text:</label>
            <pre style={styles.outputBlock}>{decodedText}</pre>
          </>
        )}

        {embedding.length > 0 && (
          <>
            <label style={styles.label}>
              Embedding Vector ({embedding.length} dimensions):
            </label>
            <pre style={styles.outputBlock}>{JSON.stringify(embedding)}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    maxWidth: "800px",
    margin: "auto",
  },
  heading: {
    fontSize: "1.6rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#333",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
    marginBottom: "15px",
    fontFamily: "inherit",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 18px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontWeight: "500",
    transition: "0.2s",
  },
  outputBlock: {
    backgroundColor: "#f9fafb",
    padding: "10px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    border: "1px solid #ddd",
    maxHeight: "200px",
    overflowY: "auto",
  },
  label: {
    fontWeight: "500",
    marginBottom: "8px",
    display: "block",
    marginTop: "15px",
    color: "#555",
  },
};
