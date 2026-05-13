import ProtectedPage from "../components/ProtectedPage";

export default function ReportsPage() {
  return (
      <ProtectedPage>
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Reports</h1>
      <p>This is the reports page.</p>
    </main>
      </ProtectedPage>

  );
}
