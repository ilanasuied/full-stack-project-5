import styles from './Todos.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from './apiRequest';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [idCounter, setIdCounter] = useState(0);
    const [sortCriteria, setSortCriteria] = useState('serial');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const { id } = useParams();
    const API_URL = 'http://localhost:3000/todos';

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(API_URL);
            const data = await response.json();
            setIdCounter(prevCounter=> data.length + 3);
            const filteredTodos = data.filter(todo => parseInt(todo.userId, 10) === parseInt(id, 10));
            setTodos(filteredTodos);
        };
        fetchData();
    }, []);


    const handleCheckboxChange = async (index) => {
        const newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        console.log(newTodos[index]);
        //display the chage on the screen
        setTodos((prevTodos) => newTodos);

        //store the change in the db
        const mytodo = newTodos[index];
        const updateOptions = {
            method: 'PATCH',
            hearders: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: mytodo.completed })
        }
        const reqUrl = `${API_URL}/${newTodos[index].id}`;
        const result = await apiRequest(reqUrl, updateOptions);
        // if(result) //faire lerreur
    };

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const sortedTodos = [...todos].sort((a, b) => {
        switch (sortCriteria) {
            case 'completed':
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'random':
                return 0.5 - Math.random();
            default:
                return a.id - b.id; //order by default
        }
    });

    const filteredTodos = sortedTodos.filter(todo => {
        const searchLower = searchTerm.toLowerCase();
        return (
            todo.title.toLowerCase().includes(searchLower) ||
            todo.id.toString().includes(searchLower) ||
            (searchLower === 'completed' && todo.completed) ||
            (searchLower === 'not completed' && !todo.completed)
        );
    });

    const handleDeleteTodo = async (id) => {
        //create the request 
        const deleteOptions = {
            method: 'DELETE'
        };
        const reqUrl = `${API_URL}/${id}`;
        //delete the item from the db
        await apiRequest(reqUrl, deleteOptions);
        //display the changes on the screen
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleUpdateTodo = async (index, newTitle) => {
        //display the changes on the screen
        const newTodos = [...todos];
        newTodos[index].title = newTitle;
        setTodos(newTodos);

        //update item in the db
        const mytodo = newTodos[index];
        const updateOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: mytodo.title })
        };
        const reqUrl = `${API_URL}/${newTodos[index].id}`;
        const result = await apiRequest(reqUrl, updateOptions);
        // if(result) //faire lerreur

    };

    const handleAddTodo = async (event) => {
        setIdCounter(prevIdCounter => prevIdCounter + 1);
        const itemId = idCounter.toString();
        event.preventDefault();
        const newTodo = {
            userId: id,
            id: itemId,
            title: newTodoTitle,
            completed: false
        };

        const createOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        };
        const response = await apiRequest(API_URL, createOptions);
        //faire lerreur
        const listTodos = [...todos, newTodo];
        setTodos(listTodos);
        setNewTodoTitle('');
        console.log(newTodo);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <select onChange={handleSortChange} value={sortCriteria}>
                <option value="serial">serial</option>
                <option value="completed">completed</option>
                <option value="alphabetical">alphabetical</option>
                <option value="random">random</option>
            </select>
            <form onSubmit={handleAddTodo}>
                <input
                    type="text"
                    placeholder="New Todo Title"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                />
                <button type="submit">Add Todo</button>
            </form>
            <ul>
                {filteredTodos.map((todo, index) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <span>{index + 1}. </span>
                        <input
                            type="text"
                            value={todo.title}
                            onChange={(e) => handleUpdateTodo(index, e.target.value)}
                        />
                        <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todos;
