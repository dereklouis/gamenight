import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAccessPanel = (props) => {
  console.log('panel rendered');

  const [gameKeys, updateGameKeys] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const fetchKeys = await axios.get('/api/keys');
      updateGameKeys(fetchKeys.data);
    };
    fetch();
  }, []);

  const sendLink = async () => {
    const zoomLink = document.getElementById('zoomLinkInput');
    await axios.put('/api/keys/zoomlink', {
      link: zoomLink.value,
    });
    zoomLink.value = '';
  };

  const sendRoomCode = async () => {
    const roomCode = document.getElementById('roomCodeInput');
    await axios.put('/api/keys/roomcode', {
      roomCode: roomCode.value,
    });
    roomCode.value = '';
  };

  const toggleStatus = async () => {
    const newStatus = await axios.put('/api/keys/gamestatus');
    let stateCopy = { ...gameKeys };
    stateCopy.gameActive = newStatus.data;
    updateGameKeys(stateCopy);
    props.updateGameStatus(newStatus.data);
  };

  const reset = async () => {
    await axios.patch('/api/users/reset');
    await axios.patch('/api/games/reset');
    await axios.patch('/api/keys/reset');
    props.updateGameStatus(false);
    props.updateAttending('n/a');
    console.log('Game Night has been reset!');
  };

  return (
    <div id="aAPContainer" className="flexColumn">
      <h1>Admin Access Panel</h1>
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
