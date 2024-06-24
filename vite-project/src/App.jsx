import { Routes, Route } from 'react-router-dom';
import Users from './assets/components/User.jsx';
import Posts from './assets/components/Posts.jsx';
import Login from './assets/components/Login.jsx';
import Register from './assets/components/Register.jsx';
import DataStorage from './assets/components/DataStorage.jsx';
import HomePage from './assets/components/HomePage.jsx'
import './App.css';
function App() {
  return (
    <Routes>
        <Route path="/users" element={<Users/>} />
        <Route path="/posts" element={<Posts/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/datastorage" element={<DataStorage/>} />
        <Route path='/home' element={<HomePage/>} />

    </Routes>
  );
}

export default App;