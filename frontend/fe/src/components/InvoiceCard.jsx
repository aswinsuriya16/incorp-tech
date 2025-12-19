import api from "../api/axios";

export default function InvoiceCard({ invoice, role }) {
  const canApprove =
    (role === "BU_MANAGER" && invoice.status === "PENDING_BU_MANAGER_APPROVAL") ||
    (role === "COMPANY" && invoice.status === "PENDING_CARRY_COMPANY_APPROVAL");

  const handleApprove = async () => {
    await api.post(`/invoices/${invoice.id}/approve`, {
      remarks: "Approved"
    });
    window.location.reload();
  };

  const handleReject = async () => {
    await api.post(`/invoices/${invoice.id}/reject`, {
      remarks: "Rejected"
    });
    window.location.reload();
  };

  return (
    <div style={{ border: "1px solid black", margin: 8, padding: 8 }}>
      <p>ID: {invoice.id}</p>
      <p>Type: {invoice.type}</p>
      <p>Status: {invoice.status}</p>

      {canApprove && (
        <>
          <button onClick={handleApprove}>Approve</button>
          <button onClick={handleReject}>Reject</button>
        </>
      )}
    </div>
  );
}
