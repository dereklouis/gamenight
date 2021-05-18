import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminAccessPanel.css';

const AdminAccessPanel = (props) => {
  const [gameKeys, updateGameKeys] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const fetchKeys = await axios.get('/api/keys');
      updateGameKeys(fetchKeys.data);
    };
    fetch();
    props.socket.on('DB-Refresh', function (data) {
      console.log('$$$$', data);
      fetch();
    });
  }, []);

  const sendLink = async () => {
    const zoomLink = document.getElementById('zoomLinkInput');
    await axios.put('/api/keys/zoomlink', {
      link: zoomLink.value,
    });
    zoomLink.value = '';
    props.socket.emit('DB-Update');
  };

  const sendRoomCode = async () => {
    const roomCode = document.getElementById('roomCodeInput');
    await axios.put('/api/keys/roomcode', {
      roomCode: roomCode.value,
    });
    roomCode.value = '';
    props.socket.emit('DB-Update');
  };

  const toggleStatus = async () => {
    await axios.put('/api/keys/gamestatus');
    props.socket.emit('DB-Update');
  };

  const reset = async () => {
    await axios.patch('/api/users/reset');
    await axios.patch('/api/games/reset');
    await axios.patch('/api/keys/reset');
    props.updateGameStatus(false);
    props.updateAttending('n/a');
    if (window.checkForRoomOpen !== undefined) {
      clearInterval(window.checkForRoomOpen);
      window.checkForRoomOpen = undefined;
    }
    if (window.checkForRoomClose !== undefined) {
      clearInterval(window.checkForRoomClose);
      window.checkForRoomClose = undefined;
    }
    if (window.fetchGameData !== undefined) {
      clearInterval(window.fetchGameData);
      window.fetchGameData = undefined;
    }
    const fetchKeys = await axios.get('/api/keys');
    updateGameKeys(fetchKeys.data);
    console.log('Game Night has been reset!');
    props.socket.emit('DB-Update');
  };

  return (
    <div id="aAPContainer" className="flexColumn">
      <h1 id="aAPTitle">Admin Access Panel</h1>
      <div className="panelRow">
        <input
          type="text"
          className="panelInput"
          placeholder="enter zoom link..."
          id="zoomLinkInput"
        />
        <button id="sendLink" onClick={(e) => sendLink(e)}>
          Send Link
        </button>
      </div>
      <div className="panelRow">
        <input
          type="text"
          className="panelInput"
          placeholder="enter game code..."
          id="roomCodeInput"
        />
        <button id="sendCode" onClick={sendRoomCode}>
          Send Code
        </button>
      </div>
      <div className="panelRow">
        {gameKeys.gameActive ? (
          <button className="closeRoom" onClick={toggleStatus}>
            Close Room
          </button>
        ) : (
          <button className="openRoom" onClick={toggleStatus}>
            Open Room
          </button>
        )}
      </div>
      <div className="panelRow">
        <button id="reset" onClick={reset}>
          RESET
        </button>
      </div>
    </div>
  );
};

export default AdminAccessPanel;
