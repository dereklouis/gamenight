import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const userNameLS = localStorage.getItem('userNameLS');

  const [gameData, updateGameData] = useState(['initial state']);

  const [votedGames, voteForAGame] = useState([]);

  const [votesRemaining, updateVoteCount] = useState(3);

  const [usersAttending, updateUsersAttending] = useState([]);

  const [gameKeys, updateGameKeys] = useState({});

  const loadGameData = async () => {
    const gameData = await axios.get('/api/games');
    const sortedData = gameData.data.sort(function (a, b) {
      let nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    updateGameData(sortedData);
    const allUsers = await axios.get('/api/users');
    const sortedAttendingUsers = allUsers.data
      .filter((user) => user.attending === 'yes')
      .sort(function (a, b) {
        let nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    updateUsersAttending(sortedAttendingUsers);
    const currentUser = allUsers.data.filter(
      (user) => user.name === userNameLS
    )[0];
    voteForAGame(currentUser.votedFor);
    updateVoteCount(currentUser.votesRemaining);
    const gameKeysFromDb = await axios.get('/api/keys');
    updateGameKeys(gameKeysFromDb.data);
  };

  useEffect(() => {
    console.log('Home useEffect triggered!');
    loadGameData();
  }, []);

  //   setInterval(() => {
  //     console.log('interval ran');
  //     loadGameData();
  //   }, 10000);

  const handleVote = async (e) => {
    if (votedGames.includes(e.currentTarget.id)) {
      let gameName = e.currentTarget.id;
      const votedGamesFromDB = await axios.put(
        `/api/users/vote/${userNameLS}`,
        {
          vote: '-',
          game: gameName,
        }
      );
      voteForAGame(votedGamesFromDB.data);
      updateVoteCount(votesRemaining + 1);
      const gameData = await axios.put(`/api/games/${gameName}`, {
        vote: '-',
      });
      const sortedGameData = gameData.data.sort(function (a, b) {
        let nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      updateGameData(sortedGameData);
    } else if (votesRemaining > 0 && !votedGames.includes(e.currentTarget.id)) {
      let gameName = e.currentTarget.id;
      const votedGamesFromDB = await axios.put(
        `/api/users/vote/${userNameLS}`,
        {
          vote: '+',
          game: gameName,
        }
      );
      voteForAGame(votedGamesFromDB.data);
      updateVoteCount(votesRemaining - 1);
      const gameData = await axios.put(`/api/games/${gameName}`, {
        vote: '+',
      });
      const sortedGameData = gameData.data.sort(function (a, b) {
        let nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      updateGameData(sortedGameData);
    } else if (
      votesRemaining <= 0 &&
      !votedGames.includes(e.currentTarget.id)
    ) {
      const voteDisplay = document.getElementById('voteCount');
      voteDisplay.className = '';
      void voteDisplay.offsetWidth;
      voteDisplay.className = 'emphasize';
    }
  };
  console.log('Component Rendered');
  return (
    <>
      <div id="zoomDiv" className="flexColumn">
        <p id="zoom">Zoom Link:</p>
        <a target="blank" href={gameKeys.link || 'https://zoom.us/'} id="link">
          {gameKeys.link || 'loading...'}
        </a>
      </div>
      <h3 id="instruction">Vote for what game you want to play!</h3>
      <p id="voteCount">
        You have <span style={{ fontWeight: 'bold' }}>{votesRemaining}</span>{' '}
        votes remaining
      </p>
      <div id="gameVote">
        {gameData[0] !== 'initial state' &&
          gameData.map((game) => (
            <div
              className="singleGameDiv flexColumn"
              style={{
                backgroundColor: votedGames.includes(game.path)
                  ? 'rgb(141, 218, 86)'
                  : 'rgba(184, 184, 184, 0.446)',
              }}
              key={game.path}
              id={game.path}
              onClick={handleVote}
            >
              <h5 className="gameTitle">{game.name}</h5>
              <p className="votes">Votes: {game.voteCount}</p>
              <img
                src={`${game.path}.jpg`}
                alt={`${game.name} Art`}
                className="gameImg"
              />
            </div>
          ))}
      </div>
      <div id="attendanceList" className="flexColumn">
        <h2>{usersAttending.length} Players Tonight:</h2>
        {usersAttending.map((user) => (
          <div id="nameContainer" key={user.name}>
            <p id="listName">{user.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
