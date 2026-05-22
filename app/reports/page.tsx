"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

export default function ReportsPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [bestSeller, setBestSeller] = useState("-");
  const [outOfStock, setOutOfStock] = useState(0);
  const [weeklySales, setWeeklySales] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [topProducts, setTopProducts] = useState<
    { name: string; quantity: number }[]
  >([]);

  const fetchReportsData = async () => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthStartISO = monthStart.toISOString();
    const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("*")
    .gte("created_at", monthStartISO)
    .order("created_at", { ascending: false });

    if (salesError) {
      alert(salesError.message);
      return;
    }

    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select("*");

    if (expensesError) {
      alert(expensesError.message);
      return;
    }

    const { data: inventoryData, error: inventoryError } = await supabase
      .from("inventory")
      .select("*");

    if (inventoryError) {
      alert(inventoryError.message);
      return;
    }

    const sales = salesData || [];
    const expenses = expensesData || [];
    const inventory = inventoryData || [];

    const revenue = sales.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    const expensesTotal = expenses.reduce(
      (sum, expense) => sum + Number(expense.paid_amount || 0),
      0
    );

    const productCounts: Record<string, number> = {};

    sales.forEach((sale) => {
      productCounts[sale.juice_name] =
        (productCounts[sale.juice_name] || 0) + Number(sale.quantity || 0);
    });

    const sortedProducts = Object.entries(productCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    const salesByDay = [0, 0, 0, 0, 0, 0, 0];

    sales.forEach((sale) => {
      const day = new Date(sale.created_at).getDay();
      salesByDay[day] += Number(sale.total_price || 0);
    });

    setTotalRevenue(revenue);
    setTotalExpenses(expensesTotal);
    setNetProfit(revenue - expensesTotal);
    setTotalOrders(sales.length);
    setBestSeller(sortedProducts[0]?.name || "-");
    setOutOfStock(
      inventory.filter((item) => Number(item.quantity || 0) <= 0).length
    );
    setWeeklySales(salesByDay);
    setTopProducts(sortedProducts.slice(0, 5));
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const stats = [
    { title: "Monthly Revenue", value: `$${totalRevenue.toFixed(2)}` },
    { title: "Monthly Expenses", value: `$${totalExpenses.toFixed(2)}` },
    { title: "Monthly Net Profit", value: `$${netProfit.toFixed(2)}` },
    { title: "Monthly Orders", value: totalOrders },
    { title: "Monthly Best Seller", value: bestSeller },
    { title: "Out of Stock", value: outOfStock },
  ];

  return (
    <ProtectedPage>
      <main style={mainStyle}>
        <div style={backgroundCircleStyle} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <section style={heroStyle}>
            <p style={smallTitleStyle}>REPORTS & ANALYTICS</p>

            <h1 style={heroTitleStyle}>
              Business
              <br />
              Insights
            </h1>

            <p style={heroTextStyle}>
              Review revenue, expenses, profit, best sellers and weekly
              performance from one professional reports center.
            </p>
          </section>

          <section style={statsGridStyle}>
            {stats.map((stat) => (
              <div key={stat.title} style={cardStyle}>
                <p style={smallTitleStyle}>{stat.title}</p>

                <h2
                  style={{
                    margin: "18px 0 0",
                    fontSize: stat.title === "Best Seller" ? "34px" : "50px",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    lineHeight: "1.2",
                    color: "#2e4732",
                    fontWeight: "bold",
                  }}
                >
                  {stat.value}
                </h2>
              </div>
            ))}
          </section>

          <section className="reportsGrid" style={reportsGridStyle}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Weekly Sales Chart</h2>

              <div style={chartWrapperStyle}>
                {weeklySales.map((value, index) => {
                  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  const maxValue = Math.max(...weeklySales, 1);
                  const height = Math.max((value / maxValue) * 180, 20);

                  return (
                    <div key={index} style={{ flex: 1, textAlign: "center" }}>
                      <div
                        style={{
                          background: "#7aa85a",
                          borderRadius: "14px 14px 0 0",
                          height: `${height}px`,
                          transition: "0.3s",
                        }}
                      />

                      <p style={chartLabelStyle}>{days[index]}</p>
                      <p style={chartValueStyle}>${value.toFixed(0)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Top Selling Juices</h2>

              <div style={{ display: "grid", gap: "16px" }}>
                {topProducts.length === 0 ? (
                  <p style={listTextStyle}>No sales yet.</p>
                ) : (
                  topProducts.map((product, index) => (
                    <div key={product.name}>
                      <p style={listTextStyle}>
                        #{index + 1} {product.name} — {product.quantity} sold
                      </p>

                      <div
                        style={{
                          height: "12px",
                          background: "#eef0df",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${
                              (product.quantity / topProducts[0].quantity) * 100
                            }%`,
                            background: "#7aa85a",
                            borderRadius: "999px",
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        <style>
          {`
            @media (max-width: 1100px) {
              .reportsGrid {
                grid-template-columns: 1fr !important;
              }
            }

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

const mainStyle = {
  minHeight: "100vh",
  background: "#f6f3e8",
  padding: "30px",
  fontFamily: "'Georgia', serif",
  position: "relative" as const,
  overflow: "hidden",
};

const backgroundCircleStyle = {
  position: "absolute" as const,
  right: "-180px",
  top: "-100px",
  width: "700px",
  height: "700px",
  background: "#a8d57a",
  borderRadius: "50%",
  zIndex: 0,
};

const heroStyle = {
  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(14px)",
  borderRadius: "40px",
  padding: "60px",
  marginBottom: "34px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const heroTitleStyle = {
  margin: "20px 0 0",
  color: "#2e4732",
  fontSize: "74px",
  lineHeight: "1",
  fontWeight: "bold",
};

const heroTextStyle = {
  marginTop: "25px",
  fontSize: "22px",
  color: "#435848",
  lineHeight: "1.8",
  maxWidth: "680px",
  fontFamily: "Arial, sans-serif",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "24px",
  marginBottom: "34px",
};

const reportsGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: "24px",
};

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

const chartWrapperStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: "14px",
  height: "240px",
  marginTop: "30px",
};

const chartLabelStyle = {
  marginTop: "10px",
  marginBottom: 0,
  fontFamily: "Arial, sans-serif",
  color: "#435848",
  fontWeight: "bold",
};

const chartValueStyle = {
  marginTop: "4px",
  fontFamily: "Arial, sans-serif",
  color: "#7aa85a",
  fontSize: "14px",
};

const listTextStyle = {
  color: "#435848",
  fontSize: "18px",
  lineHeight: "1.8",
  fontFamily: "Arial, sans-serif",
};