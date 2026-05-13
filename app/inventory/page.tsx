"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type InventoryItem = {
  id?: number;
  item_name: string;
  category: string;
  unit: string;
  quantity: number;
};

const itemOptions = [
  { name: "Oranges", category: "Fruit", unit: "Kg" },
  { name: "Strawberries", category: "Fruit", unit: "Kg" },
  { name: "Bananas", category: "Fruit", unit: "Kg" },
  { name: "Lemons", category: "Fruit", unit: "Kg" },
  { name: "Pomegranates", category: "Fruit", unit: "Kg" },
  { name: "Frozen Pomegranates", category: "Fruit", unit: "Kg" },
  { name: "Mangos", category: "Fruit", unit: "Kg" },
  { name: "Carrots", category: "Fruit", unit: "Kg" },
  { name: "Mints", category: "Ingredient", unit: "Pc" },
  { name: "Sugar", category: "Ingredient", unit: "Kg" },
  { name: "Water", category: "Ingredient", unit: "Liter" },
  { name: "Bottles 250 ml", category: "Packaging", unit: "Pc" },
  { name: "Bottles 1 Liter", category: "Packaging", unit: "Pc" },
  { name: "Caps", category: "Packaging", unit: "Pc" },
  { name: "Orange Stickers", category: "Packaging", unit: "Pc" },
  { name: "Strawberry Banana Stickers", category: "Packaging", unit: "Pc" },
  { name: "Strawberry Lemonade Stickers", category: "Packaging", unit: "Pc" },
  { name: "Lemonade Stickers", category: "Packaging", unit: "Pc" },
  { name: "Minted Lemonade Stickers", category: "Packaging", unit: "Pc" },
  { name: "Mango Stickers", category: "Packaging", unit: "Pc" },
  { name: "Carrot Stickers", category: "Packaging", unit: "Pc" },
  { name: "Pomegranate Stickers", category: "Packaging", unit: "Pc" },
  { name: "Straw Mango Stickers", category: "Packaging", unit: "Pc" },
];

const categories = ["Fruit", "Ingredient", "Packaging"];

export default function InventoryPage() {
  const [category, setCategory] = useState(categories[0]);
  const [selectedName, setSelectedName] = useState("Oranges");
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);

  const filteredItems = itemOptions.filter(
    (item) => item.category === category
  );

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCategoryChange = (value: string) => {
    setCategory(value);

    const firstItem = itemOptions.find((item) => item.category === value);

    if (firstItem) {
      setSelectedName(firstItem.name);
      setUnit(firstItem.unit);
    }
  };

  const handleItemChange = (value: string) => {
    setSelectedName(value);

    const selectedItem = itemOptions.find((item) => item.name === value);

    if (selectedItem) {
      setUnit(selectedItem.unit);
    }
  };

  const handleAddItem = async () => {
    const stockNumber = Number(stock);

    if (stock.trim() === "" || stockNumber === 0 || isNaN(stockNumber)) {
      alert("Please enter a valid stock adjustment");
      return;
    }

    const existingItem = items.find(
      (item) => item.item_name === selectedName
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + stockNumber;

      if (newQuantity < 0) {
        alert("Stock cannot be negative");
        return;
      }

      const { error } = await supabase
        .from("inventory")
        .update({
          quantity: newQuantity,
          category,
          unit,
        })
        .eq("id", existingItem.id);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      if (stockNumber < 0) {
        alert("Cannot create item with negative stock");
        return;
      }

      const { error } = await supabase.from("inventory").insert([
        {
          item_name: selectedName,
          category,
          unit,
          quantity: stockNumber,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    setStock("");
    fetchInventory();
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
        <h1 style={{ margin: 0, fontSize: "32px" }}>Inventory</h1>

        <p style={{ marginTop: "10px", color: "#666" }}>
          Track fruits, ingredients, and packaging items.
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
        <h2 style={{ marginTop: 0 }}>Add / Adjust Inventory Item</h2>

        <div style={{ display: "grid", gap: "14px", maxWidth: "500px" }}>
          <div>
            <label>Category</label>
            <br />

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "6px" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Item Name</label>
            <br />

            <select
              value={selectedName}
              onChange={(e) => handleItemChange(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "6px" }}
            >
              {filteredItems.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
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
            <label>Stock Adjustment (+ / -)</label>
            <br />

            <input
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Example: 50 or -20"
              style={{ width: "100%", padding: "10px", marginTop: "6px" }}
            />
          </div>

          <button
            onClick={handleAddItem}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            Save Adjustment
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
        <h2 style={{ marginTop: 0 }}>Inventory List</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                Item Name
              </th>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                Category
              </th>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                Unit
              </th>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>
                Current Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {item.item_name}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {item.category}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {item.unit}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}