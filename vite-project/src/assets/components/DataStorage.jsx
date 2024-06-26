import './loginAndRegister.css'
import React, { useState, useEffect } from 'react';
import apiRequest from './apiRequest';
import { Link, useNavigate } from 'react-router-dom';

function DataStorage() {
  const API_URL = 'http://localhost:3000/users';
  const [fetchErr, setFetchErr] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    username: '',
    email: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: {
        lat: '',
        lng: ''
      }
    },
    phone: '',
    website: '',
    company: {
      name: '',
      catchPhrase: '',
      bs: ''
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setUserData((prevData) => ({
        ...prevData,
        id: parsedUser.id || '',
        name: '',
        username: parsedUser.username || '',
        email: '',
        address: {
          ...prevData.address,
          street: '',
          suite: '',
          city: '',
          zipcode: '',
          geo: {
            ...prevData.address.geo,
            lat: '',
            lng: ''
          }
        },
        phone: '',
        website: parsedUser.password || '',
        company: {
          ...prevData.company,
          name: '',
          catchPhrase: '',
          bs: ''
        }
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => {
      const keys = name.split('.');
      if (keys.length === 1) {
        return { ...prevData, [name]: value };
      } else if (keys.length === 2) {
        return {
          ...prevData,
          [keys[0]]: { ...prevData[keys[0]], [keys[1]]: value }
        };
      } else if (keys.length === 3) {
        return {
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: { ...prevData[keys[0]][keys[1]], [keys[2]]: value }
          }
        };
      }
      return prevData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    };
    const result = await apiRequest(API_URL, postOptions);
    if (result) {
      setFetchErr(true);
    } else {
      navigate('/home', {state: 'home'});
    }
  };

  if(fetchErr) return <h2>Please reload the page</h2>

  return (
    <div className='background'>
      <h1 className='title'>Data Storage</h1>
      {!fetchErr && <form onSubmit={handleSubmit} className='formContainer dataStorageForm'>
        <input placeholder='Name' type="text" name="name" value={userData.name} onChange={handleChange} />
        <input placeholder='Email' type="email" name="email" value={userData.email} onChange={handleChange} />
        <input placeholder='Street' type="text" name="address.street" value={userData.address.street} onChange={handleChange} />
        <input placeholder='Suite' type="text" name="address.suite" value={userData.address.suite} onChange={handleChange} />
        <input placeholder='City' type="text" name="address.city" value={userData.address.city} onChange={handleChange} />
        <input placeholder='Zipcode' type="text" name="address.zipcode" value={userData.address.zipcode} onChange={handleChange} />
        <input placeholder='Lat' type="text" name="address.geo.lat" value={userData.address.geo.lat} onChange={handleChange} />
        <input placeholder='Lng' type="text" name="address.geo.lng" value={userData.address.geo.lng} onChange={handleChange} />
        <input placeholder='Phone' type="text" name="phone" value={userData.phone} onChange={handleChange} />
        <input placeholder='Company Name' type="text" name="company.name" value={userData.company.name} onChange={handleChange} />
        <input placeholder='Catch Phrase' type="text" name="company.catchPhrase" value={userData.company.catchPhrase} onChange={handleChange} />
        <input placeholder='BS' type="text" name="company.bs" value={userData.company.bs} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>}
    </div>
  );
}

export default DataStorage;
