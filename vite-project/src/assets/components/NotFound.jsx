import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound(){
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home', { state: 'home' });
        }, 3000);

        
    }, []);

    return (
        <div>
            <h2>Not Found</h2>
            <h2>Redirecting to home in 3 seconds...</h2>
        </div>
    );
 
}

export default NotFound;