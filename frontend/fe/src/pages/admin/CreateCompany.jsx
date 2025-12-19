import { useState } from "react";
import api from "../../api/axios";

export default function CreateCompany() {
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState("");

  const submit = async () => {
    await api.post("/companies", { name, groupId });
    alert("Company created");
  };

  return (
    <div>
      <h3>Create Company</h3>
      <input placeholder="Company Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Group ID" onChange={e => setGroupId(e.target.value)} />
      <button onClick={submit}>Create</button>
    </div>
  );
}
