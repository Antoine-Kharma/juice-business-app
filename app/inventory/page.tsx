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
  { name: "Oranges", category: "Fruit", unit: "kg" },
  { name: "Strawberries", category: "Fruit", unit: "kg" },
  { name: "Bananas", category: "Fruit", unit: "kg" },
  { name: "Lemons", category: "Fruit", unit: "kg" },
  { title: "Pomegranate", category: "Fruits", unit: "kg" },
  { title: "Mango", category: "Fruits", unit: "kg" },
  { title: "Carrot", category: "Fruits", unit: "kg" },
  { title: "Mint", category: "Fruits", unit: "pc" },
  { name: "Sugar", category: "Ingredient", unit: "kg" },
  { name: "Water", category: "Ingredient", unit: "liter" },
  { name: "Bottles 250 ml", category: "Packaging", unit: "piece" },
  { name: "Bottles 1 Liter", category: "Packaging", unit: "piece" },
  { name: "Caps", category: "Packaging", unit: "piece" },
];

export default function InventoryPage() {
  const [selectedName, setSelectedName] = useState(itemOptions[0].name);
  const [category, setCategory] = useState(itemOptions[0].category);
  const [unit, setUnit] = useState(itemOptions[0].unit);
  const [stock, setStock] = useState(0);
  const [items, setItems] = useState<InventoryItem[]>([]);

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

  const handleItemChange = (value: string) => {
    setSelectedName(value);

    const selectedItem = itemOptions.find((item) => item.name === value);
    if (selectedItem) {
      setCategory(selectedItem.category);
      setUnit(selectedItem.unit);
    }
  };

  const handleAddItem = async () => {
    if (stock <= 0) {
      alert("Please enter a stock quantity greater than 0");
      return;
    }

    const existingItem = items.find((item) => item.item_name === selectedName);

    if (existingItem) {
      const { error } = await supabase
        .from("inventory")
        .update({
          quantity: existingItem.quantity + stock,
          category,
          unit,
        })
        .eq("id", existingItem.id);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("inventory").insert([
        {
          item_name: selectedName,
          category,
          unit,
          quantity: stock,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    setStock(0);
    fetchInventory();
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <section style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>Inventory</h1>
        <p style={{ marginTop: "10px", color: "#666" }}>
          Track fruits, ingredients, and packaging items.
        </p>
      </section>

      <section style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
        <h2 style={{ marginTop: 0 }}>Add Inventory Item</h2>

        <div style={{ display: "grid", gap: "14px", maxWidth: "500px" }}>
          <div>
            <label>Item Name</label>
            <br />
            <select value={selectedName} onChange={(e) => handleItemChange(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px" }}>
              {itemOptions.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Category</label>
            <br />
            <input type="text" value={category} readOnly style={{ width: "100%", padding: "10px", marginTop: "6px", backgroundColor: "#f3f4f6" }} />
          </div>

          <div>
            <label>Unit</label>
            <br />
            <input type="text" value={unit} readOnly style={{ width: "100%", padding: "10px", marginTop: "6px", backgroundColor: "#f3f4f6" }} />
          </div>

          <div>
            <label>Quantity to Add</label>
            <br />
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} style={{ width: "100%", padding: "10px", marginTop: "6px" }} />
          </div>

          <button onClick={handleAddItem} style={{ padding: "12px 16px", borderRadius: "10px", border: "none", backgroundColor: "black", color: "white", cursor: "pointer" }}>
            Add Item
          </button>
        </div>
      </section>

      <section style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginTop: 0 }}>Inventory List</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Item Name</th>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Category</th>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Unit</th>
              <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.item_name}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.category}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.unit}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}