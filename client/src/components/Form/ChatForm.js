import React from 'react';
import '../../styles.css';

const ChatForm = ({ sendMessage, message, handleChange, onKeyPressed }) => {
    return <form onSubmit={sendMessage}>
        <textarea
            cols="10"
            value={message}
            onChange={handleChange}
            onKeyDown={(e) => onKeyPressed(e, 'send-msg')}
            placeholder="Say something..."
            className="new-message-input-field" />
        <button className="submit-button">Send</button>
    </form>
}
export default ChatForm;