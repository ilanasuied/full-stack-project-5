import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Posts.module.css';
import Comment from './Comment.jsx';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const API_URL = 'http://localhost:3000/posts';
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        const filteredPosts = data.filter(post => parseInt(post.userId, 10) === parseInt(id, 10));
        setPosts(filteredPosts);

        const response2 = await fetch('http://localhost:3000/comments');
        const commentesData = await response2.json();
        const filteredComments = commentesData.filter(comment => filteredPosts.some(post=>parseInt(comment.postId, 10) === parseInt(post.id, 10) ));
        setComments(filteredComments);
    };
    fetchData();
}, []);

  const displayComments = ()=>{
    setShowComments(!showComments);
  }
  

  return (
    <div>
      <h1 className={styles.title}>Posts</h1>
      <ul className={styles.postContainer}>
        {posts.map((post, index) => (
          <li key={post.id} className={styles.postCard}>
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                {index + 1} <br />
                {post.title}
              </div>
              <div className={styles.cardBack}>
                <button className={styles.commentsBtn} onClick={displayComments}>{showComments? 'post':'comments'}</button>
                {showComments? <Comment post={post} comments={comments}/> : post.body}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;