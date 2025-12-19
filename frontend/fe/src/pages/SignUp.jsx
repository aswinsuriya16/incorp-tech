import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "BU",
    companyId: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      companyId: form.role === "COMPANY" ? form.companyId : null
    };

    const res = await api.post("/auth/signup", payload);
    const token = res.data.token;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    login(token, decoded.role);
  };

  return (
    <div>
      <h2>Sign Up</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />

      <select name="role" onChange={handleChange}>
        <option value="BU">BU</option>
        <option value="BU_MANAGER">BU Manager</option>
        <option value="COMPANY">Company</option>
      </select>

      {form.role === "COMPANY" && (
        <input
          name="companyId"
          placeholder="Company ID"
          onChange={handleChange}
        />
      )}

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
