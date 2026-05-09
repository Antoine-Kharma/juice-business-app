"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Expense = {
  id?: number;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  paid_amount: number;
  price_per_unit: number;
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
  const [category, setCategory] = useState(expenseOptions[0].category);
  const [unit, setUnit] = useState(expenseOptions[0].unit);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + expense.paid_amount,
      0
    );
  }, [expenses]);

  const pricePerUnitPreview = useMemo(() => {
    const parsedAmount = Number(amount) || 0;

    if (quantity <= 0) return 0;

    return parsedAmount / quantity;
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

    const selectedExpense = expenseOptions.find(
      (item) => item.title === value
    );

    if (selectedExpense) {
      setCategory(selectedExpense.category);
      setUnit(selectedExpense.unit);
    }
  };

  const handleAddExpense = async () => {
    const parsedAmount = Number(amount);

    if (quantity <= 0 || parsedAmount <= 0) return;

    const { error } = await supabase.from("expenses").insert([
      {
        item_name: title,
        category,
        quantity,
        unit,
        paid_amount: parsedAmount,
        price_per_unit: parsedAmount / quantity,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setQuantity(1);
    setAmount("");

    fetchExpenses();
  };

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <section style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>Expenses</h1>

        <p style={{ marginTop: "10px", color: "#666" }}>
          Track purchases and business costs.
        </p>
      </section>

      <section
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add Expense</h2>

        <div style={{ display: "grid", gap: "14px", maxWidth: "500px" }}>
          <div>
            <label>Expense Title</label>
            <br />

            <select
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            >
              {expenseOptions.map((item) => (
                <option key={item.title} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Category</label>
            <br />

            <input
              type="text"
              value={category}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                backgroundColor: "#f3f4f6",
              }}
            />
          </div>

          <div>
            <label>Quantity</label>
            <br />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          <div>
            <label>Unit</label>
            <br />

            <input
              type="text"
              value={unit}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                backgroundColor: "#f3f4f6",
              }}
            />
          </div>

          <div>
            <label>Total Amount Paid</label>
            <br />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter total amount"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          <div
            style={{
              padding: "12px",
              backgroundColor: "#f3f4f6",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            Price Per Unit: ${pricePerUnitPreview.toFixed(2)} / {unit}
          </div>

          <button
            onClick={handleAddExpense}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add Expense
          </button>
        </div>
      </section>

      <section
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Total Expenses</h2>

        <p
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          ${totalExpenses.toFixed(2)}
        </p>
      </section>

      <section
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Recent Expenses</h2>

        {expenses.length === 0 ? (
          <p style={{ color: "#666" }}>No expenses added yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Title
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Category
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Quantity
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Unit
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Total Paid
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Price / Unit
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {expense.item_name}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {expense.category}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {expense.quantity}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {expense.unit}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    ${expense.paid_amount.toFixed(2)}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    ${expense.price_per_unit.toFixed(2)} / {expense.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}