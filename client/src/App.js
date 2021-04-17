import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Message from './components/Message/Message';
import LoginForm from './components/Form/LoginForm';
import ChatForm from './components/Form/ChatForm';
import './styles.css';

const App = () => {
  const msgRef = useRef(null);
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLogged, setLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [room, selectRoom] = useState("General");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your-id", id => {
      setYourID(id);
    });

    socketRef.current.on("server-message", (roomMsgs) => {
      receivedMessages(roomMsgs);
    });

    socketRef.current.on("login", status => {
      setLogged(status)
    });
  }, []);

  function receivedMessages(roomMsgs) {
    setMessages(roomMsgs);
    msgRef.current.scrollIntoView();
  }

  function sendMessage(event) {
    if (!!event) event.preventDefault();

    socketRef.current.emit("client-message", {
      room,
      body: message,
      id: yourID,
      username
    });
    setMessage("");
  }

  const executeScroll = () => {
    msgRef.current.scrollIntoView();
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  const onKeyPressed = (event, funcName) => {
    if (event.keyCode === 13) { //ENTER 
      if (funcName === "send-msg")
        sendMessage(event);
      else if (funcName === "sign-in")
        onLogin(event);
    }
  }

  const onLogin = (event) => {
    event.preventDefault();
    if (username.trim().length > 0) {
      const data = { username, room, actionType: 'join-room' };
      socketRef.current.emit("client-action", data);
    }
    else setUsername("");
  }

  const leaveRoom = () => {
    const data = { username, room, actionType: 'leave-room' };
    socketRef.current.emit("client-action", data);
  }

  return (
    <div className="chat-room-container">
      {!isLogged && <LoginForm
        onLogin={onLogin}
        username={username}
        setUsername={setUsername}
        onKeyPressed={onKeyPressed}
        selectRoom={selectRoom} />}
      {isLogged && <>
        <div className="my-area">
          <label className="action-button">
            Scroll
          <FontAwesomeIcon className="scroll-down" icon={faArrowAltCircleDown} onClick={executeScroll} />
          </label>
          <label style={{ marginRight: "20px" }}>{username}</label>
          <label>{yourID}</label>
          <label className="action-button">
            Leave
          <FontAwesomeIcon className="leave-room" icon={faSignOutAlt} onClick={leaveRoom} />
          </label>

        </div>
        <div>{room} Chat Room</div>
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message, index) => (
              <Message
                key={index}
                type={message.id}
                isMe={message.id === yourID}
                sender={message.username}
                body={message.body}
                time={message.time}
              />
            ))}
            <div className="messages-footer" ref={msgRef}></div>
          </div>
        </div>
        <ChatForm
          sendMessage={sendMessage}
          message={message}
          handleChange={handleChange}
          onKeyPressed={onKeyPressed} />
      </>}
    </div>
  );
};

export default App;