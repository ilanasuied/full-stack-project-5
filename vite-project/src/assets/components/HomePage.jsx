import styles from './HomePage.module.css';
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    let username = 'ilana';
    return (
        <>
            <nav className={styles.navContainer}>
                <button className={`${styles.navButton} ${styles.infoButton}`}>info</button>
                <button className={styles.navButton}>Albums</button>
                <button className={styles.navButton}>Posts</button>
                <button className={styles.navButton}>Todos</button>
                <button className={`${styles.navButton} ${styles.logoutButton}`}>logout</button>
            </nav>
            <h1 className={styles.title}>{`Hello, ${username}!`}</h1>
        </>

    )
}
export default HomePage;