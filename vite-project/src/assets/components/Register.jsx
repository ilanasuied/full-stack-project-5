import { useEffect, useState } from 'react';
import { Link, json, useNavigate } from 'react-router-dom';
import './loginAndRegister.css';

function Register() {
    const [fetchErr, setFetchErr] = useState(false);
    const [users, setUsers] = useState([]);
    const [inputName, setInputName] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPasswordVerify, setInputPasswordVerify] = useState('');
    const [error, setError] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/users');
                const data = await response.json();
                setUsers(data);
            } catch { setFetchErr(true); }
        };

        fetchData();
    }, []);

    const handleNameChange = (event) => {
        setInputName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setInputPassword(event.target.value);
    };

    const handlePasswordVerifyChange = (event) => {
        setInputPasswordVerify(event.target.value);
    };

    const handleRegister = (event) => {
        event.preventDefault();

        for (const user of users) {

            //if the username is already taken
            if (user.username === inputName) {
                setError(true);
                //Reset error state after 500ms
                setTimeout(() => {
                    setError(false);
                }, 2000);
                return;
            }
        }

        if (inputPassword === inputPasswordVerify) {
            let id = users.length ? parseInt(users[users.length - 1].id, 10) + 1 : 1;
            id = id.toString();
            let currentUser = {
                'username': inputName,
                'password': inputPassword,
                'id': id
            }
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            navigate('/datastorage');
            return;
        }

        //display the password error message for 2 seconds
        setErrorPassword(true);
        setTimeout(() => {
            setErrorPassword(false);
        }, 3000);

        setInputName('');
        setInputPassword('');
        setInputPasswordVerify('');
    };


    if(fetchErr) return <h2>Please reload the page</h2>

    return (
        <div className='background'>
            <h1 className='title'>Register</h1>
            <form onSubmit={handleRegister} className='formContainer'>
                <div className='formText'>
                    <p className='pForm'>Have an account? <Link to='/login'>Login</Link></p>
                </div>
                <input
                    className={error ? 'inputError' : ''}
                    type="text"
                    placeholder="Username"
                    value={inputName}
                    onChange={handleNameChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={inputPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <input
                    className={errorPassword ? 'inputError' : ''}
                    type="password"
                    placeholder="Verify Password"
                    value={inputPasswordVerify}
                    onChange={handlePasswordVerifyChange}
                    required
                />
                {errorPassword ? <p>Passwords must by the same</p> : ''}

                <button type="submit">Register</button>
                {error ? <p>This username is already taken</p> : ''}
            </form>
        </div>
    );
}

export default Register;
