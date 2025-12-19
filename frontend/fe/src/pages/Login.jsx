import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email });
    const token = res.data.token;

    const payload = JSON.parse(atob(token.split(".")[1]));
    login(token, payload.role);
  };

  return (
    <div>
      <h2>Login</h2>
      <a href="/signup">Create account</a>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
