import React from 'react';
import '../../styles.css';

const Message = ({ type, isMe, body, sender, time }) => {
    return (
        <div className="message-item">
            <div className={type === "System" ? "system-message" : isMe ? "my-message" : "partner-message"}>
                <span className="msg-sender">{sender}:</span>
                <span className="msg-text">{body}</span>
                <span className="msg-time">{time}</span>
            </div>
        </div>
    )
}

export default Message;