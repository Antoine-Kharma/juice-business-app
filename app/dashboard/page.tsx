const stats = [
  { title: "Today Sales", value: "$0" },
  { title: "Cups Sold", value: "0" },
  { title: "Low Stock Items", value: "0" },
  { title: "Best Seller", value: "-" },
];

export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "var(--background)",
        minHeight: "100vh",
      }}
    >
      <section style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>Dashboard</h1>
        <p style={{ marginTop: "10px", color: "var(--secondary-text)" }}>
          Overview of your fresh juice business.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
            }}
          >
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{stat.title}</p>
            <h2 style={{ margin: "10px 0 0 0", fontSize: "28px" }}>{stat.value}</h2>
          </div>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
          <p style={{ color: "#666" }}>No sales recorded yet.</p>
        </div>

        <div
          style={{
            background: "var(--card)",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Quick Notes</h2>
          <ul style={{ lineHeight: "1.8", paddingLeft: "18px" }}>
            <li>Add first sale</li>
            <li>Add inventory items</li>
            <li>Set product prices</li>
          </ul>
        </div>
      </section>
    </main>
  );
}