"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";
import * as XLSX from "xlsx";

type SaleRow = {
  id?: number;
  juice_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
};

type ExpenseRow = {
  id?: number;
  item_name: string;
  category?: string;
  paid_amount: number;
  created_at?: string;
};

type ReturnRow = {
  id?: number;
  store_name: string;
  juice_name: string;
  quantity_returned: number;
  reason?: string;
  note?: string;
  created_at?: string;
};

type ProductBreakdown = {
  name: string;
  quantity: number;
  revenue: number;
};

type SortOption =
  | "newest"
  | "oldest"
  | "highestQuantity"
  | "highestTotal"
  | "productAZ";

type ChartMode = "weekly" | "weeks" | "monthly";

const juiceOptions = [
  "Orange - 250 ml",
  "Orange - 1 Liter",
  "Carrot - 250 ml",
  "Carrot - 1 Liter",
  "Pomegranate - 250 ml",
  "Pomegranate - 1 Liter",
  "Strawberry Banana - 250 ml",
  "Strawberry Banana - 1 Liter",
  "Strawberry Lemonade - 250 ml",
  "Strawberry Lemonade - 1 Liter",
  "Lemonade - 250 ml",
  "Lemonade - 1 Liter",
  "Minted Lemonade - 250 ml",
  "Minted Lemonade - 1 Liter",
  "Mango - 250 ml",
  "Mango - 1 Liter",
  "Straw Mango - 250 ml",
  "Straw Mango - 1 Liter",
];

export default function ReportsPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [bestSeller, setBestSeller] = useState("-");
  const [outOfStock, setOutOfStock] = useState(0);

  const [returns, setReturns] = useState<ReturnRow[]>([]);

  const [returnStoreName, setReturnStoreName] = useState("");
  const [returnJuiceName, setReturnJuiceName] = useState("");
  const [returnQuantity, setReturnQuantity] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");

  const [chartMode, setChartMode] = useState<ChartMode>("weekly");
  const [weeklySales, setWeeklySales] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [fourWeekSales, setFourWeekSales] = useState<number[]>([0, 0, 0, 0]);
  const [monthlySales, setMonthlySales] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  const [topProducts, setTopProducts] = useState<ProductBreakdown[]>([]);
  const [productBreakdown, setProductBreakdown] = useState<ProductBreakdown[]>(
    []
  );

  const [salesReport, setSalesReport] = useState<SaleRow[]>([]);
  const [expensesReport, setExpensesReport] = useState<ExpenseRow[]>([]);

  const [productFilter, setProductFilter] = useState("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const fetchReportsData = async (
    selectedStartDate = startDate,
    selectedEndDate = endDate
  ) => {
    const start = new Date(selectedStartDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedEndDate);
    end.setHours(23, 59, 59, 999);

    const { data: salesData, error: salesError } = await supabase
      .from("sales")
      .select("*")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    if (salesError) {
      alert(salesError.message);
      return;
    }

    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    if (expensesError) {
      alert(expensesError.message);
      return;
    }

    const { data: returnsData, error: returnsError } = await supabase
      .from("returns")
      .select("*")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    if (returnsError) {
      alert(returnsError.message);
      return;
    }

    const { data: inventoryData, error: inventoryError } = await supabase
      .from("inventory")
      .select("*");

    if (inventoryError) {
      alert(inventoryError.message);
      return;
    }

    const sales = (salesData || []) as SaleRow[];
    const expenses = (expensesData || []) as ExpenseRow[];
    const returnsDataRows = (returnsData || []) as ReturnRow[];
    const inventory = inventoryData || [];

    setSalesReport(sales);
    setExpensesReport(expenses);
    setReturns(returnsDataRows);

    const revenue = sales.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    const expensesTotal = expenses.reduce(
      (sum, expense) => sum + Number(expense.paid_amount || 0),
      0
    );

    const productMap: Record<string, { quantity: number; revenue: number }> = {};

    sales.forEach((sale) => {
      if (!productMap[sale.juice_name]) {
        productMap[sale.juice_name] = {
          quantity: 0,
          revenue: 0,
        };
      }

      productMap[sale.juice_name].quantity += Number(sale.quantity || 0);
      productMap[sale.juice_name].revenue += Number(sale.total_price || 0);
    });

    const breakdown = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity);

    const weekly = [0, 0, 0, 0, 0, 0, 0];
    const fourWeeks = [0, 0, 0, 0];
    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    sales.forEach((sale) => {
      const saleDate = new Date(sale.created_at || "");

      const day = saleDate.getDay();
      weekly[day] += Number(sale.total_price || 0);

      const dateOfMonth = saleDate.getDate();
      const weekIndex = Math.min(Math.floor((dateOfMonth - 1) / 7), 3);
      fourWeeks[weekIndex] += Number(sale.total_price || 0);

      const monthIndex = saleDate.getMonth();
      monthly[monthIndex] += Number(sale.total_price || 0);
    });

    setTotalRevenue(revenue);
    setTotalExpenses(expensesTotal);
    setNetProfit(revenue - expensesTotal);
    setTotalOrders(sales.length);
    setBestSeller(breakdown[0]?.name || "-");
    setOutOfStock(
      inventory.filter((item) => Number(item.quantity || 0) <= 0).length
    );
    setWeeklySales(weekly);
    setFourWeekSales(fourWeeks);
    setMonthlySales(monthly);
    setTopProducts(breakdown.slice(0, 5));
    setProductBreakdown(breakdown);
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleAddReturn = async (e: FormEvent) => {
    e.preventDefault();

    if (!returnStoreName || !returnJuiceName || !returnQuantity) {
      alert("Please fill store name, juice name, and returned quantity.");
      return;
    }

    const quantityNumber = Number(returnQuantity);

    if (quantityNumber <= 0) {
      alert("Returned quantity must be greater than 0.");
      return;
    }

    const { error } = await supabase.from("returns").insert([
      {
        store_name: returnStoreName,
        juice_name: returnJuiceName,
        quantity_returned: quantityNumber,
        reason: returnReason,
        note: returnNote,
      },
    ]);

    if (error) {
      console.error("Error adding return:", error);
      alert(error.message);
      return;
    }

    setReturnStoreName("");
    setReturnJuiceName("");
    setReturnQuantity("");
    setReturnReason("");
    setReturnNote("");

    fetchReportsData(startDate, endDate);
  };

  const applyQuickFilter = (type: "today" | "month" | "year") => {
    const today = new Date();
    let start = new Date();

    if (type === "today") {
      start = today;
    }

    if (type === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    if (type === "year") {
      start = new Date(today.getFullYear(), 0, 1);
    }

    const startValue = start.toISOString().split("T")[0];
    const endValue = today.toISOString().split("T")[0];

    setStartDate(startValue);
    setEndDate(endValue);
    fetchReportsData(startValue, endValue);
  };

  const filteredSalesReport = salesReport
    .filter((sale) => {
      if (productFilter === "All") return true;
      return sale.juice_name === productFilter;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
        );
      }

      if (sortOption === "oldest") {
        return (
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
        );
      }

      if (sortOption === "highestQuantity") {
        return Number(b.quantity || 0) - Number(a.quantity || 0);
      }

      if (sortOption === "highestTotal") {
        return Number(b.total_price || 0) - Number(a.total_price || 0);
      }

      if (sortOption === "productAZ") {
        return a.juice_name.localeCompare(b.juice_name);
      }

      return 0;
    });

  const productFilterOptions = [
    "All",
    ...Array.from(new Set(salesReport.map((sale) => sale.juice_name))),
  ];

  const chartValues =
    chartMode === "weekly"
      ? weeklySales
      : chartMode === "weeks"
      ? fourWeekSales
      : monthlySales;

  const chartLabels =
    chartMode === "weekly"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : chartMode === "weeks"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const totalReturnedBottles = returns.reduce(
    (sum, item) => sum + Number(item.quantity_returned || 0),
    0
  );

  const returnedByProduct: Record<string, number> = {};

  returns.forEach((item) => {
    returnedByProduct[item.juice_name] =
      (returnedByProduct[item.juice_name] || 0) +
      Number(item.quantity_returned || 0);
  });

  const mostReturnedProduct =
    Object.entries(returnedByProduct).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No returns";

  const returnedByStore: Record<string, number> = {};

  returns.forEach((item) => {
    returnedByStore[item.store_name] =
      (returnedByStore[item.store_name] || 0) +
      Number(item.quantity_returned || 0);
  });

  const storeWithMostReturns =
    Object.entries(returnedByStore).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No returns";

  const stats = [
    { title: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
    { title: "Expenses", value: `$${totalExpenses.toFixed(2)}` },
    { title: "Net Profit", value: `$${netProfit.toFixed(2)}` },
    { title: "Orders", value: totalOrders },
    { title: "Best Seller", value: bestSeller },
    { title: "Out of Stock", value: outOfStock },
    { title: "Returned Bottles", value: totalReturnedBottles },
    { title: "Most Returned", value: mostReturnedProduct },
    { title: "Top Return Store", value: storeWithMostReturns },
  ];

  const exportPDF = () => {
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      alert("Popup blocked. Please allow popups to export PDF.");
      return;
    }

    const salesRows = filteredSalesReport
      .map(
        (sale) => `
          <tr>
            <td>${sale.juice_name}</td>
            <td>${sale.quantity}</td>
            <td>$${Number(sale.unit_price || 0).toFixed(2)}</td>
            <td>$${Number(sale.total_price || 0).toFixed(2)}</td>
            <td>${
              sale.created_at
                ? new Date(sale.created_at).toLocaleString()
                : ""
            }</td>
          </tr>
        `
      )
      .join("");

    const productRows = productBreakdown
      .map(
        (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>$${product.revenue.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const expenseRows = expensesReport
      .map(
        (expense) => `
          <tr>
            <td>${expense.item_name}</td>
            <td>${expense.category || ""}</td>
            <td>$${Number(expense.paid_amount || 0).toFixed(2)}</td>
            <td>${
              expense.created_at
                ? new Date(expense.created_at).toLocaleString()
                : ""
            }</td>
          </tr>
        `
      )
      .join("");

    const returnRows = returns
      .map(
        (item) => `
          <tr>
            <td>${item.store_name}</td>
            <td>${item.juice_name}</td>
            <td>${item.quantity_returned}</td>
            <td>${item.reason || ""}</td>
            <td>${item.note || ""}</td>
            <td>${
              item.created_at ? new Date(item.created_at).toLocaleString() : ""
            }</td>
          </tr>
        `
      )
      .join("");

    reportWindow.document.write(`
      <html>
        <head>
          <title>SPLASH Juice Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 32px;
              color: #2e4732;
            }

            h1, h2 {
              color: #2e4732;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin-bottom: 30px;
            }

            .box {
              border: 1px solid #ddd;
              padding: 14px;
              border-radius: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 32px;
            }

            th, td {
              border-bottom: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }

            th {
              background: #eef0df;
            }

            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>

        <body>
          <h1>SPLASH Juice Report</h1>
          <p>From ${startDate} to ${endDate}</p>

          <div class="summary">
            <div class="box"><strong>Revenue:</strong><br/>$${totalRevenue.toFixed(
              2
            )}</div>
            <div class="box"><strong>Expenses:</strong><br/>$${totalExpenses.toFixed(
              2
            )}</div>
            <div class="box"><strong>Net Profit:</strong><br/>$${netProfit.toFixed(
              2
            )}</div>
            <div class="box"><strong>Orders:</strong><br/>${totalOrders}</div>
            <div class="box"><strong>Best Seller:</strong><br/>${bestSeller}</div>
            <div class="box"><strong>Out of Stock:</strong><br/>${outOfStock}</div>
            <div class="box"><strong>Returned Bottles:</strong><br/>${totalReturnedBottles}</div>
            <div class="box"><strong>Most Returned:</strong><br/>${mostReturnedProduct}</div>
            <div class="box"><strong>Top Return Store:</strong><br/>${storeWithMostReturns}</div>
          </div>

          <h2>Product Sales Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>${productRows}</tbody>
          </table>

          <h2>Sales Report</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${salesRows}</tbody>
          </table>

          <h2>Returns Report</h2>
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Product</th>
                <th>Returned Qty</th>
                <th>Reason</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${returnRows}</tbody>
          </table>

          <h2>Expenses Report</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${expenseRows}</tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);

    reportWindow.document.close();
  };

  const exportExcel = () => {
  const workbook = XLSX.utils.book_new();

  const summaryData = [
    ["SPLASH Juice Report"],
    [`From ${startDate} to ${endDate}`],
    [],
    ["Summary"],
    ["Revenue", totalRevenue],
    ["Expenses", totalExpenses],
    ["Net Profit", netProfit],
    ["Orders", totalOrders],
    ["Best Seller", bestSeller],
    ["Out of Stock", outOfStock],
    ["Returned Bottles", totalReturnedBottles],
    ["Most Returned", mostReturnedProduct],
    ["Top Return Store", storeWithMostReturns],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  summarySheet["!cols"] = [
    { wch: 28 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  const productBreakdownData = [
    ["Product", "Quantity Sold", "Revenue"],
    ...productBreakdown.map((product) => [
      product.name,
      product.quantity,
      product.revenue,
    ]),
  ];

  const productSheet = XLSX.utils.aoa_to_sheet(productBreakdownData);

  productSheet["!cols"] = [
    { wch: 32 },
    { wch: 18 },
    { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    productSheet,
    "Product Breakdown"
  );

  const salesData = [
    ["Product", "Quantity", "Unit Price", "Total", "Date"],
    ...filteredSalesReport.map((sale) => [
      sale.juice_name,
      sale.quantity,
      Number(sale.unit_price || 0),
      Number(sale.total_price || 0),
      sale.created_at ? new Date(sale.created_at).toLocaleString() : "",
    ]),
  ];

  const salesSheet = XLSX.utils.aoa_to_sheet(salesData);

  salesSheet["!cols"] = [
    { wch: 32 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales Report");

  const returnsData = [
    ["Store", "Product", "Returned Quantity", "Reason", "Note", "Date"],
    ...returns.map((item) => [
      item.store_name,
      item.juice_name,
      Number(item.quantity_returned || 0),
      item.reason || "",
      item.note || "",
      item.created_at ? new Date(item.created_at).toLocaleString() : "",
    ]),
  ];

  const returnsSheet = XLSX.utils.aoa_to_sheet(returnsData);

  returnsSheet["!cols"] = [
    { wch: 28 },
    { wch: 32 },
    { wch: 20 },
    { wch: 18 },
    { wch: 45 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(workbook, returnsSheet, "Returns Report");

  const expensesData = [
    ["Item", "Category", "Amount", "Date"],
    ...expensesReport.map((expense) => [
      expense.item_name,
      expense.category || "",
      Number(expense.paid_amount || 0),
      expense.created_at
        ? new Date(expense.created_at).toLocaleString()
        : "",
    ]),
  ];

  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);

  expensesSheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(workbook, expensesSheet, "Expenses Report");

  XLSX.writeFile(
    workbook,
    `splash-report-${startDate}-to-${endDate}.xlsx`
  );
};

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
              Review revenue, expenses, profit, best sellers, product sales and
              performance from one professional reports center.
            </p>
          </section>

          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <h2 style={sectionTitleStyle}>Filter Reports</h2>

            <div style={quickFilterStyle}>
              <button style={quickButtonStyle} onClick={() => applyQuickFilter("today")}>
                Today
              </button>

              <button style={quickButtonStyle} onClick={() => applyQuickFilter("month")}>
                This Month
              </button>

              <button style={quickButtonStyle} onClick={() => applyQuickFilter("year")}>
                This Year
              </button>
            </div>

            <div style={filterGridStyle} className="filterGrid">
              <div>
                <label style={smallTitleStyle}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={smallTitleStyle}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button onClick={() => fetchReportsData()} style={buttonStyle}>
                Apply Filter
              </button>

              <button
                onClick={() => applyQuickFilter("month")}
                style={{ ...buttonStyle, background: "#7aa85a" }}
              >
                Reset
              </button>
            </div>
          </section>

          <section style={compactExportStyle}>
            <span style={exportTextStyle}>Export current filtered report</span>

            <button style={smallButtonStyle} onClick={exportPDF}>
              Export PDF
            </button>

            <button
              style={{ ...smallButtonStyle, background: "#7aa85a" }}
              onClick={exportExcel}
            >
              Export Excel
            </button>
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
              <div style={sectionHeaderRowStyle}>
                <h2 style={sectionTitleStyle}>
                  {chartMode === "weekly"
                    ? "Weekly Sales Chart"
                    : chartMode === "weeks"
                    ? "Sales Per Week"
                    : "Monthly Sales Chart"}
                </h2>

                <div style={chartSwitchStyle}>
                  <button
                    style={
                      chartMode === "weekly"
                        ? activeChartButtonStyle
                        : chartButtonStyle
                    }
                    onClick={() => setChartMode("weekly")}
                  >
                    Weekly
                  </button>

                  <button
                    style={
                      chartMode === "weeks"
                        ? activeChartButtonStyle
                        : chartButtonStyle
                    }
                    onClick={() => setChartMode("weeks")}
                  >
                    4 Weeks
                  </button>

                  <button
                    style={
                      chartMode === "monthly"
                        ? activeChartButtonStyle
                        : chartButtonStyle
                    }
                    onClick={() => setChartMode("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div style={chartWrapperStyle}>
                {chartValues.map((value, index) => {
                  const maxValue = Math.max(...chartValues, 1);
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

                      <p style={chartLabelStyle}>{chartLabels[index]}</p>
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

                      <div style={progressBackStyle}>
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

          <section
            style={{
              ...cardStyle,
              marginTop: "34px",
              marginBottom: "34px",
            }}
          >
            <h2 style={sectionTitleStyle}>Product Sales Breakdown</h2>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {["Product", "Quantity Sold", "Revenue"].map((head) => (
                    <th key={head} style={thStyle}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {productBreakdown.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={3}>
                      No product sales in this period.
                    </td>
                  </tr>
                ) : (
                  productBreakdown.map((product) => (
                    <tr key={product.name}>
                      <td style={tdStyle}>{product.name}</td>
                      <td style={tdStyle}>{product.quantity}</td>
                      <td style={tdStyle}>${product.revenue.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section style={{ ...cardStyle, marginBottom: "34px" }}>
            <h2 style={sectionTitleStyle}>Returned Bottles</h2>

            <form onSubmit={handleAddReturn}>
              <div style={returnFormGridStyle} className="filterGrid">
                <div>
                  <label style={smallTitleStyle}>Store Name</label>
                  <input
                    type="text"
                    value={returnStoreName}
                    onChange={(e) => setReturnStoreName(e.target.value)}
                    placeholder="Example: Mini Market Hamra"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={smallTitleStyle}>Juice Name</label>
                  <select
                    value={returnJuiceName}
                    onChange={(e) => setReturnJuiceName(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Select juice</option>
                    {juiceOptions.map((juice) => (
                      <option key={juice} value={juice}>
                        {juice}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={smallTitleStyle}>Returned Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={returnQuantity}
                    onChange={(e) => setReturnQuantity(e.target.value)}
                    placeholder="Example: 5"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={smallTitleStyle}>Reason</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Select reason</option>
                    <option value="Not sold">Not sold</option>
                    <option value="Expired">Expired</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Wrong order">Wrong order</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={smallTitleStyle}>Note</label>
                  <input
                    type="text"
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    placeholder="Example: Returned from Hamra branch, bottles still sealed"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button type="submit" style={{ ...buttonStyle, marginTop: "20px" }}>
                Add Return
              </button>
            </form>
          </section>

          <section style={{ ...cardStyle, marginBottom: "34px" }}>
            <h2 style={sectionTitleStyle}>Returns Report</h2>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {["Date", "Store", "Product", "Returned Qty", "Reason", "Note"].map(
                    (head) => (
                      <th key={head} style={thStyle}>
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {returns.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={6}>
                      No returned bottles in this period.
                    </td>
                  </tr>
                ) : (
                  returns.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : ""}
                      </td>
                      <td style={tdStyle}>{item.store_name}</td>
                      <td style={tdStyle}>{item.juice_name}</td>
                      <td style={tdStyle}>{item.quantity_returned}</td>
                      <td style={tdStyle}>{item.reason || "-"}</td>
                      <td style={tdStyle}>{item.note || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section style={{ ...cardStyle, marginBottom: "34px" }}>
            <h2 style={sectionTitleStyle}>Sales Report</h2>

            <div style={reportFilterGridStyle} className="filterGrid">
              <div>
                <label style={smallTitleStyle}>Product Filter</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  style={inputStyle}
                >
                  {productFilterOptions.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={smallTitleStyle}>Sort By</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  style={inputStyle}
                >
                  <option value="newest">Newest Date</option>
                  <option value="oldest">Oldest Date</option>
                  <option value="highestQuantity">Highest Quantity</option>
                  <option value="highestTotal">Highest Total</option>
                  <option value="productAZ">Product A-Z</option>
                </select>
              </div>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {["Product", "Quantity", "Unit Price", "Total", "Date"].map(
                    (head) => (
                      <th key={head} style={thStyle}>
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredSalesReport.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={5}>
                      No sales match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredSalesReport.map((sale) => (
                    <tr key={sale.id}>
                      <td style={tdStyle}>{sale.juice_name}</td>
                      <td style={tdStyle}>{sale.quantity}</td>
                      <td style={tdStyle}>
                        ${Number(sale.unit_price || 0).toFixed(2)}
                      </td>
                      <td style={tdStyle}>
                        ${Number(sale.total_price || 0).toFixed(2)}
                      </td>
                      <td style={tdStyle}>
                        {sale.created_at
                          ? new Date(sale.created_at).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Expenses Report</h2>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {["Item", "Category", "Amount", "Date"].map((head) => (
                    <th key={head} style={thStyle}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {expensesReport.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={4}>
                      No expenses in this period.
                    </td>
                  </tr>
                ) : (
                  expensesReport.map((expense) => (
                    <tr key={expense.id}>
                      <td style={tdStyle}>{expense.item_name}</td>
                      <td style={tdStyle}>{expense.category}</td>
                      <td style={tdStyle}>
                        ${Number(expense.paid_amount || 0).toFixed(2)}
                      </td>
                      <td style={tdStyle}>
                        {expense.created_at
                          ? new Date(expense.created_at).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
              .filterGrid {
                grid-template-columns: 1fr !important;
              }

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

const quickFilterStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap" as const,
  marginBottom: "24px",
};

const filterGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto auto",
  gap: "16px",
  alignItems: "end",
};

const reportFilterGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginBottom: "24px",
};

const returnFormGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "16px",
  alignItems: "end",
};

const compactExportStyle = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(14px)",
  padding: "18px 24px",
  borderRadius: "26px",
  boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
  border: "1px solid rgba(255,255,255,0.7)",
  marginBottom: "34px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap" as const,
};

const exportTextStyle = {
  color: "#2e4732",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
  marginRight: "8px",
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

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "16px",
  border: "1px solid #d6d6d6",
  outline: "none",
  background: "rgba(255,255,255,0.85)",
  fontSize: "15px",
  fontFamily: "Arial, sans-serif",
};

const buttonStyle = {
  padding: "15px 24px",
  borderRadius: "999px",
  border: "none",
  background: "#304638",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "15px",
  fontFamily: "Arial, sans-serif",
  height: "52px",
};

const smallButtonStyle = {
  padding: "11px 18px",
  borderRadius: "999px",
  border: "none",
  background: "#304638",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
};

const quickButtonStyle = {
  padding: "12px 20px",
  borderRadius: "999px",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
};

const sectionHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  flexWrap: "wrap" as const,
};

const chartSwitchStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap" as const,
};

const chartButtonStyle = {
  padding: "9px 14px",
  borderRadius: "999px",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 800,
  fontFamily: "Arial, sans-serif",
};

const activeChartButtonStyle = {
  ...chartButtonStyle,
  background: "#7aa85a",
  color: "white",
};

const progressBackStyle = {
  height: "12px",
  background: "#eef0df",
  borderRadius: "999px",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  fontFamily: "Arial, sans-serif",
};

const thStyle = {
  textAlign: "left" as const,
  padding: "14px",
  borderBottom: "1px solid rgba(48,70,56,0.18)",
  color: "#2e4732",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid rgba(48,70,56,0.1)",
  color: "#435848",
