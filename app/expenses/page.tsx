"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

type Expense = {
  id?: number;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  paid_amount: number;
  price_per_unit: number;
  created_at?: string;
};

const expenseOptions = [
  { title: "Orange", category: "Fruits", unit: "kg" },
  { title: "Strawberry", category: "Fruits", unit: "kg" },
  { title: "Banana", category: "Fruits", unit: "kg" },
  { title: "Lemon", category: "Fruits", unit: "kg" },
  { title: "Pomegranate", category: "Fruits", unit: "kg" },
  { title: "Mango", category: "Fruits", unit: "kg" },
  { title: "Carrot", category: "Fruits", unit: "kg" },
  { title: "Mint", category: "Fruits", unit: "pc" },
  { title: "Sugar", category: "Ingredients", unit: "kg" },
  { title: "Water", category: "Ingredients", unit: "liter" },
  { title: "Bottles 250 ml", category: "Packaging", unit: "piece" },
  { title: "Bottles 1 Liter", category: "Packaging", unit: "piece" },
  { title: "Caps", category: "Packaging", unit: "piece" },
  { title: "Others", category: "Other", unit: "item" },
];

export default function ExpensesPage() {
  const [title, setTitle] = useState(expenseOptions[0].title);
  const [customExpenseTitle, setCustomExpenseTitle] = useState("");
  const [category, setCategory] = useState(expenseOptions[0].category);
  const [unit, setUnit] = useState(expenseOptions[0].unit);
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.paid_amount, 0);
  }, [expenses]);

  const pricePerUnitPreview = useMemo(() => {
  const parsedAmount = Number(amount) || 0;
  const parsedQuantity = Number(quantity);

  if (parsedQuantity <= 0) return 0;

  return parsedAmount / parsedQuantity;
}, [amount, quantity]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setExpenses(data || []);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);

    const selectedExpense = expenseOptions.find((item) => item.title === value);

    if (selectedExpense) {
      setCategory(selectedExpense.category);
      setUnit(selectedExpense.unit);
    }
  };

  const handleAddExpense = async () => {
    const finalExpenseTitle =
    title === "Others" ? customExpenseTitle : title;

    if (title === "Others" && customExpenseTitle.trim() === "") {
      alert("Please enter the expense title");
      return;
    }
    const parsedAmount = Number(amount);

    const parsedQuantity = Number(quantity);

    if (parsedQuantity <= 0 || parsedAmount <= 0) return;

    const { error } = await supabase.from("expenses").insert([
      {
        item_name: title,
        category,
        quantity,
        unit,
        paid_amount: parsedAmount,
        price_per_unit: parsedAmount / parsedQuantity,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setQuantity("");
    setAmount("");
    fetchExpenses();
  };

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
          <section style={heroStyle}>
            <p style={labelStyle}>EXPENSES MANAGEMENT</p>

            <h1 style={titleStyle}>
              Track
              <br />
              Business Costs
            </h1>

            <p style={descriptionStyle}>
              Record fruit purchases, packaging costs, ingredients and other
              expenses with automatic price-per-unit calculation.
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={sectionTitle}>Add Expense</h2>

            <div style={{ display: "grid", gap: "18px", maxWidth: "540px" }}>
              <div>
                <label style={fieldLabel}>Expense Title</label>
                <select
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  style={inputStyle}
                >
                  {expenseOptions.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {title === "Others" && (
                <input
                  type="text"
                  value={customExpenseTitle}
                  onChange={(e) => setCustomExpenseTitle(e.target.value)}
                  placeholder="Example: Blender, Cups, Delivery..."
                  style={inputStyle}
                />
              )}
              </div>

              <div>
                <label style={fieldLabel}>Category</label>
                <input type="text" value={category} readOnly style={inputStyle} />
              </div>

              <div>
                <label style={fieldLabel}>Quantity</label>
                <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={inputStyle}
              />
              </div>

              <div>
                <label style={fieldLabel}>Unit</label>
                <input type="text" value={unit} readOnly style={inputStyle} />
              </div>

              <div>
                <label style={fieldLabel}>Total Amount Paid</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter total amount"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  padding: "18px",
                  background: "#eef0df",
                  borderRadius: "18px",
                  fontWeight: 900,
                  color: "#2e4732",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Price Per Unit: ${pricePerUnitPreview.toFixed(2)} / {unit}
              </div>

              <button onClick={handleAddExpense} style={buttonStyle}>
                Add Expense
              </button>
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={sectionTitle}>Total Expenses</h2>

            <p
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                margin: 0,
                color: "#2e4732",
              }}
            >
              ${totalExpenses.toFixed(2)}
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={sectionTitle}>Recent Expenses</h2>

            {expenses.length === 0 ? (
              <p style={{ color: "#435848", fontFamily: "Arial, sans-serif" }}>
                No expenses added yet.
              </p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Title",
                        "Category",
                        "Quantity",
                        "Unit",
                        "Total Paid",
                        "Price / Unit",
                        "Date & Time",
                    ].map((head) => (
                      <th key={head} style={thStyle}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td style={tdStyle}>{expense.item_name}</td>
                      <td style={tdStyle}>{expense.category}</td>
                      <td style={tdStyle}>{expense.quantity}</td>
                      <td style={tdStyle}>{expense.unit}</td>
                      <td style={tdStyle}>${expense.paid_amount.toFixed(2)}</td>
                      <td style={tdStyle}>
                        ${expense.price_per_unit.toFixed(2)} / {expense.unit}
                      </td>
                      <td style={tdStyle}>
                         {expense.created_at
                            ? new Date(expense.created_at).toLocaleString()
                            : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
      </main>
    </ProtectedPage>
  );
}

const heroStyle = {
  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(14px)",
  borderRadius: "40px",
  padding: "55px",
  marginBottom: "30px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const labelStyle = {
  margin: 0,
  color: "#7aa85a",
  fontWeight: "bold",
  letterSpacing: "2px",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
};

const titleStyle = {
  margin: "18px 0 0",
  color: "#2e4732",
  fontSize: "72px",
  lineHeight: "1",
  fontWeight: "bold",
};

const descriptionStyle = {
  marginTop: "22px",
  fontSize: "21px",
  color: "#435848",
  lineHeight: "1.8",
  maxWidth: "620px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(14px)",
  padding: "36px",
  borderRadius: "34px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.7)",
  marginBottom: "28px",
};

const sectionTitle = {
  marginTop: 0,
  color: "#2e4732",
  fontSize: "38px",
};

const fieldLabel = {
  fontWeight: 800,
  color: "#2e4732",
  fontFamily: "Arial, sans-serif",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "8px",
  borderRadius: "16px",
  border: "1px solid #d6d6d6",
  outline: "none",
  background: "rgba(255,255,255,0.85)",
  fontSize: "15px",
  fontFamily: "Arial, sans-serif",
};

const buttonStyle = {
  padding: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#304638",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
  boxShadow: "0 12px 24px rgba(48,70,56,0.25)",
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
};