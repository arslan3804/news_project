import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ArticleItem from './ArticleItem';
import CategorySidebar from '../categories/CategorySidebar';

export default function ArticlesByCategory() {
  const { category_slug } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get(`/articles/category/${category_slug}/`)
      .then(res => setArticles(res.data))
      .catch(err => console.error('Ошибка загрузки статей по категории:', err));
  }, [category_slug]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-2">
          <CategorySidebar />
        </div>
        <div className="col-md-10">
          <h2>Статьи категории: {category_slug}</h2>
          {articles.length === 0 ? (
            <p>Нет статей в этой категории.</p>
          ) : (
            <div className="row">
              {articles.map(article => (
                <div key={article.id} className="col-md-6 mb-4">
                  <ArticleItem article={article} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
