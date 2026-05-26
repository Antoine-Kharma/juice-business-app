"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

const USD_TO_LBP_RATE = 89500;

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

// Add your fixed festival prices here before starting the event.
const productPrices: Record<string, number> = {
  "Orange - 250 ml": 0,
  "Orange - 1 Liter": 0,
  "Strawberry Banana - 250 ml": 0,
  "Strawberry Banana - 1 Liter": 0,
  "Strawberry Lemonade - 250 ml": 0,
  "Strawberry Lemonade - 1 Liter": 0,
  "Lemonade - 250 ml": 0,
  "Lemonade - 1 Liter": 0,
  "Pomegranate - 250 ml": 0,
  "Pomegranate - 1 Liter": 0,
  "Minted Lemonade - 250 ml": 0,
  "Minted Lemonade - 1 Liter": 0,
  "Straw Mango - 250 ml": 0,
  "Straw Mango - 1 Liter": 0,
  "Mango - 250 ml": 0,
  "Mango - 1 Liter": 0,
  "Carrot - 250 ml": 0,
  "Carrot - 1 Liter": 0,
};

const recipes: Record<string, Record<string, number>> = {
  "Pomegranate - 250 ml": {
    "Frozen Pomegranates": 0.4,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Pomegranate Stickers 250ML": 1,
  },

  "Pomegranate - 1 Liter": {
    "Frozen Pomegranates": 1.6,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Pomegranate Stickers 1L": 1,
  },

  "Orange - 250 ml": {
    Oranges: 0.7,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Orange Stickers 250ML": 1,
  },

  "Orange - 1 Liter": {
    Oranges: 2.8,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Orange Stickers 1L": 1,
  },

  "Carrot - 250 ml": {
    Carrots: 0.7,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Carrot Stickers 250ML": 1,
  },

  "Carrot - 1 Liter": {
    Carrots: 2.8,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Carrot Stickers 1L": 1,
  },

  "Lemonade - 250 ml": {
    Lemons: 0.33,
    Sugar: 0.05,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Lemonade Stickers 250ML": 1,
  },

  "Lemonade - 1 Liter": {
    Lemons: 1.32,
    Sugar: 0.2,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Lemonade Stickers 1L": 1,
  },

  "Minted Lemonade - 250 ml": {
    Lemons: 0.33,
    Sugar: 0.05,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Minted Lemonade Stickers 250ML": 1,
  },

  "Minted Lemonade - 1 Liter": {
    Lemons: 1.32,
    Sugar: 0.2,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Minted Lemonade Stickers 1L": 1,
  },

  "Strawberry Lemonade - 250 ml": {
    Lemons: 0.25,
    Strawberries: 0.042,
    Sugar: 0.043,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Strawberry Lemonade Stickers 250ML": 1,
  },

  "Strawberry Lemonade - 1 Liter": {
    Lemons: 1,
    Strawberries: 0.17,
    Sugar: 0.172,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Strawberry Lemonade Stickers 1L": 1,
  },

  "Strawberry Banana - 250 ml": {
    Strawberries: 0.17,
    Bananas: 0.1,
    Sugar: 0.02,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Strawberry Banana Stickers 250ML": 1,
  },

  "Strawberry Banana - 1 Liter": {
    Strawberries: 0.68,
    Bananas: 0.4,
    Sugar: 0.08,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Strawberry Banana Stickers 1L": 1,
  },

  "Mango - 250 ml": {
    Mangos: 0.125,
    Sugar: 0.023,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Mango Stickers 250ML": 1,
  },

  "Mango - 1 Liter": {
    Mangos: 0.5,
    Sugar: 0.09,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Mango Stickers 1L": 1,
  },

  "Straw Mango - 250 ml": {
    Mangos: 0.063,
    Strawberries: 0.084,
    Sugar: 0.022,
    "Bottles 250 ml": 1,
    Caps: 1,
    "Straw Mango Stickers 250ML": 1,
  },

  "Straw Mango - 1 Liter": {
    Mangos: 0.25,
    Strawberries: 0.336,
    Sugar: 0.088,
    "Bottles 1 Liter": 1,
    Caps: 1,
    "Straw Mango Stickers 1L": 1,
  },
};

type CartItem = {
  juice_name: string;
  quantity: number;
  unit_price: number;
};

type Sale = {
  id?: number;
  juice_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method?: string;
  sale_type?: string;
  paid_amount?: number;
  change_usd?: number;
  change_lbp?: number;
  created_at?: string;
};

type CategoryFilter = "All" | "250 ml" | "1 Liter";

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldCart, setHeldCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [searchText, setSearchText] = useState("");

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      categoryFilter === "All" ||
      item.toLowerCase().includes(categoryFilter.toLowerCase());

    const matchesSearch = item.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  }, [cart]);

  const totalBottles = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const paidAmountNumber = Number(paidAmount) || 0;
  const changeUSD = paidAmountNumber - cartTotal;
  const roundedChangeUSD = changeUSD > 0 ? changeUSD : 0;

  const changeLBP =
    roundedChangeUSD > 0
      ? Math.round((roundedChangeUSD * USD_TO_LBP_RATE) / 10000) * 10000
      : 0;

  const todaySalesTotal = useMemo(() => {
    const today = new Date().toDateString();

    return sales
      .filter((sale) => {
        if (!sale.created_at) return false;
        return new Date(sale.created_at).toDateString() === today;
      })
      .reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);
  }, [sales]);

  const todayBottlesSold = useMemo(() => {
    const today = new Date().toDateString();

    return sales
      .filter((sale) => {
        if (!sale.created_at) return false;
        return new Date(sale.created_at).toDateString() === today;
      })
      .reduce((sum, sale) => sum + Number(sale.quantity || 0), 0);
  }, [sales]);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("id", { ascending: false })
      .limit(10);

    if (error) {
      alert(error.message);
      return;
    }

    setSales(data || []);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const addToCart = (productName: string) => {
    const price = productPrices[productName] || 0;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.juice_name === productName
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.juice_name === productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          juice_name: productName,
          quantity: 1,
          unit_price: price,
        },
      ];
    });
  };

  const increaseQuantity = (productName: string) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.juice_name === productName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productName: string) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.juice_name === productName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productName: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.juice_name !== productName)
    );
  };

  const cleanCart = () => {
    setCart([]);
    setPaidAmount("");
  };

  const holdCart = () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    setHeldCart(cart);
    setCart([]);
    setPaidAmount("");
    alert("Order is on hold.");
  };

  const restoreHeldCart = () => {
    if (heldCart.length === 0) {
      alert("No held order.");
      return;
    }

    setCart(heldCart);
    setHeldCart([]);
  };

  const openPaymentPopup = () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    setPaidAmount(cartTotal.toFixed(2));
    setShowPaymentPopup(true);
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    if (paidAmountNumber < cartTotal) {
      alert("Paid amount is less than the total amount.");
      return;
    }

    const neededInventory: Record<string, number> = {};

    for (const cartItem of cart) {
      const recipe = recipes[cartItem.juice_name];

      if (!recipe) {
        alert(`Recipe not found for ${cartItem.juice_name}`);
        return;
      }

      for (const itemName in recipe) {
        neededInventory[itemName] =
          (neededInventory[itemName] || 0) +
          recipe[itemName] * cartItem.quantity;
      }
    }

    const inventoryUpdates: { id: number; quantity: number }[] = [];

    for (const itemName in neededInventory) {
      const neededQuantity = neededInventory[itemName];

      const { data: inventoryItem, error: fetchError } = await supabase
        .from("inventory")
        .select("*")
        .eq("item_name", itemName)
        .single();

      if (fetchError || !inventoryItem) {
        alert(`${itemName} not found in inventory`);
        return;
      }

      const newStock = Number(
        (Number(inventoryItem.quantity || 0) - neededQuantity).toFixed(3)
      );

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

    const salesRows = cart.map((item) => ({
      juice_name: item.juice_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      quantity_sold: item.quantity,
      selling_price: item.unit_price,
      payment_method: paymentMethod,
      sale_type: "POS",
      paid_amount: paidAmountNumber,
      change_usd: roundedChangeUSD,
      change_lbp: changeLBP,
    }));

    const { error } = await supabase.from("sales").insert(salesRows);

    if (error) {
      alert(error.message);
      return;
    }

    alert("POS sale added successfully.");

    setCart([]);
    setPaidAmount("");
    setShowPaymentPopup(false);
    fetchSales();
  };

  return (
    <ProtectedPage>
      <main style={mainStyle}>
        <div style={backgroundCircleStyle} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <section style={heroStyle}>
            <div>
              <p style={smallTitleStyle}>POINT OF SALE</p>

              <h1 style={heroTitleStyle}>
                Festival
                <br />
                POS
              </h1>

              <p style={heroTextStyle}>
                Fast direct selling for events, street festivals, and daily
                juice stands.
              </p>
            </div>

            <div style={summaryGridStyle}>
              <div style={smallInfoCardStyle}>
                <p style={smallTitleStyle}>Today Sales</p>
                <h3 style={infoValueStyle}>${todaySalesTotal.toFixed(2)}</h3>
              </div>

              <div style={smallInfoCardStyle}>
                <p style={smallTitleStyle}>Bottles Sold</p>
                <h3 style={infoValueStyle}>{todayBottlesSold}</h3>
              </div>
            </div>
          </section>

          <section style={posLayoutStyle} className="mainPOSGrid">
            <div style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <p style={smallTitleStyle}>PRODUCTS</p>
                  <h2 style={sectionTitleStyle}>Choose Juice</h2>
                </div>

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search product..."
                  style={searchInputStyle}
                />
              </div>

              <div style={filterButtonsStyle}>
                {(["All", "250 ml", "1 Liter"] as CategoryFilter[]).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setCategoryFilter(filter)}
                      style={
                        categoryFilter === filter
                          ? activeFilterButtonStyle
                          : filterButtonStyle
                      }
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>

              <div style={productsGridStyle}>
                {filteredProducts.map((productName) => (
                  <button
                    key={productName}
                    onClick={() => addToCart(productName)}
                    style={productCardStyle}
                  >
                    <div style={bottleIconStyle}>🍹</div>

                    <div style={{ textAlign: "left" }}>
                      <h3 style={productNameStyle}>{productName}</h3>
                      <p style={productPriceStyle}>
                        ${Number(productPrices[productName] || 0).toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <p style={smallTitleStyle}>CURRENT CART</p>
                  <h2 style={sectionTitleStyle}>Order</h2>
                </div>

                <div style={cartCountStyle}>{totalBottles} bottles</div>
              </div>

              {cart.length === 0 ? (
                <p style={emptyTextStyle}>No products added yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "14px" }}>
                  {cart.map((item) => (
                    <div key={item.juice_name} style={cartItemStyle}>
                      <div>
                        <h3 style={cartItemTitleStyle}>{item.juice_name}</h3>

                        <p style={smallTextStyle}>
                          Price: ${Number(item.unit_price || 0).toFixed(2)}
                        </p>

                        <p style={smallTextStyle}>
                          Total: ${(item.quantity * item.unit_price).toFixed(2)}
                        </p>
                      </div>

                      <div style={quantityControlStyle}>
                        <button
                          onClick={() => decreaseQuantity(item.juice_name)}
                          style={qtyButtonStyle}
                        >
                          -
                        </button>

                        <span style={qtyTextStyle}>{item.quantity}</span>

                        <button
                          onClick={() => increaseQuantity(item.juice_name)}
                          style={qtyButtonStyle}
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item.juice_name)}
                          style={removeButtonStyle}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}

                  <div style={totalBoxStyle}>
                    <span>Grand Total</span>
                    <strong>${cartTotal.toFixed(2)}</strong>
                  </div>

                  <div style={posActionGridStyle}>
                    <button onClick={holdCart} style={holdButtonStyle}>
                      Hold
                    </button>

                    <button onClick={cleanCart} style={clearButtonStyle}>
                      Clean
                    </button>
                  </div>

                  {heldCart.length > 0 && (
                    <button onClick={restoreHeldCart} style={restoreButtonStyle}>
                      Restore Held Order
                    </button>
                  )}

                  <button onClick={openPaymentPopup} style={confirmButtonStyle}>
                    Confirm Sale
                  </button>
                </div>
              )}
            </div>
          </section>

          <section style={{ ...cardStyle, marginTop: "30px" }}>
            <div style={sectionHeaderStyle}>
              <div>
                <p style={smallTitleStyle}>RECENT POS SALES</p>
                <h2 style={sectionTitleStyle}>Latest Sales</h2>
              </div>
            </div>

            {sales.length === 0 ? (
              <p style={emptyTextStyle}>No sales added yet.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {[
                      "Product",
                      "Quantity",
                      "Unit Price",
                      "Total",
                      "Payment",
                      "Paid",
                      "Change USD",
                      "Change LBP",
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
                      <td style={tdStyle}>
                        ${Number(sale.unit_price || 0).toFixed(2)}
                      </td>
                      <td style={tdStyle}>
                        ${Number(sale.total_price || 0).toFixed(2)}
                      </td>
                      <td style={tdStyle}>{sale.payment_method || "-"}</td>
                      <td style={tdStyle}>
                        {sale.paid_amount !== undefined && sale.paid_amount !== null
                          ? `$${Number(sale.paid_amount || 0).toFixed(2)}`
                          : "-"}
                      </td>
                      <td style={tdStyle}>
                        {sale.change_usd !== undefined && sale.change_usd !== null
                          ? `$${Number(sale.change_usd || 0).toFixed(2)}`
                          : "-"}
                      </td>
                      <td style={tdStyle}>
                        {sale.change_lbp !== undefined && sale.change_lbp !== null
                          ? `${Number(sale.change_lbp || 0).toLocaleString()} LBP`
                          : "-"}
                      </td>
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

        {showPaymentPopup && (
          <div style={popupOverlayStyle}>
            <div style={popupCardStyle}>
              <h2 style={popupTitleStyle}>Confirm Payment</h2>

              <div style={paymentSummaryStyle}>
                <span>Total Amount</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Cash">Cash</option>
                  <option value="Whish">Whish</option>
                  <option value="Card">Card</option>
                  <option value="OMT">OMT</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Paid Amount</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="Example: 20"
                  style={inputStyle}
                />
              </div>

              <div style={changeBoxStyle}>
                <p style={changeTextStyle}>
                  Change in USD:{" "}
                  <strong>${roundedChangeUSD.toFixed(2)}</strong>
                </p>

                <p style={changeTextStyle}>
                  Change in LBP:{" "}
                  <strong>{changeLBP.toLocaleString()} LBP</strong>
                </p>

                <p style={smallTextStyle}>
                  Rate used: 1 USD = 89,500 LBP
                </p>
              </div>

              {paidAmountNumber < cartTotal && (
                <p style={errorTextStyle}>
                  Paid amount is less than the total amount.
                </p>
              )}

              <div style={popupButtonsStyle}>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  style={cancelPopupButtonStyle}
                >
                  Cancel
                </button>

                <button
                  onClick={completeSale}
                  disabled={paidAmountNumber < cartTotal}
                  style={{
                    ...confirmButtonStyle,
                    opacity: paidAmountNumber < cartTotal ? 0.5 : 1,
                    cursor:
                      paidAmountNumber < cartTotal ? "not-allowed" : "pointer",
                  }}
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
            @media (max-width: 1100px) {
              .mainPOSGrid {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 850px) {
              main {
                padding: 20px !important;
              }

              section {
                padding: 24px !important;
                border-radius: 28px !important;
              }

              h1 {
                font-size: 46px !important;
              }

              h2 {
                font-size: 30px !important;
              }

              table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
              }

              input,
              select,
              button {
                box-sizing: border-box;
              }
            }

            @media (max-width: 550px) {
              h1 {
                font-size: 38px !important;
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
  padding: "55px",
  marginBottom: "30px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.7)",
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const heroTitleStyle = {
  margin: "18px 0 0",
  color: "#2e4732",
  fontSize: "72px",
  lineHeight: "1",
  fontWeight: "bold",
};

const heroTextStyle = {
  marginTop: "22px",
  fontSize: "21px",
  color: "#435848",
  lineHeight: "1.8",
  maxWidth: "620px",
  fontFamily: "Arial, sans-serif",
};

const smallTitleStyle = {
  margin: 0,
  color: "#7aa85a",
  fontWeight: "bold",
  letterSpacing: "2px",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const smallInfoCardStyle = {
  background: "rgba(255,255,255,0.8)",
  padding: "22px",
  borderRadius: "24px",
  minWidth: "180px",
  boxShadow: "0 14px 28px rgba(0,0,0,0.06)",
};

const infoValueStyle = {
  margin: "10px 0 0",
  color: "#2e4732",
  fontSize: "30px",
  fontFamily: "Arial, sans-serif",
};

const posLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "1.35fr 0.9fr",
  gap: "24px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(14px)",
  padding: "34px",
  borderRadius: "34px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "center",
  flexWrap: "wrap" as const,
  marginBottom: "22px",
};

const sectionTitleStyle = {
  margin: "8px 0 0",
  color: "#2e4732",
  fontSize: "38px",
};

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

const searchInputStyle = {
  ...inputStyle,
  maxWidth: "260px",
  marginTop: 0,
};

const filterButtonsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
  marginBottom: "24px",
};

const filterButtonStyle = {
  padding: "11px 18px",
  borderRadius: "999px",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const activeFilterButtonStyle = {
  ...filterButtonStyle,
  background: "#304638",
  color: "white",
};

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "16px",
};

const productCardStyle = {
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(48,70,56,0.1)",
  borderRadius: "24px",
  padding: "18px",
  cursor: "pointer",
  display: "flex",
  gap: "14px",
  alignItems: "center",
  boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
};

const bottleIconStyle = {
  width: "54px",
  height: "54px",
  borderRadius: "18px",
  background: "#eef0df",
  display: "grid",
  placeItems: "center",
  fontSize: "28px",
};

const productNameStyle = {
  margin: 0,
  color: "#2e4732",
  fontSize: "17px",
  fontFamily: "Arial, sans-serif",
};

const productPriceStyle = {
  margin: "8px 0 0",
  color: "#7aa85a",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const cartCountStyle = {
  background: "#eef0df",
  color: "#2e4732",
  padding: "10px 16px",
  borderRadius: "999px",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const emptyTextStyle = {
  color: "#435848",
  fontFamily: "Arial, sans-serif",
  fontSize: "17px",
};

const cartItemStyle = {
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(48,70,56,0.1)",
  borderRadius: "22px",
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
};

const cartItemTitleStyle = {
  margin: 0,
  color: "#2e4732",
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
};

const smallTextStyle = {
  margin: "8px 0 0",
  color: "#435848",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
};

const quantityControlStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const qtyButtonStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
};

const qtyTextStyle = {
  minWidth: "20px",
  textAlign: "center" as const,
  color: "#2e4732",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const removeButtonStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "none",
  background: "#ffe6e0",
  color: "#a33",
  cursor: "pointer",
  fontWeight: 900,
};

const totalBoxStyle = {
  background: "#eef0df",
  color: "#2e4732",
  padding: "18px",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 900,
  fontSize: "20px",
  fontFamily: "Arial, sans-serif",
};

const posActionGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const holdButtonStyle = {
  padding: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#d9c88f",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
};

const restoreButtonStyle = {
  padding: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
};

const confirmButtonStyle = {
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

const clearButtonStyle = {
  padding: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
};

const popupOverlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: "20px",
};

const popupCardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "#f6f3e8",
  borderRadius: "34px",
  padding: "34px",
  boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const popupTitleStyle = {
  marginTop: 0,
  color: "#2e4732",
  fontSize: "38px",
};

const paymentSummaryStyle = {
  background: "#eef0df",
  padding: "18px",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "space-between",
  color: "#2e4732",
  fontWeight: 900,
  fontSize: "20px",
  fontFamily: "Arial, sans-serif",
  marginBottom: "18px",
};

const changeBoxStyle = {
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(48,70,56,0.1)",
  borderRadius: "22px",
  padding: "18px",
  marginBottom: "18px",
};

const changeTextStyle = {
  margin: "0 0 10px",
  color: "#2e4732",
  fontSize: "18px",
  fontFamily: "Arial, sans-serif",
};

const errorTextStyle = {
  color: "#a33",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const popupButtonsStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const cancelPopupButtonStyle = {
  padding: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#eef0df",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
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
};