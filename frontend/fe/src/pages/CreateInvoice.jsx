import { useState } from "react";
import api from "../api/axios";

export default function CreateInvoice() {
  const [type, setType] = useState("REGULAR");
  const [originalCompanyId, setOriginal] = useState("");
  const [carryCompanyId, setCarry] = useState("");

  const handleCreate = async () => {
    await api.post("/invoices", {
      type,
      originalCompanyId,
      carryCompanyId: type === "CARRY" ? carryCompanyId : null
    });
    alert("Invoice created");
  };

  return (
    <div>
      <h2>Create Invoice</h2>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="REGULAR">Regular</option>
        <option value="CARRY">Carry</option>
      </select>

      <input placeholder="Original Company ID" onChange={e => setOriginal(e.target.value)} />

      {type === "CARRY" && (
        <input placeholder="Carry Company ID" onChange={e => setCarry(e.target.value)} />
      )}

      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
