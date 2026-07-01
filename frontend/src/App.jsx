// import { useEffect, useState } from "react";
// import axios from "axios";

// function App() {

//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/message")
//       .then((response) => {
//         setMessage(response.data.message);
//       });
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>React Frontend</h1>
//       <h2>{message}</h2>
//     </div>
//   );
// }

// export default App;
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/message")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setMessage("Unable to connect to server.");
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.status}>
          <span style={styles.dot}></span>
          Backend Connected
        </div>

        <h1 style={styles.title}>React × Express</h1>

        <p style={styles.subtitle}>
          A simple frontend communicating with your backend API.
        </p>

        <div style={styles.responseCard}>
          <p style={styles.label}>SERVER RESPONSE</p>
          <h2 style={styles.message}>{message}</h2>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    fontFamily: "'Inter', sans-serif",
    padding: "24px",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#16281f",
    color: "#4ade80",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "28px",
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 10px #22c55e",
  },

  title: {
    color: "#f8fafc",
    fontSize: "40px",
    margin: 0,
    fontWeight: "700",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "14px",
    lineHeight: 1.7,
    fontSize: "16px",
  },

  responseCard: {
    marginTop: "32px",
    padding: "24px",
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "18px",
  },

  label: {
    color: "#64748b",
    fontSize: "12px",
    letterSpacing: "2px",
    marginBottom: "12px",
  },

  message: {
    color: "#ffffff",
    margin: 0,
    fontSize: "28px",
    fontWeight: 600,
  },
};

export default App;