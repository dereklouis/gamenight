import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Welcome from './Welcome';
import Attending from './Attending';
import Home from './Home';

function App() {
  const userNameLS = localStorage.getItem('userNameLS');

  const [attending, updateAttending] = useState('n/a');

  const getUserFromDb = async () => {
    if (userNameLS) {
      const user = await axios.get(`/api/users/${userNameLS}`);
      return user.data;
    }
  };

  useEffect(() => {
    console.log('use effect fired!');
    if (userNameLS) {
      const mountFromDb = async () => {
        const data = await getUserFromDb();
        console.log('User Data from DB--->', data);
        if (attending !== data.attending) {
          updateAttending(data.attending);
        }
      };
      mountFromDb();
    }
  }, []);

  return (
    <div id="App">
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
          {attending === 'yes' && <Home getUserFromDb={getUserFromDb} />}
        </div>
      ) : (
        <Welcome />
      )}
    </div>
  );
}

export default App;
