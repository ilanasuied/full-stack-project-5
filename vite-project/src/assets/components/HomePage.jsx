import styles from './HomePage.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Info from './Info';

function HomePage() {
    const [fetchErr, setFetchErr] = useState(false);
    const navigate = useNavigate();
    const [displayInfo, setDisplayInfo] = useState(false);
    const [user, setUser] = useState([]);
    const id = JSON.parse(localStorage.getItem('currentUser')).id;
    const location = useLocation();
    useEffect(() => {
        const API_URL = `http://localhost:3000/users/${id}`;
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setUser(data);
            } catch {
                setFetchErr(true);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const handleTodos = () => {
        navigate(`/home/users/${id}/todos`);
    };

    const handlePosts = () => {
        navigate(`/home/users/${id}/posts`);
    };

    const handleAlbums = () => {
        navigate(`/home/users/${id}/albums`);
    };

    const handleInfo = () => {
        setDisplayInfo(true);
    };

    const closeInfo = () => {
        setDisplayInfo(false);
    }

    if (fetchErr) return <h2>Please reload the page</h2>
    return (
        <>
            <nav className={styles.navContainer}>
                <button className={`${styles.navButton} ${styles.infoButton}`} onClick={handleInfo}>
                    info
                </button>
                <button className={styles.navButton} onClick={handleAlbums}>
                    Albums
                </button>
                <button className={styles.navButton} onClick={handlePosts}>
                    Posts
                </button>
                <button className={styles.navButton} onClick={handleTodos}>
                    Todos
                </button>
                <button className={`${styles.navButton} ${styles.logoutButton}`} onClick={handleLogout}>
                    logout
                </button>
            </nav>
            <Outlet />
            {location.state === 'home' && <h1 className={styles.title}>{`Hello, ${user.name ? user.name : 'Name'}!`}</h1>}            {displayInfo && <Info userObj={user} closeInfo={closeInfo} />}

        </>

    )
}
export default HomePage;