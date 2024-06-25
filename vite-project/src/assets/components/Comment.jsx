import { useEffect, useState } from 'react';
import styles from './Comment.module.css';

function Comment({ post, comments }) {
    const [commentPost, setCommentPost] = useState([]);
    const userEmail = JSON.parse(localStorage.getItem('currentUser')).email;
    useEffect(() => {
        const filteredComments = comments.filter(comment => parseInt(comment.postId, 10) === parseInt(post.id, 10));
        setCommentPost(filteredComments);
    }, []);

    return (

        <ul className={styles.commentsContainer}>
            {commentPost.map((comment, index) => (
                <li key={comment.id}>
                    <div className={styles.comment}>
                        <span className={styles.commentEmail}>{comment.email === userEmail? 'You' : comment.email}</span>
                        <br />
                        {comment.body}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default Comment;
