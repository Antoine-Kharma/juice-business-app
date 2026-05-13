import ProtectedPage from "../components/ProtectedPage";

const stats = [
  { title: "Today Sales", value: "$0" },
  { title: "Cups Sold", value: "0" },
  { title: "Low Stock Items", value: "0" },
  { title: "Best Seller", value: "-" },
];

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <main
        style={{
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(180deg,#b4d94f 0%, #f4ffe0 100%)",
          minHeight: "100vh",
        }}
      >
        {/* HERO SECTION */}

        <section
          style={{
            minHeight: "280px",
            background: "linear-gradient(135deg,#93c81f,#d6ff6b)",
            borderRadius: "38px",
            padding: "50px",
            marginBottom: "34px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(75,100,20,0.25)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "black",
              fontWeight: 900,
              letterSpacing: "2px",
              fontSize: "14px",
            }}
          >
            WELCOME BACK!
          </p>

          <h1
            style={{
              margin: "20px 0 0",
              color: "black",
              fontSize: "64px",
              lineHeight: "0.95",
              fontWeight: 900,
              maxWidth: "650px",
            }}
          >
            Dashboard Overview
          </h1>

          <p
            style={{
              color: "black",
              fontSize: "22px",
              maxWidth: "620px",
              lineHeight: "1.6",
              marginTop: "22px",
              fontWeight: 500,
            }}
          >
            Track your sales, inventory, and business performance in one clean
            place.
          </p>

          <div
            style={{
              position: "absolute",
              right: "60px",
              top: "20px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "110px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
            }}
          >
            🥤
          </div>
        </section>

        {/* STATS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "34px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              style={{
                background: "linear-gradient(135deg,#97cf1d,#8bc814)",
                color: "black",
                padding: "34px",
                borderRadius: "30px",
                boxShadow: "0 18px 40px rgba(75,100,20,0.18)",
                border: "1px solid rgba(255,255,255,0.45)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "black",
                  fontSize: "15px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {stat.title}
              </p>

              <h2
                style={{
                  margin: "18px 0 0",
                  fontSize: "48px",
                  color: "black",
                  fontWeight: 900,
                }}
              >
                {stat.value}
              </h2>
            </div>
          ))}
        </section>

        {/* BOTTOM SECTION */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#b4df38,#dfff8c)",
              color: "black",
              padding: "36px",
              borderRadius: "34px",
              boxShadow: "0 18px 40px rgba(75,100,20,0.18)",
              border: "1px solid rgba(255,255,255,0.45)",
              minHeight: "180px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "black",
                fontSize: "32px",
              }}
            >
              Recent Activity
            </h2>

            <p
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              No sales recorded yet.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg,#486c07,#6d990e)",
              color: "black",
              padding: "36px",
              borderRadius: "34px",
              boxShadow: "0 24px 60px rgba(75,100,20,0.25)",
              minHeight: "180px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "black",
                fontSize: "32px",
              }}
            >
              Quick Notes
            </h2>

            <ul
              style={{
                lineHeight: "2.1",
                paddingLeft: "20px",
                color: "black",
                fontSize: "19px",
              }}
            >
              <li>Add first sale</li>
              <li>Add inventory items</li>
              <li>Set product prices</li>
            </ul>
          </div>
        </section>
      </main>
    </ProtectedPage>
  );
}