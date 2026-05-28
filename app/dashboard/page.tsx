"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

export default function DashboardPage() {
  const [todaySales, setTodaySales] = useState(0);
  const [cupsSold, setCupsSold] = useState(0);
  const [bestSeller, setBestSeller] = useState("-");
  const [lowStockItems, setLowStockItems] = useState(0);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [weeklySales, setWeeklySales] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const fetchDashboardData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { data: salesData, error: salesError } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (salesError) {
      alert(salesError.message);
      return;
    }

    const { data: inventoryData, error: inventoryError } = await supabase
      .from("inventory")
      .select("*");

    if (inventoryError) {
      alert(inventoryError.message);
      return;
    }

    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (expensesError) {
      alert(expensesError.message);
      return;
    }

    const sales = salesData || [];
    const inventory = inventoryData || [];
    const expenses = expensesData || [];

    const todaySalesList = sales.filter(
      (sale) => new Date(sale.created_at) >= today
    );

    const todayExpensesList = expenses.filter(
      (expense) => new Date(expense.created_at) >= today
    );

    const monthlySalesList = sales.filter(
      (sale) => new Date(sale.created_at) >= monthStart
    );

    const totalSales = todaySalesList.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    const totalCups = todaySalesList.reduce(
      (sum, sale) => sum + Number(sale.quantity || 0),
      0
    );

    const totalExpenses = todayExpensesList.reduce(
      (sum, expense) => sum + Number(expense.paid_amount || 0),
      0
    );

    const monthlyRevenueTotal = monthlySalesList.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    const inventoryTotalValue = inventory.reduce((sum, item) => {
      const estimatedPricePerUnit = 1;
      return sum + Number(item.quantity || 0) * estimatedPricePerUnit;
    }, 0);

    const productCounts: Record<string, number> = {};

    todaySalesList.forEach((sale) => {
      productCounts[sale.juice_name] =
        (productCounts[sale.juice_name] || 0) + Number(sale.quantity || 0);
    });

    const best =
      Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const lowStock = inventory.filter(
      (item) => Number(item.quantity || 0) <= 5
    ).length;

    const salesByDay = [0, 0, 0, 0, 0, 0, 0];

    monthlySalesList.forEach((sale) => {
      const day = new Date(sale.created_at).getDay();
      salesByDay[day] += Number(sale.total_price || 0);
    });

    setTodaySales(totalSales);
    setCupsSold(totalCups);
    setTodayExpenses(totalExpenses);
    setNetProfit(totalSales - totalExpenses);
    setBestSeller(best);
    setLowStockItems(lowStock);
    setRecentSales(sales.slice(0, 5));
    setRecentExpenses(expenses.slice(0, 5));
    setMonthlyRevenue(monthlyRevenueTotal);
    setInventoryValue(inventoryTotalValue);
    setWeeklySales(salesByDay);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Today Sales", value: `$${todaySales.toFixed(2)}` },
    { title: "Monthly Revenue", value: `$${monthlyRevenue.toFixed(2)}` },
    { title: "Today Cups Sold", value: cupsSold },
    { title: "Low Stock Items", value: lowStockItems },
    { title: "Inventory Value", value: `$${inventoryValue.toFixed(2)}` },
    { title: "Best Seller", value: bestSeller },
    { title: "Today Expenses", value: `$${todayExpenses.toFixed(2)}` },
    { title: "Net Profit", value: `$${netProfit.toFixed(2)}` },
  ];

  return (
    <ProtectedPage>
      <main style={mainStyle}>
        <div style={backgroundCircleStyle} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <section style={heroStyle}>
            <p style={smallTitleStyle}>WELCOME BACK</p>

            <h1 style={heroTitleStyle}>
              Dashboard
              <br />
              Overview
            </h1>

            <p style={heroTextStyle}>
              Track your sales, inventory, expenses and business performance in
              one elegant place.
            </p>
          </section>

          <section style={statsGridStyle}>
            {stats.map((stat) => (
              <div key={stat.title} style={cardStyle}>
                <p style={smallTitleStyle}>{stat.title}</p>

                <h2
                  style={{
                    margin: "18px 0 0",
                    fontSize: stat.title === "Best Seller" ? "34px" : "54px",
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

          <section style={{ ...cardStyle, marginBottom: "34px" }}>
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
          </section>

          <section className="dashboardBottom" style={bottomGridStyle}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Recent Sales</h2>

              <div style={listTextStyle}>
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
              <h2 style={sectionTitleStyle}>Recent Expenses</h2>

              <div style={listTextStyle}>
                {recentExpenses.length === 0 ? (
                  <p>No expenses recorded yet.</p>
                ) : (
                  recentExpenses.map((expense) => (
                    <p key={expense.id}>
                      {expense.item_name} — $
                      {Number(expense.paid_amount || 0).toFixed(2)}
                    </p>
                  ))
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Quick Notes</h2>

              <ul style={notesStyle}>
                <li>Review daily sales</li>
                <li>Check low stock items</li>
                <li>Update inventory regularly</li>
                <li>Monitor daily profit</li>
              </ul>
            </div>
              
          </section>
        </div>

        <style>
          {`
            @media (max-width: 1200px) {
              .dashboardBottom {
                grid-template-columns: 1fr 1fr !important;
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

            .dashboardBottom {
              grid-template-columns: 1fr 1fr !important;
            }

            .quickNotesMobileFull {
              grid-column: 1 / -1 !important;
              width: 100% !important;
            }
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
  position: "relative" as const,
  overflow: "hidden",
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
  maxWidth: "620px",
  fontFamily: "Arial, sans-serif",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "24px",
  marginBottom: "34px",
};

const bottomGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
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

const listTextStyle = {
  color: "#435848",
  fontSize: "18px",
  lineHeight: "1.8",
  fontFamily: "Arial, sans-serif",
};

const notesStyle = {
  lineHeight: "2.2",
  paddingLeft: "20px",
  color: "#435848",
  fontSize: "19px",
  fontFamily: "Arial, sans-serif",
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