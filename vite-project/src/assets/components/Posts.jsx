import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Posts.module.css';
import Comment from './Comment.jsx';
import apiRequest from './apiRequest.js';

function Posts() {
  const [fetchErr, setFetchErr] = useState(false);
  const [posts, setPosts] = useState([]);
  const [idCounter, setIdCounter] = useState(0);
  const [idCounterComment, setIdCounterComment] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const API_URL = 'http://localhost:3000/posts';
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setIdCounter(prevCounter => data.length + 3);
        const filteredPosts = data.filter(post => parseInt(post.userId, 10) === parseInt(id, 10));
        setPosts(filteredPosts);

        const response2 = await fetch('http://localhost:3000/comments');
        const commentesData = await response2.json();
        setIdCounterComment(prevCounter => commentesData.length + 3);
        const filteredComments = commentesData.filter(comment => filteredPosts.some(post => parseInt(comment.postId, 10) === parseInt(post.id, 10)));
        setComments(filteredComments);
      }catch{
        setFetchErr(true);
      }

      
    };
    fetchData();
  }, []);

  const displayComments = () => {
    setShowComments(!showComments);
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPost = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.id.toString().includes(searchLower)
    );
  });

  const handleDeletePost = async (postId) => {
    //create the request 
    const deleteOptions = {
      method: 'DELETE'
    };
    const reqUrl = `${API_URL}/${postId}`;
    //delete the item from the db
    const result = await apiRequest(reqUrl, deleteOptions);
    if(result) setFetchErr(true);
    //display the changes on the screen
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleAddPost = async (event) => {
    setIdCounter(prevIdCounter => prevIdCounter + 1);
    const itemId = idCounter.toString();
    event.preventDefault();
    //create the new post
    const newPost = {
      userId: id,
      id: itemId,
      title: newPostTitle,
      body: newPostBody
    };

    //create the request
    const createOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    };
    //send the request and save the new post in the db
    const response = await apiRequest(API_URL, createOptions);
    if(response) setFetchErr(true);
    const listPosts = [...posts, newPost];
    setPosts(listPosts);
    setNewPostTitle('');
    setNewPostBody('');
  };

  const handleUpdatePost = async (index, newBody) => {
    //display the changes on the screen
    const newPosts = [...posts];
    newPosts[index].body = newBody;
    setPosts(newPosts);

    //update item in the db
    const myPost = newPosts[index];
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: myPost.body
      })
    };
    const reqUrl = `${API_URL}/${newPosts[index].id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if(result) setFetchErr(true);

  };


  const handleAddComment = async (postId, commentBody) => {
    const userEmail = JSON.parse(localStorage.getItem('currentUser')).email;
    setIdCounterComment(prevIdCounter => prevIdCounter + 1);
    const itemId = idCounterComment.toString();
    const newComment = {
      postId,
      id: itemId,
      email: userEmail,
      body: commentBody
    };

    const createOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComment)
    };
    const result = await apiRequest('http://localhost:3000/comments', createOptions);
    if(result) setFetchErr(true);
    setComments([...comments, newComment]);
  };

  if(fetchErr) return <h2>Please reload the page</h2>
  return (
    <div>
      <h1 className={styles.title}>Posts</h1>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <form onSubmit={handleAddPost} className={`${styles.addPost} ${styles.inputAdd}`}>
        <input
          type="text"
          placeholder="New Post Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Post Body"
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
        />
        <button type="submit">Add Post</button>
      </form>
      <ul className={styles.postContainer}>
        {filteredPost.map((post, index) => (
          <li key={post.id} className={styles.postCard}>
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                {post.id} <br />
                {post.title}
              </div>
              <div className={styles.cardBack}>
                <button className={styles.commentsBtn} onClick={displayComments}>{showComments ? 'post' : 'comments'}</button>
                {showComments ? <Comment post={post} comments={comments} handleAddComment={handleAddComment} />
                  :
                  <textarea
                    className={styles.postBody}
                    type="text"
                    value={post.body}
                    onChange={(e) => handleUpdatePost(index, e.target.value)}
                  />}
                {!showComments && <button onClick={() => handleDeletePost(post.id)} className={styles.dlt}>delete</button>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;