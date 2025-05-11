import { Link } from 'react-router-dom';
import styles from './ArticleItem.module.css';

export default function ArticleItem({ article }) {
  return (
    <div className={styles.article}>
      <h2 className={styles.title}>
        <Link to={`/articles/${article.id}`} className={styles.title}>
          {article.title}
        </Link>
      </h2>
      <p className={styles.description}>{article.description}</p>
      
      {article.created_at && (
        <time className={styles.date}>
          {new Date(article.created_at).toLocaleString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </time>
      )}

      {article.source_detail && (
        <p className={styles.source}>
          Источник: <a href={article.source_detail.url} target="_blank" rel="noopener noreferrer">
            {article.source_detail.name}
          </a>
        </p>
      )}

      {article.category_detail && (
        <p className={styles.category}>
          Категория: {article.category_detail.name}
        </p>
      )}

      {article.tags_detail && article.tags_detail.length > 0 && (
        <p className={styles.tags}>
          Теги:{' '}
            {article.tags_detail.map((tag, index) => (
              <Link
                key={index}
                to={`/articles?tag=${encodeURIComponent(tag.name)}`}
                style={{ color: 'blue', marginRight: '8px' }}
              >
                {tag.name}
              </Link>
            ))}
        </p>
      )}

      {article.image_url && (
        <img
          src={article.image_url}
          alt="Превью"
          className={styles.image}
        />
      )}
    </div>
  );
}
