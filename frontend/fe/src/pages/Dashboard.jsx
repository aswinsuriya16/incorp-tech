import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import InvoiceCard from "../components/InvoiceCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get("/invoices").then(res => setInvoices(res.data));
  }, []);

  return (
    <div>
      <h2>Dashboard ({user.role})</h2>
      <button onClick={logout}>Logout</button>

      {user.role === "BU" && (
        <a href="/create">Create Invoice</a>
      )}

      <div>
        {invoices.map(inv => (
          <InvoiceCard key={inv.id} invoice={inv} role={user.role} />
        ))}
      </div>
    </div>
  );
}
