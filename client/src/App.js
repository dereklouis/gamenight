import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Welcome from './Welcome';
import Attending from './Attending';
import WaitingRoom from './WaitingRoom';
import Home from './Home';
import AdminAccessPanel from './AdminAccessPanel';

function App() {
  const userNameLS = localStorage.getItem('userNameLS');

  const [attending, updateAttending] = useState('n/a');

  const [gameStatus, updateGameStatus] = useState(false);

  const [adminAccess, updateAdminAccess] = useState(false);

  if (!gameStatus && window.fetchGameData) {
    clearInterval(window.fetchGameData);
    window.fetchGameData = undefined;
  }

  const getUserFromDb = async () => {
    if (userNameLS) {
      const user = await axios.get(`/api/users/${userNameLS}`);
      return user.data;
    }
  };

  useEffect(() => {
    if (userNameLS) {
      const mountFromDb = async () => {
        const data = await getUserFromDb();
        updateAttending(data.attending);
        const keysFromDb = await axios.get('/api/keys');
        updateGameStatus(keysFromDb.data.gameActive);
      };
      mountFromDb();
    }
  }, []);

  let keyListenerObj = {
    Control: false,
    g: false,
    n: false,
  };

  const keyListener = (e) => {
    const targets = ['Control', 'g', 'n'];
    if (targets.includes(e.key) && e.type === 'keydown') {
      keyListenerObj[e.key] = true;
    } else if (targets.includes(e.key) && e.type === 'keyup') {
      keyListenerObj[e.key] = false;
    }
    const status = Object.values(keyListenerObj);
    if (!status.includes(false)) {
      updateAdminAccess(!adminAccess);
    }
  };

  const checkForStatusTrue = async () => {
    if (
      attending === 'yes' &&
      !gameStatus &&
      window.checkForRoomOpen === undefined
    ) {
      window.checkForRoomOpen = setInterval(async () => {
        const fetch = await axios.get('/api/keys');
        const currentStatus = fetch.data.gameActive;
        console.log('Checking to see if room has opened...');
        if (currentStatus) {
          updateGameStatus(currentStatus);
        }
      }, 5000);
    } else if (attending === 'yes' && gameStatus && window.checkForRoomOpen) {
      clearInterval(window.checkForRoomOpen);
      window.checkForRoomOpen = undefined;
    }
  };

  const checkIfGameHasEnded = async () => {
    if (userNameLS) {
      if (
        attending === 'yes' &&
        gameStatus &&
        window.checkForRoomClose === undefined
      ) {
        window.checkForRoomClose = setInterval(async () => {
          const fetch = await axios.get('/api/keys');
          const data = await getUserFromDb();
          const currentStatus = fetch.data.gameActive;
          console.log('Checking to see if room has closed...');
          if (!currentStatus && data.attending === 'n/a') {
            updateAttending(data.attending);
            updateGameStatus(currentStatus);
          } else if (!currentStatus) {
            updateGameStatus(currentStatus);
          }
        }, 30000);
      } else if (
        attending === 'n/a' &&
        !gameStatus &&
        window.checkForRoomClose
      ) {
        clearInterval(window.checkForRoomClose);
        window.checkForRoomClose = undefined;
      }
    }
  };

  checkForStatusTrue();
  checkIfGameHasEnded();

  return (
    <div id="App" tabIndex="0" onKeyDown={keyListener} onKeyUp={keyListener}>
      <h1 id="title">Game Night</h1>
      <h2 id="tag">Monday Nights, 7:30 EST</h2>
      <hr />
      {userNameLS ? (
        <div className="flexColumn">
          <h3 id="hello">Hello {userNameLS}!</h3>
          {attending === 'n/a' && (
            <Attending
              attending={attending}
              updateAttending={updateAttending}
              userNameLS={userNameLS}
              getUserFromDb={getUserFromDb}
            />
          )}
          {attending === 'no' && <h3>See you next time!</h3>}
          {attending === 'yes' && !gameStatus && (
            <>
              <div id="waitingDiv">
                <h2 id="waitingLabel">Waiting for host to open the room</h2>
                <div className="dot-flashing"></div>
              </div>
              <WaitingRoom />
            </>
          )}
          {attending === 'yes' && gameStatus && (
            <>
              <Home getUserFromDb={getUserFromDb} />
            </>
          )}
        </div>
      ) : (
        <Welcome />
      )}
      {adminAccess && (
        <AdminAccessPanel
          updateGameStatus={updateGameStatus}
          updateAttending={updateAttending}
        />
      )}
    </div>
  );
}

export default App;
