"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

const products = [
  "Orange - 250 ml",
  "Orange - 1 Liter",
  "Strawberry Banana - 250 ml",
  "Strawberry Banana - 1 Liter",
  "Strawberry Lemonade - 250 ml",
  "Strawberry Lemonade - 1 Liter",
  "Lemonade - 250 ml",
  "Lemonade - 1 Liter",
  "Pomegranate - 250 ml",
  "Pomegranate - 1 Liter",
  "Minted Lemonade - 250 ml",
  "Minted Lemonade - 1 Liter",
  "Straw Mango - 250 ml",
  "Straw Mango - 1 Liter",
  "Mango - 250 ml",
  "Mango - 1 Liter",
  "Carrot - 250 ml",
  "Carrot - 1 Liter",
];

type Sale = {
  id?: number;
  juice_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
};

export default function SalesPage() {
  const [product, setProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);

  const totalPrice = useMemo(() => {
    const price = Number(unitPrice) || 0;
    return quantity * price;
  }, [quantity, unitPrice]);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setSales(data || []);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleAddSale = async () => {
    if (!product || quantity <= 0) return;

    const parsedUnitPrice = Number(unitPrice) || 0;

  const recipes: Record<string, Record<string, number>> = {
      "Orange - 250 ml": {
        Oranges: 0.45,
        "Bottles 250 ml": 1,
        Caps: 1,
        "Orange Stickers 250ML": 1,
      },

      "Orange - 1 Liter": {
        Oranges: 1.8,
        "Bottles 1 Liter": 1,
        Caps: 1,
        "Orange Stickers 1L": 1,
      },

      "Pomegranate - 250 ml": {
        "Frozen Pomegranates": 0.333,
        "Bottles 250 ml": 1,
        Caps: 1,
        "Pomegranate Stickers 250ML": 1,
      },

      "Pomegranate - 1 Liter": {
        "Frozen Pomegranates": 1.333,
        "Bottles 1 Liter": 1,
        Caps: 1,
        "Pomegranate Stickers 1L": 1,
      },
    };
    const recipe = recipes[product];

    if (recipe) {
      const inventoryUpdates = [];

      for (const itemName in recipe) {
        const neededQuantity = recipe[itemName] * quantity;

        const { data: inventoryItem, error: fetchError } = await supabase
          .from("inventory")
          .select("*")
          .eq("item_name", itemName)
          .single();

        if (fetchError || !inventoryItem) {
          alert(`${itemName} not found in inventory`);
          return;
        }

        const newStock = inventoryItem.quantity - neededQuantity;

        if (newStock < 0) {
          alert(`Not enough stock for ${itemName}`);
          return;
        }

        inventoryUpdates.push({
          id: inventoryItem.id,
          quantity: newStock,
        });
      }

      for (const update of inventoryUpdates) {
        const { error: updateError } = await supabase
          .from("inventory")
          .update({ quantity: update.quantity })
          .eq("id", update.id);

        if (updateError) {
          alert(updateError.message);
          return;
        }
      }
    }

    const { error } = await supabase.from("sales").insert([
      {
        juice_name: product,
        quantity,
        unit_price: parsedUnitPrice,
        total_price: quantity * parsedUnitPrice,
        quantity_sold: quantity,
        selling_price: parsedUnitPrice,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setQuantity(1);
    setUnitPrice("");
    fetchSales();
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
          <section
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(14px)",
              borderRadius: "40px",
              padding: "55px",
              marginBottom: "30px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          >
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
              SALES MANAGEMENT
            </p>

            <h1
              style={{
                margin: "18px 0 0",
                color: "#2e4732",
                fontSize: "72px",
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              Record
              <br />
              Fresh Sales
            </h1>

            <p
              style={{
                marginTop: "22px",
                fontSize: "21px",
                color: "#435848",
                lineHeight: "1.8",
                maxWidth: "620px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Add sold juice items, calculate totals, and keep your sales
              history connected online.
            </p>
          </section>

          <section
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(14px)",
              padding: "36px",
              borderRadius: "34px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.7)",
              marginBottom: "28px",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#2e4732", fontSize: "38px" }}>
              Add Sale
            </h2>

            <div style={{ display: "grid", gap: "18px", maxWidth: "540px" }}>
              {[
                ["Product", "select"],
                ["Quantity", "quantity"],
                ["Unit Price", "price"],
              ].map(([label, type]) => (
                <div key={label}>
                  <label
                    style={{
                      fontWeight: 800,
                      color: "#2e4732",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {label}
                  </label>

                  {type === "select" ? (
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      style={inputStyle}
                    >
                      {products.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={type === "quantity" ? quantity : unitPrice}
                      onChange={(e) =>
                        type === "quantity"
                          ? setQuantity(Number(e.target.value))
                          : setUnitPrice(e.target.value)
                      }
                      placeholder={
                        type === "price" ? "Enter selling price" : undefined
                      }
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}

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
                Total Price: ${totalPrice.toFixed(2)}
              </div>

              <button
                onClick={handleAddSale}
                style={{
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
                }}
              >
                Add Sale
              </button>
            </div>
          </section>

          <section
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(14px)",
              padding: "36px",
              borderRadius: "34px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#2e4732", fontSize: "38px" }}>
              Recent Sales
            </h2>

            {sales.length === 0 ? (
              <p style={{ color: "#435848", fontFamily: "Arial, sans-serif" }}>
                No sales added yet.
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
                      "Product",
                      "Quantity",
                      "Unit Price",
                      "Total Price",
                      "Date & Time",
                    ].map((head) => (
                      <th key={head} style={thStyle}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td style={tdStyle}>{sale.juice_name}</td>
                      <td style={tdStyle}>{sale.quantity}</td>
                      <td style={tdStyle}>${sale.unit_price.toFixed(2)}</td>
                      <td style={tdStyle}>${sale.total_price.toFixed(2)}</td>
                      <td style={tdStyle}>
                        {sale.created_at
                          ? new Date(sale.created_at).toLocaleString()
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