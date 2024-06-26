import './App.css';
import { Routes, Route } from 'react-router-dom';
import Posts from './assets/components/Posts.jsx';
import Login from './assets/components/Login.jsx';
import Register from './assets/components/Register.jsx';
import DataStorage from './assets/components/DataStorage.jsx';
import HomePage from './assets/components/HomePage.jsx'
import Todos from './assets/components/Todos.jsx';
import Albums from './assets/components/Albums.jsx';
import AlbumDetails from './assets/components/AlbumDetails.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/datastorage" element={<DataStorage />} />
        <Route path='/home' element={<HomePage />} >
          <Route path='users/:id/posts' element={<Posts />} />
          <Route path='users/:id/todos' element={<Todos />} />
          <Route path='users/:id/albums' element={<Albums />} />
          <Route path='users/:id/albums/:albumId/details' element={<AlbumDetails />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;