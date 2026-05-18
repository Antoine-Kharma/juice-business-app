"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

export default function DashboardPage() {
  const [todaySales, setTodaySales] = useState(0);
  const [cupsSold, setCupsSold] = useState(0);
  const [bestSeller, setBestSeller] = useState("-");
  const [recentSales, setRecentSales] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const sales = data || [];

    const totalSales = sales.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    const totalCups = sales.reduce(
      (sum, sale) => sum + Number(sale.quantity || 0),
      0
    );

    const productCounts: Record<string, number> = {};

    sales.forEach((sale) => {
      productCounts[sale.juice_name] =
        (productCounts[sale.juice_name] || 0) + Number(sale.quantity || 0);
    });

    const best =
      Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    setTodaySales(totalSales);
    setCupsSold(totalCups);
    setBestSeller(best);
    setRecentSales(sales.slice(0, 5));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Today Sales", value: `$${todaySales.toFixed(2)}` },
    { title: "Cups Sold", value: cupsSold },
    { title: "Low Stock Items", value: "0" },
    { title: "Best Seller", value: bestSeller },
  ];

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

        <div style={{ position: "relative", zIndex: 2 }}>
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
            <p style={smallTitleStyle}>WELCOME BACK</p>

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

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom: "34px",
            }}
          >
            {stats.map((stat) => (
              <div key={stat.title} style={cardStyle}>
                <p style={smallTitleStyle}>{stat.title}</p>

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

          <section
            className="dashboardBottom"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "24px",
            }}
          >
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Recent Activity</h2>

              <div
                style={{
                  color: "#435848",
                  fontSize: "18px",
                  lineHeight: "1.8",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {recentSales.length === 0 ? (
                  <p>No sales recorded yet.</p>
                ) : (
                  recentSales.map((sale) => (
                    <p key={sale.id}>
                      {sale.quantity}x {sale.juice_name} — $
                      {Number(sale.total_price || 0).toFixed(2)}
                    </p>
                  ))
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Quick Notes</h2>

              <ul
                style={{
                  lineHeight: "2.2",
                  paddingLeft: "20px",
                  color: "#435848",
                  fontSize: "19px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <li>Review daily sales</li>
                <li>Check low stock items</li>
                <li>Update inventory regularly</li>
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

              .dashboardBottom {
                grid-template-columns: 1fr !important;
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

const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(14px)",
  padding: "34px",
  borderRadius: "30px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const smallTitleStyle = {
  margin: 0,
  color: "#7aa85a",
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  fontFamily: "Arial, sans-serif",
};

const sectionTitleStyle = {
  marginTop: 0,
  color: "#2e4732",
  fontSize: "38px",
};