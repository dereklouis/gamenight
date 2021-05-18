import { useState, useEffect } from 'react';
import './styles/App.css';
import axios from 'axios';
import Welcome from './Welcome';
import Attending from './Attending';
import WaitingRoom from './WaitingRoom';
import Home from './Home';
import AdminAccessPanel from './AdminAccessPanel';

function App(props) {
  const userNameLS = localStorage.getItem('userNameLS');

  const [attending, updateAttending] = useState('n/a');

  const [gameStatus, updateGameStatus] = useState(false);

  const [adminAccess, updateAdminAccess] = useState(false);

  const [fetchedUsers, updateFetchedUsers] = useState([]);

  if (!gameStatus && window.fetchGameData) {
    clearInterval(window.fetchGameData);
    window.fetchGameData = undefined;
  }

  const getUserFromDb = async () => {
    if (userNameLS) {
      const user = await axios.get(`/api/users/${userNameLS}`);
      return user.data;
    } else {
      return 'n/a';
    }
  };

  const loadData = async () => {
    const data = await getUserFromDb();
    if (data !== 'n/a') {
      updateAttending(data.attending);
      const keysFromDb = await axios.get('/api/keys');
      updateGameStatus(keysFromDb.data.gameActive);
      const fetchUsers = await axios.get('/api/users');
      const sortedAttendingUsers = fetchUsers.data
        .filter((user) => user.attending === 'yes')
        .sort(function (a, b) {
          let nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      updateFetchedUsers(sortedAttendingUsers);
    }
  };

  useEffect(() => {
    console.log('use effect');
    props.socket.on('DB-Refresh', function (data) {
      loadData();
    });
    if (userNameLS) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (adminAccess) {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      window.scrollTo(0, 0);
    }
  }, [adminAccess]);

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

  console.log('render');

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
              loadData={loadData}
              socket={props.socket}
            />
          )}
          {attending === 'no' && <h3>See you next time!</h3>}
          {attending === 'yes' && !gameStatus && (
            <>
              <div id="waitingDiv">
                <h2 id="waitingLabel">Waiting for host to open the room</h2>
                <div className="dot-flashing"></div>
              </div>
              <WaitingRoom fetchedUsers={fetchedUsers} socket={props.socket} />
            </>
          )}
          {attending === 'yes' && gameStatus && (
            <>
              <Home getUserFromDb={getUserFromDb} socket={props.socket} />
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
          socket={props.socket}
        />
      )}
    </div>
  );
}

export default App;
