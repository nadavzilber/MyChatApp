import React from 'react';
import '../../styles.css';


const LoginForm = ({ onLogin, username, setUsername, onKeyPressed, selectRoom }) => {
    const validateName = (input) => {
        if (input.length < 30)
            setUsername(input)
    }
    return <div>
        <form className="login-form" onSubmit={onLogin}>
            <div className="login-inputs">
                <input
                    value={username}
                    onChange={(e) => validateName(e.target.value)}
                    onKeyDown={(e) => onKeyPressed(e, 'sign-in')}
                    placeholder="Enter your username..."
                    className="username-input" />
                <div className="selection-container">
                    <label>Select a chat room</label>
                    <select id="dropdown" className="room-select" defaultValue="General" onChange={(e) => selectRoom(e.target.value)}>
                        <option value="General">General</option>
                        <option value="Sports">Sports</option>
                        <option value="Music">Music</option>
                    </select>
                </div>
            </div>
            <button className="submit-button">Start chatting</button>
        </form>
    </div>
}
export default LoginForm;