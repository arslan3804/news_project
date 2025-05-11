import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ArticleList from './components/articles/ArticleList';
import ArticleDetail from './components/articles/ArticleDetail';
import ArticlesByCategory from './components/articles/ArticlesByCategory';
import AddArticle from './components/forms/AddArticle';
import AddCategory from './components/forms/AddCategory';
import AddNewsSource from './components/forms/AddNewsSource';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/articles/category/:category_slug" element={<ArticlesByCategory />} />
          <Route path="/add_article" element={<AddArticle />} />
          <Route path="/add_category" element={<AddCategory />} />
          <Route path="/add_source" element={<AddNewsSource />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}