"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

type InventoryItem = {
  id?: number;
  item_name: string;
  category: string;
  unit: string;
  quantity: number;
  created_at?: string;
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
  { name: "Orange Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Strawberry Banana Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Strawberry Lemonade Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Lemonade Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Minted Lemonade Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Mango Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Carrot Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Pomegranate Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Straw Mango Stickers 250ML", category: "Packaging", unit: "Pc" },
  { name: "Orange Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Strawberry Banana Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Strawberry Lemonade Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Lemonade Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Minted Lemonade Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Mango Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Carrot Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Pomegranate Stickers 1L", category: "Packaging", unit: "Pc" },
  { name: "Straw Mango Stickers 1L", category: "Packaging", unit: "Pc" },

];

const categories = ["Fruit", "Ingredient", "Packaging"];

export default function InventoryPage() {
  const [category, setCategory] = useState(categories[0]);
  const [selectedName, setSelectedName] = useState("Oranges");
  const [unit, setUnit] = useState("Kg");
  const [stock, setStock] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);

  const filteredItems = itemOptions.filter(
    (item) => item.category === category
  );

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

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
              INVENTORY MANAGEMENT
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
              Track
              <br />
              Fresh Stock
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
              Manage fruits, ingredients, packaging and bottles in one clean
              inventory system.
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
            <h2
              style={{
                marginTop: 0,
                color: "#2e4732",
                fontSize: "38px",
              }}
            >
              Add / Adjust Inventory
            </h2>

            <div style={{ display: "grid", gap: "18px", maxWidth: "540px" }}>
              <div>
                <label style={labelStyle}>Category</label>

                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  style={inputStyle}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Item Name</label>

                <select
                  value={selectedName}
                  onChange={(e) => handleItemChange(e.target.value)}
                  style={inputStyle}
                >
                  {filteredItems.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Unit</label>

                <input
                  type="text"
                  value={unit}
                  readOnly
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Stock Adjustment (+ / -)</label>

                <input
                  type="text"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Example: 50 or -20"
                  style={inputStyle}
                />
              </div>

              <button
                onClick={handleAddItem}
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
                Save Adjustment
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
            <h2
              style={{
                marginTop: 0,
                color: "#2e4732",
                fontSize: "38px",
              }}
            >
              Inventory List
            </h2>

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
                      "Item Name",
                      "Category",
                      "Unit",
                      "Current Stock",
                      "Date & Time",
                    ].map(
                    (head) => (
                      <th
                        key={head}
                        style={{
                          textAlign: "left",
                          padding: "14px",
                          borderBottom:
                            "1px solid rgba(48,70,56,0.18)",
                          color: "#2e4732",
                        }}
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyle}>{item.item_name}</td>
                    <td style={tdStyle}>{item.category}</td>
                    <td style={tdStyle}>{item.unit}</td>
                    <td style={tdStyle}>{item.quantity}</td>

                    <td style={tdStyle}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

const labelStyle = {
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

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid rgba(48,70,56,0.1)",
  color: "#435848",
};