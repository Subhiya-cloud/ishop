import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
     <BrowserRouter>
    <div className="min-h-screen bg-slate-900 text-white">

      <header className="bg-slate-800 p-4 flex justify-between items-center">

        <div className="text-xl font bold">
          iShop
        </div>

        <nav className="flex gap-4">
          <Link to="/products" className="hover:underline">
          Каталог
          </Link>

          <Link to="/login" className="hover:underline">
          Вход
          </Link>

        </nav>
      </header>

      <main className="p-4">

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<ProductsPage />} />
          </Routes>
      </main>
    </div>
     </BrowserRouter>

  );
}

export default App;
