import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Blogs from "./pages/blogs/Blogs";
import SubmitBlog from "./pages/submitBlog/SubmitBlog";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CryptoPrice from "./pages/cryptoPrices/CryptoPrice";
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/crypto" exact element={<CryptoPrice />} />
          <Route path="/blogs/all" exact element={<Blogs />} />
          <Route path="/blog/submit" exact element={<SubmitBlog />} />
          <Route path="/auth/login" exact element={<Login />} />
          <Route path="/auth/register" exact element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
