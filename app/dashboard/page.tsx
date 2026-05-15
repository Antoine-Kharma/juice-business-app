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
          minHeight: "100vh",
          background: "#f6f3e8",
          padding: "30px",
          fontFamily: "'Georgia', serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Shape */}
        <div
          style={{
            position: "absolute",
            right: "-180px",
            top: "-100px",
            width: "700px",
            height: "700px",
            background: "#a8d57a",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* HERO */}
          <section
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(14px)",
              borderRadius: "40px",
              padding: "60px",
              marginBottom: "34px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.7)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "-60px",
                top: "-60px",
                width: "280px",
                height: "280px",
                background: "rgba(168,213,122,0.35)",
                borderRadius: "50%",
              }}
            />

            <p
              style={{
                margin: 0,
                color: "#7aa85a",
                fontWeight: "bold",
                letterSpacing: "2px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              WELCOME BACK
            </p>

            <h1
              style={{
                margin: "20px 0 0",
                color: "#2e4732",
                fontSize: "74px",
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              Dashboard
              <br />
              Overview
            </h1>

            <p
              style={{
                marginTop: "25px",
                fontSize: "22px",
                color: "#435848",
                lineHeight: "1.8",
                maxWidth: "620px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Track your sales, inventory, expenses and business performance in
              one elegant place.
            </p>
          </section>

          {/* STATS */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom: "34px",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.title}
                style={{
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(14px)",
                  padding: "34px",
                  borderRadius: "30px",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.7)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#7aa85a",
                    fontSize: "14px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {stat.title}
                </p>

                <h2
                  style={{
                    margin: "18px 0 0",
                    fontSize: "54px",
                    color: "#2e4732",
                    fontWeight: "bold",
                  }}
                >
                  {stat.value}
                </h2>
              </div>
            ))}
          </section>

          {/* BOTTOM */}
          <section
          className="dashboardBottom"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
          }}
          >
            {/* Activity */}
            <div
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(14px)",
                padding: "38px",
                borderRadius: "34px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.7)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#2e4732",
                  fontSize: "38px",
                }}
              >
                Recent Activity
              </h2>

              <p
                style={{
                  color: "#435848",
                  fontSize: "20px",
                  lineHeight: "1.8",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                No sales recorded yet.
              </p>
            </div>

            {/* Notes */}
            <div
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(14px)",
                padding: "38px",
                borderRadius: "34px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.7)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#2e4732",
                  fontSize: "38px",
                }}
              >
                Quick Notes
              </h2>

              <ul
                style={{
                  lineHeight: "2.2",
                  paddingLeft: "20px",
                  color: "#435848",
                  fontSize: "19px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <li>Add first sale</li>
                <li>Add inventory items</li>
                <li>Set product prices</li>
              </ul>
            </div>
          </section>
        </div>
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
      <style>
        {`
          @media (max-width: 850px) {
            .dashboardBottom {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      </main>
    </ProtectedPage>
  );
}