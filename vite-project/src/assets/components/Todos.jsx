import styles from './Todos.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from './apiRequest';
import createOptionObj from './createOptionObj';
import generateNextId from './generateNextId';

function Todos() {
    const [fetchErr, setFetchErr] = useState(false);
    const [todos, setTodos] = useState([]);
    const [idCounter, setIdCounter] = useState(0);
    const [sortCriteria, setSortCriteria] = useState('serial');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const { id } = useParams();
    const API_URL = 'http://localhost:3000/todos';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setIdCounter(prevCounter => generateNextId(data));
                const filteredTodos = data.filter(todo => parseInt(todo.userId, 10) === parseInt(id, 10));
                setTodos(filteredTodos);
            } catch {
                setFetchErr(true);
            }
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
        const updateOptions = createOptionObj.updateOptions({ completed: mytodo.completed });
        const reqUrl = `${API_URL}/${newTodos[index].id}`;
        const result = await apiRequest(reqUrl, updateOptions);
        if(result) setFetchErr(true);
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
        const deleteOptions = createOptionObj.deleteOptions();
        const reqUrl = `${API_URL}/${id}`;
        //delete the item from the db
        const response = await apiRequest(reqUrl, deleteOptions);
        if(response) setFetchErr(true);
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
        const updateOptions = createOptionObj.updateOptions({ title: mytodo.title })
        const reqUrl = `${API_URL}/${newTodos[index].id}`;
        const result = await apiRequest(reqUrl, updateOptions);
        if(result) setFetchErr(true);

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

        const createOptions = createOptionObj.createOptions(newTodo);
        const response = await apiRequest(API_URL, createOptions);
        if(response) setFetchErr(true);
        const listTodos = [...todos, newTodo];
        setTodos(listTodos);
        setNewTodoTitle('');
    };


    if(fetchErr) return <h2>Please reload the page</h2>

    return (
        <div className={styles.todoContainer}>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.search}
            />
            <select onChange={handleSortChange} value={sortCriteria} className={styles.select}>
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
                <button type="submit" className={styles.addBtnOnSubmit}>Add Todo</button>
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
                        <button onClick={() => handleDeleteTodo(todo.id)} className={styles.dltBtn}>×</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todos;
