import { useEffect, useState } from 'react';
import './loginAndRegister.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [fetchErr, setFetchErr] = useState(false);
  const [users, setUsers] = useState([]);
  const [inputName, setInputName] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setUsers(data);
      } catch {
        setFetchErr(true);
      }
    };

    fetchData();
  }, []);

  const handleNameChange = (event) => {
    setInputName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setInputPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    for (const user of users) {
      if (user.username === inputName) {
        if (user.website === inputPassword) {
          let id = user.id;
          let currentUser = {
            'username': inputName,
            'password': inputPassword,
            'id': id,
            'email': user.email
          }
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          navigate('/home', { state: 'home' });
          return;
        }

        //if the password is incorrect
        setError(true);
        //Reset error state after 500ms
        setTimeout(() => {
          setError(false);
          setInputPassword('');
        }, 500);
        return;
      }
    }
    //if its a new user, go to the register page  
    setAlreadyRegistered(false);

    //Reset state after 2 seconds
    setTimeout(() => {
      setAlreadyRegistered(true);
    }, 2000);

    setInputName('');
    setInputPassword('');
  };

  
  if(fetchErr) return <h2>Please reload the page</h2>

  return (
    <div className='background'>
      <h1 className='title'>Login</h1>
      <form onSubmit={handleLogin} className='formContainer'>
        <div className='formText'>
          <p className='pForm'>Don't have an account? <Link to='/register'>Register</Link></p>
        </div>
        <input
          type="text"
          placeholder="Username"
          value={inputName}
          onChange={handleNameChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={error ? 'inputError' : ''}
          value={inputPassword}
          onChange={handlePasswordChange}
          required
        />
        <button type="submit">Log In</button>
        {alreadyRegistered ? '' : <p>please register yourself before login</p>}
      </form>
    </div>
  );
}

export default Login;
