import ProtectedPage from "../components/ProtectedPage";

export default function ReportsPage() {
  return (
      <ProtectedPage>
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Reports</h1>
      <p>This is the reports page.</p>
      <style>
  {`
    @media (max-width: 850px) {
      main {
        padding: 20px !important;
      }

      section {
        padding: 28px !important;
        border-radius: 28px !important;
      }

      h1 {
        font-size: 46px !important;
      }

      h2 {
        font-size: 30px !important;
      }

      p {
        font-size: 17px !important;
      }

      table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }

      input,
      select,
      button {
        width: 100%;
        box-sizing: border-box;
      }
    }

    @media (max-width: 550px) {
      h1 {
        font-size: 38px !important;
      }

      section {
        padding: 22px !important;
      }
    }
  `}
</style>
    </main>
      </ProtectedPage>

  );
}
