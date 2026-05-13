"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

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
      Stickers: 1,
    },

    "Orange - 1 Liter": {
      Oranges: 1.8,
      "Bottles 1 Liter": 1,
      Caps: 1,
      Stickers: 1,
    },
  };

  const recipe = recipes[product];

  if (recipe) {
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

      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          quantity: newStock,
        })
        .eq("id", inventoryItem.id);

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
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <section style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>Sales</h1>

        <p style={{ marginTop: "10px", color: "#666" }}>
          Record each sold juice item.
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
        <h2 style={{ marginTop: 0 }}>Add Sale</h2>

        <div style={{ display: "grid", gap: "14px", maxWidth: "500px" }}>
          <div>
            <label>Product</label>
            <br />

            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "6px" }}
            >
              {products.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Quantity</label>
            <br />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: "100%", padding: "10px", marginTop: "6px" }}
            />
          </div>

          <div>
            <label>Unit Price</label>
            <br />

            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="Enter selling price"
              style={{ width: "100%", padding: "10px", marginTop: "6px" }}
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
            Total Price: ${totalPrice.toFixed(2)}
          </div>

          <button
            onClick={handleAddSale}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add Sale
          </button>
        </div>
      </section>

      <section
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Recent Sales</h2>

        {sales.length === 0 ? (
          <p style={{ color: "#666" }}>No sales added yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Product
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Quantity
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Unit Price
                </th>

                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Total Price
                </th>
                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Date & Time
                </th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {sale.juice_name}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {sale.quantity}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    ${sale.unit_price.toFixed(2)}
                  </td>

                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    ${sale.total_price.toFixed(2)}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
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
    </main>
  );
}