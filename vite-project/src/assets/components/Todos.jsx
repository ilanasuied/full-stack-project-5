import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Todos.module.css';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('serial');
    const [searchCriteria, setSearchCriteria] = useState(''); // État pour le critère de recherche
    const [searchValue, setSearchValue] = useState(''); // État pour la valeur de recherche
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/todos');
            const data = await response.json();
            const filteredTodos = data.filter(todo => parseInt(todo.userId, 10) === parseInt(id, 10));
            setTodos(filteredTodos);
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (index) => {
        const newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        console.log(newTodos[index]);
        setTodos((prevTodos) => newTodos);

    };

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };


    const handleSearchCriteriaChange = (event) => {
        setSearchCriteria(event.target.value);
    };

    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    };

    const filteredTodos = todos.filter(todo => {
        if (!searchValue) return true;
        switch (searchCriteria) {
            case 'id':
                return todo.id.toString().includes(searchValue);
            case 'title':
                return todo.title.toLowerCase().includes(searchValue.toLowerCase());
            case 'completed':
                return (searchValue === 'completed' && todo.completed) || (searchValue === 'not completed' && !todo.completed);
            default:
                return true;
        }
    });

    const sortedTodos = filteredTodos.sort((a, b) => {
        switch (sortCriteria) {
            case 'completed':
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'random':
                return 0.5 - Math.random();
            default:
                return a.id - b.id;
        }
    });

    return (
        <div>
            <select onChange={handleSortChange} value={sortCriteria}>
                <option value="serial">serial</option>
                <option value="completed">completed</option>
                <option value="alphabetical">alphabetical</option>
                <option value="random">random</option>
            </select>
            <select onChange={handleSearchCriteriaChange} value={searchCriteria}>
                <option value="">Select Search Criteria</option>
                <option value="id">Number Serial</option>
                <option value="title">Title</option>
                <option value="completed">Completion Status</option>
            </select>
            <input 
                type="text" 
                placeholder="Enter search value" 
                value={searchValue} 
                onChange={handleSearchValueChange} 
            />
            <ul>
                {sortedTodos.map((todo, index) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        {index + 1}. {todo.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Todos;