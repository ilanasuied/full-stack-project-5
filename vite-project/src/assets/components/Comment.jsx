import { useEffect, useState } from 'react';
import styles from './Comment.module.css';
import apiRequest from './apiRequest.js';
import createOptionObj from './createOptionObj.js';


function Comment({ post, comments, handleAddComment }) {
  const [fetchErr, setFetchErr] = useState(false);
  const [commentPost, setCommentPost] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentBody, setEditingCommentBody] = useState('');
  const userEmail = JSON.parse(localStorage.getItem('currentUser')).email;

  useEffect(() => {
    const filteredComments = comments.filter(comment => parseInt(comment.postId, 10) === parseInt(post.id, 10));
    setCommentPost(filteredComments);
  }, [comments, post.id]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    handleAddComment(post.id, newComment);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    const deleteOptions = createOptionObj.deleteOptions();
    const reqUrl = `http://localhost:3000/comments/${commentId}`;
    const response = await apiRequest(reqUrl, deleteOptions);
    if (response) setFetchErr(true);
    setCommentPost(commentPost.filter(comment => comment.id !== commentId));
  };

  const handleEditComment = (commentId, commentBody) => {
    setEditingCommentId(commentId);
    setEditingCommentBody(commentBody);
  };

  const handleSaveEditComment = async (commentId) => {
    const updatedComment = {
      body: editingCommentBody
    };

    const updateOptions = createOptionObj.updateOptions(updatedComment);
    const reqUrl = `http://localhost:3000/comments/${commentId}`;
    const response = await apiRequest(reqUrl, updateOptions);
    if (response) setFetchErr(true);
    setCommentPost(commentPost.map(comment =>
      comment.id === commentId ? { ...comment, body: editingCommentBody } : comment
    ));
    setEditingCommentId(null);
    setEditingCommentBody('');
  };

  
  if(fetchErr) return <h2>Please reload the page</h2>

  return (
    <div>
      <ul className={styles.commentsContainer}>
        {commentPost.map((comment, index) => (
          <li key={comment.id}>
            <div className={styles.comment}>
              <span className={styles.commentEmail}>{comment.email === userEmail ? 'You' : comment.email}</span>
              <br />
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    className={styles.txtarea}
                    value={editingCommentBody}
                    onChange={(e) => setEditingCommentBody(e.target.value)}
                  />
                  <button onClick={() => handleSaveEditComment(comment.id)} className={`${styles.btn} ${styles.save}`}>Save</button>
                </div>
              ) : (
                <>
                  {comment.body}
                  {comment.email === userEmail && (
                    <div>
                      <button onClick={() => handleEditComment(comment.id, comment.body)} className={`${styles.btn} ${styles.edt}`}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment.id)} className={`${styles.btn} ${styles.dlt}`}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmitComment}>
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          className={styles.txtarea}
        />
        <button type="submit" className={styles.btn}>Add Comment</button>
      </form>
    </div>
  );
}

export default Comment;
