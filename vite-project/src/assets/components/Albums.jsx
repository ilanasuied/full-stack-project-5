import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './Albums.module.css';
import apiRequest from './apiRequest.js';

function Albums() {
    const API_URL = 'http://localhost:3000/albums';
    const [fetchErr, setFetchErr] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [idAlbumsCounter, setIdAlbumsCounter] = useState(0);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setIdAlbumsCounter(prevCounter => data.length + 3);
                const filteredAlbums = data.filter(album => parseInt(album.userId, 10) === parseInt(id, 10));
                setAlbums(filteredAlbums);
            }catch{
                setFetchErr(true);
            }
            
        };
        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredAlbums = albums.filter(album => {
        const searchLower = searchTerm.toLowerCase();
        return (
            album.title.toLowerCase().includes(searchLower) ||
            album.id.toString().includes(searchLower)
        );
    });

    //go to a new window to see the details of the selected album
    const onSelectAlbum = (albumId) => {
        navigate(`/home/users/${id}/albums/${albumId}/details`);
    }

    const handleAddAlbum = async (event) => {
        setIdAlbumsCounter(prevIdCounter => prevIdCounter + 1);
        const itemId = idAlbumsCounter.toString();
        event.preventDefault();
        //create the new album
        const newAlbum = {
            userId: id,
            id: itemId,
            title: newAlbumTitle,
        };

        //create the request
        const createOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlbum)
        };
        //send the request and save the new post in the db
        const response = await apiRequest(API_URL, createOptions);
        if(response) setFetchErr(true);
        const listAlbums = [...albums, newAlbum];
        setAlbums(listAlbums);
        setNewAlbumTitle('');
    };

    if(fetchErr) return <h2>Please reload the page</h2>

    return (
        <div className={styles.albumContainer}>
            <input
                className={styles.searchBar}
                type="text"
                placeholder="Search by serial number or title..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <form onSubmit={handleAddAlbum} className={styles.inputAdd}>
                <input
                    type="text"
                    placeholder="Add New Album"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                />
                <button type="submit">Add Album</button>
            </form>
            <ul className={styles.albumList}>
                {filteredAlbums.map((album) => (
                    <li key={album.id} className={styles.albumItem}>
                        <button onClick={() => onSelectAlbum(album.id)} className={styles.albumTitle}>
                            {album.id}. {album.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Albums;
