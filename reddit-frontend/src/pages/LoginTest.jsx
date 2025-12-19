import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/home";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ CHANGE THIS to your real endpoint
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const data = res.data;

      // ✅ save user (same style as your teammate)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      

      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        <button disabled={loading} style={{ padding: 10, cursor: "pointer" }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
      </form>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          type="button"
          style={{ padding: 8 }}
          onClick={() => {
            // quick test
            console.log("localStorage user:", localStorage.getItem("user"));
          }}
        >
          Console: show saved user
        </button>

        <button
          type="button"
          style={{ padding: 8 }}
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            alert("Cleared localStorage");
          }}
        >
          Clear localStorage
        </button>
      </div>
    </div>
  );
}
