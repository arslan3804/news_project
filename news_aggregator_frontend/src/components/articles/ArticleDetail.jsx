import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  useEffect(() => {
    api.get(`/articles/${id}/`)
      .then(res => setArticle(res.data));
    
    loadComments();
  }, [id]);

  const loadComments = () => {
    api.get(`/articles/${id}/comments/`)
      .then(res => setComments(res.data));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    api.post(`/articles/${id}/comments/`, { text: newComment })
      .then(() => {
        setNewComment('');
        loadComments();
      })
      .catch(err => console.error('Error adding comment:', err));
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  const handleUpdateComment = () => {
    if (!editedCommentText.trim()) return;
    
    api.put(`/articles/${id}/comments/${editingCommentId}/`, { text: editedCommentText })
      .then(() => {
        setEditingCommentId(null);
        setEditedCommentText('');
        loadComments();
      })
      .catch(err => console.error('Error updating comment:', err));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      api.delete(`/articles/${id}/comments/${commentId}/`)
        .then(() => loadComments())
        .catch(err => console.error('Error deleting comment:', err));
    }
  };

  if (!article) return <p className="text-center mt-5">Загрузка...</p>;

  return (
    <div className="container mt-4">
      <h1>{article.title}</h1>
      <p className="text-muted">
        {new Date(article.created_at).toLocaleString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </p>

      {article.image_url && (
        <img src={article.image_url} alt="Превью" className="img-fluid mb-3" />
      )}

      <p><strong>Источник:</strong> {article.source_detail?.name}</p>
      <p><strong>Категория:</strong> {article.category_detail?.name}</p>
      <p>
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
      
      <div className="mt-4">
        <p>{article.content}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary mt-3">
          Перейти к источнику
        </a>
      </div>

      <div className="mt-5">
        <h3>Комментарии ({comments.length})</h3>
        
        {user && (
          <div className="mb-4">
            <div className="form-group">
              <textarea
                className="form-control"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Напишите ваш комментарий..."
              />
            </div>
            <button 
              onClick={handleAddComment}
              className="btn btn-primary mt-2"
              disabled={!newComment.trim()}
            >
              Отправить
            </button>
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-muted">Пока нет комментариев</p>
        ) : (
          <div className="list-group">
            {comments.map(comment => (
              <div key={comment.id} className="list-group-item mb-3">
                {editingCommentId === comment.id ? (
                  <div>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <button 
                        onClick={handleUpdateComment}
                        className="btn btn-sm btn-success mr-2"
                        disabled={!editedCommentText.trim()}
                      >
                        Сохранить
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="btn btn-sm btn-secondary"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between">
                      <strong>{comment.user}</strong>
                      <small className="text-muted">
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </div>
                    <p className="mt-2 mb-0">{comment.text}</p>
                    
                    {user && user.username === comment.user && (
                      <div className="mt-2">
                        <button 
                          onClick={() => handleStartEdit(comment)}
                          className="btn btn-sm btn-outline-primary mr-2"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}