import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AlbumDetails.module.css';
import apiRequest from './apiRequest';
import createOptionObj from './createOptionObj';

function AlbumDetails() {
    const { albumId } = useParams();

    const [fetchErr, setFetchErr] = useState(false);
    const [album, setAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1); // Initial page number for pagination
    const [hasMore, setHasMore] = useState(true); // Flag to indicate if more photos can be loaded
    const [editPhotoId, setEditPhotoId] = useState(null);
    const [newPhotoData, setNewPhotoData] = useState({
        title: '',
        url: '',
        thumbnailUrl: ''
    }); // State to hold new photo data

    const PHOTOS_PER_PAGE = 3; // Number of photos to fetch per page
    const API_URL_ALBUM = `http://localhost:3000/albums/${albumId}`;
    const API_URL_PHOTOS_PER_PAGE = `http://localhost:3000/photos?albumId=${albumId}&_page=${page}&_per_page=${PHOTOS_PER_PAGE}`; // API endpoint to fetch photos for the album
    const API_URL_PHOTOS = 'http://localhost:3000/photos';

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const response = await fetch(API_URL_ALBUM);
                const data = await response.json();
                setAlbum(data);
            } catch {
                setFetchErr(true);
            }
        };
        fetchAlbumData();
    }, []);



    const loadMorePhotos = async () => {
        setPage(prevPage => prevPage + 1); // Increment 'page' state to load next page of photos
        try {
            const response = await fetch(API_URL_PHOTOS_PER_PAGE);
            const responseData = await response.json();
            const photosData = responseData.data; // Extract 'data' array from response

            setPhotos(prevPhotos => [...prevPhotos, ...photosData]);

            if (photosData.length < PHOTOS_PER_PAGE) {
                setHasMore(false);
            }
        } catch {
            setFetchErr(true);
        }

    };


    const handleAddPhoto = async (event) => {
        event.preventDefault();
        const newPhoto = {
            albumId: albumId,
            title: newPhotoData.title,
            url: newPhotoData.url,
            thumbnailUrl: newPhotoData.thumbnailUrl
        };

        //display the change on the screen
        const listPhotos = [...photos, newPhoto];
        setPhotos(listPhotos);
        setNewPhotoData({
            title: '',
            url: '',
            thumbnailUrl: ''
        });

        //save the new photo in the db
        const createOptions = createOptionObj.createOptions(newPhoto);
        const response = await apiRequest(API_URL_PHOTOS, createOptions);
        if (response) setFetchErr(true);

    };

    const handleDeletePhoto = async (photoId) => {

        const deleteOptions = createOptionObj.deleteOptions();

        try {
            await apiRequest(`${API_URL_PHOTOS}/${photoId}`, deleteOptions);
            setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
        } catch (error) {
            setFetchErr(true);
        }
        //display the changes on the screen
        setPhotos(photos.filter(photo => photo.id !== photoId));
    };

    const handleEditPhoto = (photoId) => {
        setEditPhotoId(photoId);
    };

    const handleUpdatePhoto = async (index, updatedTitle) => {
        // Create a new array with the updated photo title
        const newPhotos = [...photos];
        newPhotos[index] = { ...newPhotos[index], title: updatedTitle };
        setPhotos(newPhotos);

        // Prepare the update data
        const updateData = {
            title: updatedTitle,
        };

        
        const updateOptions = createOptionObj.updateOptions(updateData);

        try {
            await apiRequest(`${API_URL_PHOTOS}/${newPhotos[index].id}`, updateOptions);

        } catch (error) {
            setFetchErr(true);
        }
    };

    // Render loading indicator while album data is being fetched
    if (!album) {
        return <div>Loading...</div>;
    }

    if (fetchErr) return <h2>Please Reload The Page</h2>

    return (
        <div className={styles.albumDetailsContainer}>
            <h1>{album.title}</h1>
            <ul className={styles.photosList}>
                {photos.map((photo, index) => (
                    <li key={photo.id} className={styles.photoItem}>
                        {editPhotoId === photo.id ? (
                            <div className={styles.editForm}>
                                <input
                                    type="text"
                                    value={photo.title}
                                    onChange={(e) => handleUpdatePhoto(index, e.target.value)}
                                />
                                <button onClick={() => setEditPhotoId(null)}>Save</button>
                            </div>
                        ) : (
                            <>
                                <img src={photo.thumbnailUrl} alt={photo.title} />
                                <p>{photo.title}</p>
                                <div className={styles.actions}>
                                    <button onClick={() => handleEditPhoto(photo.id)}>Edit</button>
                                    <button onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddPhoto} className={styles.addItem}>
                <input
                    type="text"
                    value={newPhotoData.title}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, title: e.target.value })}
                    placeholder="Enter photo title"
                />
                <input
                    type="text"
                    value={newPhotoData.url}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, url: e.target.value })}
                    placeholder="Enter photo URL"
                />
                <input
                    type="text"
                    value={newPhotoData.thumbnailUrl}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, thumbnailUrl: e.target.value })}
                    placeholder="Enter photo thumbnail URL"
                />
                <button type="submit">Add Photo</button>
            </form>
            {hasMore && (
                <button onClick={loadMorePhotos} className={styles.loadMoreButton}>
                    {photos.length > 0 ? 'Load More' : 'Load Photos'}
                </button>
            )}
        </div>
    );
}

export default AlbumDetails;
