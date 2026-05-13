import Link from "next/link";

const pages = [
  { name: "Dashboard", href: "/dashboard", description: "View business overview and statistics" },
  { name: "Sales", href: "/sales", description: "Record sold juices and quantities" },
  { name: "Inventory", href: "/inventory", description: "Track fruits, bottles, cups, and stock" },
  { name: "Expenses", href: "/expenses", description: "Track purchases and business costs" },
  { name: "Reports", href: "/reports", description: "See sales and stock reports" },
];

const juices = [
  "Orange",
  "Strawberry Banana",
  "Strawberry Lemonade",
  "Lemonade",
];

export default function Home() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "var(--background)",
        minHeight: "100vh",
      }}
    >
      <section
        style={{
          background: "var(--card)",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "32px" }}>Fresh Juice Business System</h1>
        <p style={{ marginTop: "12px", color: "#555" }}>
          Manage your juice sales, stock, expenses, and reports in one place.
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
        {pages.map((page) => (
          <Link
            key={page.name}
            href={page.href}
            style={{
              display: "block",
              textDecoration: "none",
              color: "black",
              background: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{page.name}</h3>
            <p style={{ marginBottom: 0, color: "var(--secondary-text)" }}>{page.description}</p>
          </Link>
        ))}
      </section>

      <section
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Available juices</h2>
        <ul style={{ lineHeight: "1.9" }}>
          {juices.map((juice) => (
            <li key={juice}>{juice}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}