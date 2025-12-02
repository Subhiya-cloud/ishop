import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, type Product } from "../api";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#050816",
    color: "white",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  } as const,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  } as const,
  logoutButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#6c0f0fff",
    color: "white",
    cursor: "pointer",
  } as const,
  filtersWrapper: {
    marginBottom: "24px",
    padding: "16px",
    borderRadius: "10px",
    background: "#020617",
    border: "1px solid #1f2933",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  } as const,
  filterBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  } as const,
  label: {
    fontSize: "14px",
    color: "#e5e7eb",
  } as const,
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
    outline: "none",
  } as const,
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
    outline: "none",
  } as const,
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  } as const,
  card: {
    background: "#020617",
    borderRadius: "10px",
    padding: "14px",
    border: "1px solid #1f2933",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  } as const,
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover" as const,
    borderRadius: "8px",
    marginBottom: "6px",
  },
  productName: {
    fontSize: "16px",
    fontWeight: 600,
    margin: 0,
  } as const,
  productCategory: {
    fontSize: "12px",
    color: "#9ca3af",
  } as const,
  productDescription: {
    fontSize: "14px",
    color: "#d1d5db",
    margin: 0,
  } as const,
  productPrice: {
    marginTop: "auto",
    fontWeight: 700,
    fontSize: "16px",
  } as const,
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить список товаров");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [navigate]);

  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category)
        .filter((c): c is string => Boolean(c))
    )
  );

  const filteredProducts = products.filter((p) => {
    if (
      nameFilter &&
      !p.name.toLowerCase().includes(nameFilter.toLowerCase())
    ) {
      return false;
    }

    if (categoryFilter !== "all" && p.category !== categoryFilter) {
      return false;
    }

    const price = p.price;
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;

    return true;
  });

  if (loading) {
    return <div style={styles.page}>Загрузка товаров...</div>;
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p>{error}</p>
        <button onClick={() => navigate(0)}>Повторить попытку</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Каталог товаров</h1>
        <button
          style={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Выйти
        </button>
      </header>

      <div style={styles.filtersWrapper}>
        <div style={styles.filterBlock}>
          <span style={styles.label}>Название</span>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Поиск по названию"
            style={styles.input}
          />
        </div>

        <div style={styles.filterBlock}>
          <span style={styles.label}>Категория</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">Все категории</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterBlock}>
          <span style={styles.label}>Цена от</span>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.filterBlock}>
          <span style={styles.label}>Цена до</span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p>Товары не найдены.</p>
      ) : (
        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <article key={product.id} style={styles.card}>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={styles.image}
                />
              )}

              <h2 style={styles.productName}>{product.name}</h2>

              {product.category && (
                <div style={styles.productCategory}>{product.category}</div>
              )}

              <p style={styles.productDescription}>{product.description}</p>

              <div style={styles.productPrice}>
                {product.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
