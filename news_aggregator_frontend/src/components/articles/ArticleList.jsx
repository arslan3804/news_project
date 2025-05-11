import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import ArticleItem from './ArticleItem';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const query = useQuery();
  const tags = query.getAll('tag');

  useEffect(() => {
    const url = tags.length ? `/articles/?tag=${tags.join('&tag=')}` : '/articles/';
    api.get(url)
      .then(res => setArticles(res.data))
      .catch(() => setError('Ошибка загрузки статей'))
  }, []);

  return (
    <div className="container my-4">
      <h1 className="mb-4">
        Новости{tags.length ? ` с тегами: «${tags.join('», «')}»` : ''}
      </h1>

      <div className="row">
        {articles.map(article => (
          <div className="col-md-6" key={article.id}>
            <ArticleItem article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
