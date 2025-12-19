import { useState } from "react";
import api from "../../api/axios";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");

  const submit = async () => {
    await api.post("/groups", { name, managerId });
    alert("Group created");
  };

  return (
    <div>
      <h3>Create Group</h3>
      <input placeholder="Group Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Manager User ID" onChange={e => setManagerId(e.target.value)} />
      <button onClick={submit}>Create</button>
    </div>
  );
}
