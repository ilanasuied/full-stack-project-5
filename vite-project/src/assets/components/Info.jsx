import styles from './Info.module.css';
function Info({userObj, closeInfo}){
    return (
    <div className={styles.modal}>
        <button className={styles.closeButton} onClick={closeInfo}>×</button>
        <ul>
            <li>{userObj.name? userObj.name : 'user name'}</li>
            <li>{userObj.email? userObj.email: 'user email'}</li>
            <li>{userObj.phone? userObj.phone: 'user phone'}</li>
            <li>{userObj.address.city? userObj.address.city: 'user city'}</li>
        </ul>
    </div>
    )
}
export default Info;