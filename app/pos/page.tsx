"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedPage from "../components/ProtectedPage";

const USD_TO_LBP_RATE = 90000;

type ProductCategory = "Juices" | "Cocktails";

const formatLBPInput = (value: string) => {
  const onlyNumbers = value.replace(/[^\d]/g, "");

  if (!onlyNumbers) return "";

  return Number(onlyNumbers).toLocaleString();
};

const parseLBPInput = (value: string) => {
  return Number(value.replace(/,/g, "")) || 0;
};

const formatLBP = (value: number) => {
  return `${Number(value || 0).toLocaleString()} LBP`;
};

const normalizeCategory = (category?: string): ProductCategory => {
  return category === "Cocktails" ? "Cocktails" : "Juices";
};

type CartItem = {
  juice_name: string;
  product_category: ProductCategory;
  quantity: number;
  unit_price: number;
};

type POSSale = {
  id?: number;
  juice_name: string;
  product_category?: ProductCategory | string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method?: string;
  paid_amount?: number;
  change_usd?: number;
  change_lbp?: number;
  transaction_type?: "SALE" | "REFUND";
  refunded_sale_id?: number | null;
  created_at?: string;
};

type POSProduct = {
  id: number;
  name: string;
  category?: ProductCategory | string;
  size: string;
  price: number;
  created_at?: string;
};

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldCart, setHeldCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<POSSale[]>([]);
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [productPriceEdits, setProductPriceEdits] = useState<
    Record<number, string>
  >({});
  const [productCategoryEdits, setProductCategoryEdits] = useState<
    Record<number, ProductCategory>
  >({});

  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>("Juices");
  const [searchText, setSearchText] = useState("");

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [showEditProductsPopup, setShowEditProductsPopup] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] =
    useState<ProductCategory>("Juices");
  const [newProductSize, setNewProductSize] = useState("330 ml");
  const [newProductPrice, setNewProductPrice] = useState("");

  const formatProductName = (product: POSProduct) => {
    return `${product.name} - ${product.size}`;
  };

  const filteredProducts = products.filter((product) => {
    const fullName = formatProductName(product);
    const productCategory = normalizeCategory(product.category);

    const matchesCategory = productCategory === activeCategory;

    const matchesSearch = fullName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cartTotalLBP = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  }, [cart]);

  const cartTotalUSD = cartTotalLBP / USD_TO_LBP_RATE;

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const paidAmountNumber = parseLBPInput(paidAmount);

  const changeLBP =
    paidAmountNumber > cartTotalLBP ? paidAmountNumber - cartTotalLBP : 0;

  const remainingLBP =
    paidAmountNumber < cartTotalLBP ? cartTotalLBP - paidAmountNumber : 0;

  const changeUSD = changeLBP / USD_TO_LBP_RATE;
  const remainingUSD = remainingLBP / USD_TO_LBP_RATE;

  const todaySalesTotal = useMemo(() => {
    const today = new Date().toDateString();

    return sales
      .filter((sale) => {
        if (!sale.created_at) return false;
        return new Date(sale.created_at).toDateString() === today;
      })
      .reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);
  }, [sales]);

  const todayItemsSold = useMemo(() => {
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
      .from("pos_sales")
      .select("*")
      .order("id", { ascending: false })
      .limit(20);

    if (error) {
      alert(error.message);
      return;
    }

    setSales(data || []);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("pos_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const productData = (data || []) as POSProduct[];
    setProducts(productData);

    const priceMap: Record<number, string> = {};
    const categoryMap: Record<number, ProductCategory> = {};

    productData.forEach((product) => {
      priceMap[product.id] = formatLBPInput(String(Number(product.price || 0)));
      categoryMap[product.id] = normalizeCategory(product.category);
    });

    setProductPriceEdits(priceMap);
    setProductCategoryEdits(categoryMap);
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const addToCart = (product: POSProduct) => {
    const productName = formatProductName(product);
    const productCategory = normalizeCategory(product.category);
    const price = Number(product.price || 0);

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) =>
          item.juice_name === productName &&
          item.product_category === productCategory
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.juice_name === productName &&
          item.product_category === productCategory
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          juice_name: productName,
          product_category: productCategory,
          quantity: 1,
          unit_price: price,
        },
      ];
    });
  };

  const increaseQuantity = (
    productName: string,
    productCategory: ProductCategory
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.juice_name === productName &&
        item.product_category === productCategory
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (
    productName: string,
    productCategory: ProductCategory
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.juice_name === productName &&
          item.product_category === productCategory
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (
    productName: string,
    productCategory: ProductCategory
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.juice_name === productName &&
            item.product_category === productCategory
          )
      )
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

  const recallCart = () => {
    if (heldCart.length === 0) {
      alert("No held order.");
      return;
    }

    setCart(heldCart);
    setHeldCart([]);
  };

  const handleAddProduct = async () => {
    const trimmedName = newProductName.trim();
    const priceNumber = parseLBPInput(newProductPrice);

    if (!trimmedName) {
      alert("Please enter the product name.");
      return;
    }

    if (!newProductCategory) {
      alert("Please select the product category.");
      return;
    }

    if (!newProductSize) {
      alert("Please select the size.");
      return;
    }

    if (priceNumber <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const { error } = await supabase.from("pos_products").insert([
      {
        name: trimmedName,
        category: newProductCategory,
        size: newProductSize,
        price: priceNumber,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNewProductName("");
    setNewProductCategory("Juices");
    setNewProductSize("330 ml");
    setNewProductPrice("");
    setShowAddProductPopup(false);

    fetchProducts();
  };

  const updateProduct = async (product: POSProduct) => {
    const newPrice = parseLBPInput(productPriceEdits[product.id] || "");
    const newCategory =
      productCategoryEdits[product.id] || normalizeCategory(product.category);

    if (newPrice <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const oldProductName = formatProductName(product);
    const oldCategory = normalizeCategory(product.category);

    const { error } = await supabase
      .from("pos_products")
      .update({
        price: newPrice,
        category: newCategory,
      })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.juice_name === oldProductName &&
        item.product_category === oldCategory
          ? {
              ...item,
              unit_price: newPrice,
              product_category: newCategory,
            }
          : item
      )
    );

    setHeldCart((currentHeldCart) =>
      currentHeldCart.map((item) =>
        item.juice_name === oldProductName &&
        item.product_category === oldCategory
          ? {
              ...item,
              unit_price: newPrice,
              product_category: newCategory,
            }
          : item
      )
    );

    alert("Product updated successfully.");
    fetchProducts();
  };

  const deleteProduct = async (product: POSProduct) => {
    const productName = formatProductName(product);
    const productCategory = normalizeCategory(product.category);

    const confirmDelete = confirm(`Delete ${productName} from POS?`);

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("pos_products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.juice_name === productName &&
            item.product_category === productCategory
          )
      )
    );

    setHeldCart((currentHeldCart) =>
      currentHeldCart.filter(
        (item) =>
          !(
            item.juice_name === productName &&
            item.product_category === productCategory
          )
      )
    );

    fetchProducts();
  };

  const openPaymentPopup = () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    setPaidAmount(Math.round(cartTotalLBP).toLocaleString());
    setShowPaymentPopup(true);
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    if (paidAmountNumber < cartTotalLBP) {
      alert("Paid amount is less than the total amount.");
      return;
    }

    const salesRows = cart.map((item) => ({
      juice_name: item.juice_name,
      product_category: item.product_category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      payment_method: paymentMethod,
      paid_amount: paidAmountNumber,
      change_usd: changeUSD,
      change_lbp: changeLBP,
      transaction_type: "SALE" as const,
    }));

    const { error } = await supabase.from("pos_sales").insert(salesRows);

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

  const refundSale = async (sale: POSSale) => {
    if (sale.transaction_type === "REFUND") {
      alert("This row is already a refund.");
      return;
    }

    const alreadyRefunded = sales.some(
      (item) =>
        item.transaction_type === "REFUND" &&
        Number(item.refunded_sale_id) === Number(sale.id)
    );

    if (alreadyRefunded) {
      alert("This sale was already refunded.");
      return;
    }

    const confirmRefund = confirm(
      `Refund ${sale.juice_name} for ${formatLBP(
        Math.abs(Number(sale.total_price || 0))
      )}?`
    );

    if (!confirmRefund) {
      return;
    }

    const { error } = await supabase.from("pos_sales").insert([
      {
        juice_name: sale.juice_name,
        product_category: normalizeCategory(sale.product_category),
        quantity: -Math.abs(Number(sale.quantity || 0)),
        unit_price: Number(sale.unit_price || 0),
        total_price: -Math.abs(Number(sale.total_price || 0)),
        payment_method: sale.payment_method || "Cash",
        paid_amount: 0,
        change_usd: 0,
        change_lbp: 0,
        transaction_type: "REFUND" as const,
        refunded_sale_id: sale.id,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Refund added successfully.");
    fetchSales();
  };

  const exportFestivalReport = async () => {
    const { data, error } = await supabase
      .from("pos_sales")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const allSales: POSSale[] = data || [];

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      alert("Popup blocked. Please allow popups to export the report.");
      return;
    }

    const totalSalesAmount = allSales
      .filter((sale) => sale.transaction_type !== "REFUND")
      .reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);

    const totalRefunds = allSales
      .filter((sale) => sale.transaction_type === "REFUND")
      .reduce((sum, sale) => sum + Math.abs(Number(sale.total_price || 0)), 0);

    const netTotal = totalSalesAmount - totalRefunds;

    const totalItemsSold = allSales.reduce(
      (sum, sale) => sum + Number(sale.quantity || 0),
      0
    );

    const juiceItemsSold = allSales
      .filter((sale) => normalizeCategory(sale.product_category) === "Juices")
      .reduce((sum, sale) => sum + Number(sale.quantity || 0), 0);

    const cocktailItemsSold = allSales
      .filter(
        (sale) => normalizeCategory(sale.product_category) === "Cocktails"
      )
      .reduce((sum, sale) => sum + Number(sale.quantity || 0), 0);

    const rows = allSales
      .map(
        (sale) => `
          <tr>
            <td>${sale.transaction_type || "SALE"}</td>
            <td>${normalizeCategory(sale.product_category)}</td>
            <td>${sale.juice_name}</td>
            <td>${sale.quantity}</td>
            <td>${formatLBP(Number(sale.unit_price || 0))}</td>
            <td>${formatLBP(Number(sale.total_price || 0))}</td>
            <td>${sale.payment_method || "-"}</td>
            <td>${
              sale.created_at ? new Date(sale.created_at).toLocaleString() : ""
            }</td>
          </tr>
        `
      )
      .join("");

    reportWindow.document.write(`
      <html>
        <head>
          <title>POS Festival Report</title>
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
              grid-template-columns: repeat(4, 1fr);
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
            }

            th, td {
              border-bottom: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }

            th {
              background: #eef0df;
            }
          </style>
        </head>

        <body>
          <h1>SPLASH Juice POS Festival Report</h1>

          <div class="summary">
            <div class="box"><strong>Total Sales</strong><br/>${formatLBP(
              totalSalesAmount
            )}</div>
            <div class="box"><strong>Total Refunds</strong><br/>${formatLBP(
              totalRefunds
            )}</div>
            <div class="box"><strong>Net Total</strong><br/>${formatLBP(
              netTotal
            )}</div>
            <div class="box"><strong>Items Sold</strong><br/>${totalItemsSold}</div>
            <div class="box"><strong>Juice Items</strong><br/>${juiceItemsSold}</div>
            <div class="box"><strong>Cocktail Items</strong><br/>${cocktailItemsSold}</div>
          </div>

          <h2>Transactions</h2>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
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

            <div style={summaryGridStyle} className="summaryGridMobile">
              <div style={smallInfoCardStyle}>
                <p style={smallTitleStyle}>Today Sales</p>
                <h3 style={infoValueStyle}>{formatLBP(todaySalesTotal)}</h3>
              </div>

              <div style={smallInfoCardStyle}>
                <p style={smallTitleStyle}>Items Sold</p>
                <h3 style={infoValueStyle}>{todayItemsSold}</h3>
              </div>
            </div>
          </section>

          <section style={posLayoutStyle} className="mainPOSGrid">
            <div style={cardStyle}>
              <div style={productsHeaderBlockStyle}>
                <div>
                  <p style={smallTitleStyle}>PRODUCTS</p>
                  <h2 style={sectionTitleStyle}>Choose Product</h2>
                </div>

                <div
                  style={productHeaderActionsStyle}
                  className="productHeaderActionsMobile"
                >
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search product..."
                    style={searchInputStyle}
                    className="searchMobile"
                  />

                  <button
                    onClick={() => setShowAddProductPopup(true)}
                    style={addProductButtonStyle}
                  >
                    Add Product
                  </button>

                  <button
                    onClick={() => setShowEditProductsPopup(true)}
                    style={editProductsButtonStyle}
                  >
                    Edit
                  </button>
                </div>

                <div style={filterButtonsStyle}>
                  {(["Juices", "Cocktails"] as ProductCategory[]).map(
                    (category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        style={
                          activeCategory === category
                            ? activeFilterButtonStyle
                            : filterButtonStyle
                        }
                      >
                        {category}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div style={productsGridStyle} className="productsGridMobile">
                {filteredProducts.length === 0 ? (
                  <p style={emptyTextStyle}>
                    No {activeCategory.toLowerCase()} yet. Press Add Product to
                    create your festival menu.
                  </p>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      style={productCardStyle}
                      className="productCardMobile"
                    >
                      <div style={bottleIconStyle} className="bottleIconMobile">
                        {normalizeCategory(product.category) === "Cocktails"
                          ? "🍸"
                          : "🍹"}
                      </div>

                      <div style={{ textAlign: "left" }}>
                        <p style={productCategoryTextStyle}>
                          {normalizeCategory(product.category)}
                        </p>

                        <h3 style={productNameStyle}>
                          {formatProductName(product)}
                        </h3>

                        <p style={productPriceStyle}>
                          {formatLBP(Number(product.price || 0))}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <p style={smallTitleStyle}>CURRENT CART</p>
                  <h2 style={sectionTitleStyle}>Order</h2>
                </div>

                <div style={cartCountStyle}>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </div>
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                {cart.length === 0 ? (
                  <p style={emptyTextStyle}>No products added yet.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.product_category}-${item.juice_name}`}
                      style={cartItemStyle}
                      className="cartItemMobile"
                    >
                      <div>
                        <p style={productCategoryTextStyle}>
                          {item.product_category}
                        </p>

                        <h3 style={cartItemTitleStyle}>{item.juice_name}</h3>

                        <p style={smallTextStyle}>
                          Price: {formatLBP(Number(item.unit_price || 0))}
                        </p>

                        <p style={smallTextStyle}>
                          Total:{" "}
                          {formatLBP(
                            Number(item.quantity || 0) *
                              Number(item.unit_price || 0)
                          )}
                        </p>
                      </div>

                      <div
                        style={quantityControlStyle}
                        className="quantityMobile"
                      >
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.juice_name,
                              item.product_category
                            )
                          }
                          style={qtyButtonStyle}
                        >
                          -
                        </button>

                        <span style={qtyTextStyle}>{item.quantity}</span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.juice_name,
                              item.product_category
                            )
                          }
                          style={qtyButtonStyle}
                        >
                          +
                        </button>

                        <button
                          onClick={() =>
                            removeFromCart(
                              item.juice_name,
                              item.product_category
                            )
                          }
                          style={removeButtonStyle}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <div style={totalBoxStyle}>
                  <span>Grand Total</span>
                  <strong>{formatLBP(cartTotalLBP)}</strong>
                </div>

                <div style={posActionGridStyle} className="posActionsMobile">
                  <button onClick={holdCart} style={holdButtonStyle}>
                    Hold
                  </button>

                  <button onClick={recallCart} style={recallButtonStyle}>
                    Recall
                  </button>

                  <button onClick={cleanCart} style={clearButtonStyle}>
                    Clean
                  </button>
                </div>

                {heldCart.length > 0 && (
                  <p style={heldOrderTextStyle}>You have 1 order on hold.</p>
                )}

                <button onClick={openPaymentPopup} style={confirmButtonStyle}>
                  Confirm Sale
                </button>
              </div>
            </div>
          </section>

          <section
            className="latestSalesSection"
            style={{ ...cardStyle, marginTop: "30px" }}
          >
            <div style={sectionHeaderStyle}>
              <div>
                <p style={smallTitleStyle}>RECENT POS SALES</p>
                <h2 style={sectionTitleStyle}>Latest Sales</h2>
              </div>

              <button onClick={exportFestivalReport} style={exportButtonStyle}>
                Export Report
              </button>
            </div>

            {sales.length === 0 ? (
              <p style={emptyTextStyle}>No sales added yet.</p>
            ) : (
              <div className="latestSalesTableWrap" style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {[
                        "Type",
                        "Action",
                        "Category",
                        "Product",
                        "Quantity",
                        "Unit Price",
                        "Total",
                        "Payment",
                        "Paid",
                        "Change USD",
                        "Date & Time",
                      ].map((head) => (
                        <th key={head} style={thStyle}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {sales.map((sale) => {
                      const alreadyRefunded = sales.some(
                        (item) =>
                          item.transaction_type === "REFUND" &&
                          Number(item.refunded_sale_id) === Number(sale.id)
                      );

                      return (
                        <tr key={sale.id}>
                          <td style={tdStyle}>
                            {sale.transaction_type || "SALE"}
                          </td>

                          <td style={actionTdStyle}>
                            {sale.transaction_type === "REFUND" ? (
                              <span style={refundLabelStyle}>Refund Row</span>
                            ) : alreadyRefunded ? (
                              <span style={refundLabelStyle}>Refunded</span>
                            ) : (
                              <button
                                onClick={() => refundSale(sale)}
                                style={refundButtonStyle}
                              >
                                Refund
                              </button>
                            )}
                          </td>

                          <td style={tdStyle}>
                            {normalizeCategory(sale.product_category)}
                          </td>

                          <td style={tdStyle}>{sale.juice_name}</td>

                          <td style={tdStyle}>{sale.quantity}</td>

                          <td style={tdStyle}>
                            {formatLBP(Number(sale.unit_price || 0))}
                          </td>

                          <td style={tdStyle}>
                            {formatLBP(Number(sale.total_price || 0))}
                          </td>

                          <td style={tdStyle}>{sale.payment_method || "-"}</td>

                          <td style={tdStyle}>
                            {sale.paid_amount !== undefined &&
                            sale.paid_amount !== null
                              ? formatLBP(Number(sale.paid_amount || 0))
                              : "-"}
                          </td>

                          <td style={tdStyle}>
                            {sale.change_usd !== undefined &&
                            sale.change_usd !== null
                              ? `$${Number(sale.change_usd || 0).toFixed(2)}`
                              : "-"}
                          </td>

                          <td style={tdStyle}>
                            {sale.created_at
                              ? new Date(sale.created_at).toLocaleString()
                              : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {showAddProductPopup && (
          <div style={popupOverlayStyle}>
            <div style={popupCardStyle}>
              <h2 style={popupTitleStyle}>Add Product</h2>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Example: Orange"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) =>
                    setNewProductCategory(e.target.value as ProductCategory)
                  }
                  style={inputStyle}
                >
                  <option value="Juices">Juices</option>
                  <option value="Cocktails">Cocktails</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Size</label>
                <select
                  value={newProductSize}
                  onChange={(e) => setNewProductSize(e.target.value)}
                  style={inputStyle}
                >
                  <option value="250 ml">250 ml</option>
                  <option value="330 ml">330 ml</option>
                  <option value="1 Liter">1 Liter</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Price in LBP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={newProductPrice}
                  onChange={(e) =>
                    setNewProductPrice(formatLBPInput(e.target.value))
                  }
                  placeholder="Example: 250,000"
                  style={inputStyle}
                />
              </div>

              <div style={popupButtonsStyle}>
                <button
                  onClick={() => setShowAddProductPopup(false)}
                  style={cancelPopupButtonStyle}
                >
                  Cancel
                </button>

                <button onClick={handleAddProduct} style={confirmButtonStyle}>
                  Save Product
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditProductsPopup && (
          <div style={popupOverlayStyle}>
            <div style={popupCardStyle}>
              <h2 style={popupTitleStyle}>Edit Products</h2>

              {products.length === 0 ? (
                <p style={emptyTextStyle}>No products to edit yet.</p>
              ) : (
                <div style={editProductsListStyle}>
                  {products.map((product) => (
                    <div key={product.id} style={editProductRowStyle}>
                      <div style={{ flex: 1 }}>
                        <strong>{formatProductName(product)}</strong>

                        <label style={editPriceLabelStyle}>Category</label>
                        <select
                          value={
                            productCategoryEdits[product.id] ||
                            normalizeCategory(product.category)
                          }
                          onChange={(e) =>
                            setProductCategoryEdits((current) => ({
                              ...current,
                              [product.id]: e.target.value as ProductCategory,
                            }))
                          }
                          style={editSelectStyle}
                        >
                          <option value="Juices">Juices</option>
                          <option value="Cocktails">Cocktails</option>
                        </select>

                        <label style={editPriceLabelStyle}>Price in LBP</label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={productPriceEdits[product.id] || ""}
                          onChange={(e) =>
                            setProductPriceEdits((current) => ({
                              ...current,
                              [product.id]: formatLBPInput(e.target.value),
                            }))
                          }
                          style={editPriceInputStyle}
                        />
                      </div>

                      <div style={editProductActionsStyle}>
                        <button
                          onClick={() => updateProduct(product)}
                          style={savePriceButtonStyle}
                        >
                          Save
                        </button>

                        <button
                          onClick={() => deleteProduct(product)}
                          style={deleteProductButtonStyle}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={() => setShowEditProductsPopup(false)}
                  style={confirmButtonStyle}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {showPaymentPopup && (
          <div style={popupOverlayStyle}>
            <div style={popupCardStyle}>
              <h2 style={popupTitleStyle}>Confirm Payment</h2>

              <div style={paymentSummaryStyle}>
                <div>
                  <span>Total Amount</span>
                  <p style={smallTextStyle}>
                    Around ${cartTotalUSD.toFixed(2)}
                  </p>
                </div>

                <strong>{formatLBP(cartTotalLBP)}</strong>
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
                <label style={labelStyle}>Paid Amount in LBP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(formatLBPInput(e.target.value))}
                  placeholder="Example: 1,050,000"
                  style={inputStyle}
                />
              </div>

              <div style={changeBoxStyle}>
                {paidAmountNumber >= cartTotalLBP ? (
                  <>
                    <p style={changeTextStyle}>
                      Change in LBP: <strong>{formatLBP(changeLBP)}</strong>
                    </p>

                    <p style={changeTextStyle}>
                      Change in USD: <strong>${changeUSD.toFixed(2)}</strong>
                    </p>
                  </>
                ) : (
                  <>
                    <p style={errorTextStyle}>
                      Remaining in LBP:{" "}
                      <strong>{formatLBP(remainingLBP)}</strong>
                    </p>

                    <p style={errorTextStyle}>
                      Remaining in USD:{" "}
                      <strong>${remainingUSD.toFixed(2)}</strong>
                    </p>
                  </>
                )}

                <p style={smallTextStyle}>Rate used: 1 USD = 90,000 LBP</p>
              </div>

              <div style={popupButtonsStyle}>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  style={cancelPopupButtonStyle}
                >
                  Cancel
                </button>

                <button
                  onClick={completeSale}
                  disabled={paidAmountNumber < cartTotalLBP}
                  style={{
                    ...confirmButtonStyle,
                    opacity: paidAmountNumber < cartTotalLBP ? 0.5 : 1,
                    cursor:
                      paidAmountNumber < cartTotalLBP
                        ? "not-allowed"
                        : "pointer",
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
                padding: 14px !important;
              }

              section {
                padding: 20px !important;
                border-radius: 24px !important;
              }

              h1 {
                font-size: 42px !important;
              }

              h2 {
                font-size: 28px !important;
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

            @media (max-width: 600px) {
              main {
                padding: 10px !important;
              }

              section {
                padding: 16px !important;
                border-radius: 22px !important;
              }

              h1 {
                font-size: 34px !important;
                line-height: 1.05 !important;
              }

              h2 {
                font-size: 26px !important;
              }

              .mainPOSGrid {
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }

              .productsGridMobile {
                grid-template-columns: 1fr 1fr !important;
                gap: 10px !important;
              }

              .productCardMobile {
                padding: 12px !important;
                border-radius: 18px !important;
                gap: 8px !important;
                flex-direction: column !important;
                align-items: flex-start !important;
              }

              .productCardMobile h3 {
                font-size: 13px !important;
                line-height: 1.25 !important;
              }

              .productCardMobile p {
                font-size: 13px !important;
              }

              .bottleIconMobile {
                width: 42px !important;
                height: 42px !important;
                font-size: 22px !important;
              }

              .cartItemMobile {
                flex-direction: column !important;
                align-items: flex-start !important;
              }

              .quantityMobile {
                width: 100% !important;
                justify-content: space-between !important;
                margin-top: 10px !important;
              }

              .posActionsMobile {
                grid-template-columns: 1fr !important;
              }

              .summaryGridMobile {
                grid-template-columns: 1fr !important;
                width: 100% !important;
              }

              .searchMobile {
                max-width: 100% !important;
                width: 100% !important;
              }

              .productHeaderActionsMobile {
                width: 100% !important;
              }
            }

            @media (max-width: 420px) {
              h1 {
                font-size: 30px !important;
              }

              .productsGridMobile {
                grid-template-columns: 1fr !important;
              }
            }

            .latestSalesTableWrap {
              margin-left: -18px;
              width: calc(100% + 36px);
            }

            @media (max-width: 850px) {
              .latestSalesTableWrap {
                margin-left: -20px !important;
                width: calc(100% + 40px) !important;
              }

              .latestSalesTableWrap table {
                font-size: 13px !important;
              }

              .latestSalesTableWrap th,
              .latestSalesTableWrap td {
                padding: 10px !important;
              }
            }

            @media (max-width: 600px) {
              .latestSalesTableWrap {
                margin-left: -16px !important;
                width: calc(100% + 32px) !important;
              }

              .latestSalesTableWrap table {
                font-size: 12px !important;
              }

              .latestSalesTableWrap th,
              .latestSalesTableWrap td {
                padding: 8px !important;
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

const productsHeaderBlockStyle = {
  display: "grid",
  gap: "18px",
  marginBottom: "24px",
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

const productHeaderActionsStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const addProductButtonStyle = {
  padding: "15px 20px",
  borderRadius: "999px",
  border: "none",
  background: "#304638",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap" as const,
};

const editProductsButtonStyle = {
  padding: "15px 20px",
  borderRadius: "999px",
  border: "none",
  background: "#dfe8cf",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap" as const,
};

const exportButtonStyle = {
  padding: "15px 18px",
  borderRadius: "999px",
  border: "none",
  background: "#7aa85a",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap" as const,
};

const filterButtonsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
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

const productCategoryTextStyle = {
  margin: "0 0 6px",
  color: "#7aa85a",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  fontFamily: "Arial, sans-serif",
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
  gridTemplateColumns: "1fr 1fr 1fr",
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

const recallButtonStyle = {
  padding: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#dfe8cf",
  color: "#2e4732",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
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

const heldOrderTextStyle = {
  margin: 0,
  color: "#7aa85a",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
  textAlign: "center" as const,
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

const popupOverlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999999,
  padding: "20px",
  overflowY: "auto" as const,
};

const popupCardStyle = {
  width: "100%",
  maxWidth: "580px",
  maxHeight: "90vh",
  overflowY: "auto" as const,
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
  gap: "14px",
  alignItems: "center",
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

const editProductsListStyle = {
  display: "grid",
  gap: "12px",
  maxHeight: "360px",
  overflowY: "auto" as const,
  paddingRight: "4px",
};

const editProductRowStyle = {
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(48,70,56,0.1)",
  borderRadius: "18px",
  padding: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  fontFamily: "Arial, sans-serif",
  color: "#2e4732",
};

const editProductActionsStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const editPriceLabelStyle = {
  display: "block",
  marginTop: "10px",
  marginBottom: "6px",
  color: "#435848",
  fontSize: "13px",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const editPriceInputStyle = {
  width: "140px",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #d6d6d6",
  outline: "none",
  background: "rgba(255,255,255,0.9)",
  fontFamily: "Arial, sans-serif",
};

const editSelectStyle = {
  width: "160px",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #d6d6d6",
  outline: "none",
  background: "rgba(255,255,255,0.9)",
  fontFamily: "Arial, sans-serif",
};

const savePriceButtonStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "none",
  background: "#304638",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const deleteProductButtonStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "none",
  background: "#ffe6e0",
  color: "#a33",
  cursor: "pointer",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
};

const refundButtonStyle = {
  padding: "9px 16px",
  borderRadius: "999px",
  border: "none",
  background: "#ffe6e0",
  color: "#a33",
  cursor: "pointer",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap" as const,
};

const refundLabelStyle = {
  background: "#eef0df",
  color: "#2e4732",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap" as const,
  display: "inline-block",
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

const actionTdStyle = {
  ...tdStyle,
  whiteSpace: "nowrap" as const,
};

const tableWrapperStyle = {
  width: "100%",
  overflowX: "auto" as const,
};