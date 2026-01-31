import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function App() {
  const [userId] = useState("testuser");
  const [savings, setSavings] = useState(0);
  const [invested, setInvested] = useState(0);
  const [content, setContent] = useState({});
  const [txMessage, setTxMessage] = useState("");

  const login = async () => {
    await axios.post(`${API}/login/${userId}`);
    alert("Wallet created on Stellar Testnet");
  };

  const save = async () => {
    const res = await axios.post(`${API}/save/${userId}?amount=97`);
    setSavings(res.data.total_savings);
  };

  const invest = async () => {
    const res = await axios.post(`${API}/invest/${userId}`);
    setInvested(res.data.invested);
    setSavings(0);
    setTxMessage(`Investment TX: ${res.data.tx_hash}`);
  };

  const earnYield = async () => {
    const res = await axios.post(`${API}/yield/${userId}`);
    setInvested(res.data.new_balance);
  };

  const loadContent = async () => {
    const res = await axios.get(`${API}/content`);
    setContent(res.data);
  };

  const buy = async (id) => {
    const res = await axios.post(`${API}/purchase/${userId}/${id}`);
    setTxMessage(`Purchase TX: ${res.data.tx_hash}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>MicroSave</h1>

      <div style={styles.card}>
        <h2>Dashboard</h2>
        <p>Savings: <b>{savings} XLM</b></p>
        <p>Invested: <b>{invested} XLM</b></p>

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={login}>Create Wallet</button>
          <button style={styles.button} onClick={save}>Save ₹97</button>
          <button style={styles.button} onClick={invest}>Invest</button>
          <button style={styles.button} onClick={earnYield}>Generate Yield</button>
        </div>

        {txMessage && (
          <div style={styles.txBox}>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txMessage.split(" ").pop()}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Stellar Explorer
            </a>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2>Marketplace</h2>
        <button style={styles.button} onClick={loadContent}>
          Load Content
        </button>

        <div style={styles.grid}>
          {Object.keys(content).map((id) => (
            <div key={id} style={styles.contentCard}>
              <h3>{content[id].title}</h3>
              <p>Price: {content[id].price} XLM</p>
              <button style={styles.button} onClick={() => buy(id)}>
                Unlock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: 40,
    backgroundColor: "#f4f6f8",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 30,
    borderRadius: 12,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 15
  },
  button: {
    padding: "10px 15px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer"
  },
  txBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#eef6ff",
    borderRadius: 8,
    fontSize: 12,
    wordBreak: "break-all"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginTop: 20
  },
  contentCard: {
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.05)"
  }
};

export default App;
