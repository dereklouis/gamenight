import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Home.css';

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
    loadGameData();
    if (window.fetchGameData === undefined) {
      window.fetchGameData = setInterval(() => {
        console.log('Fetching game data...');
        loadGameData();
      }, 7000);
    }
  }, []);

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

  return (
    <>
      <div id="zoomDiv" className="flexColumn">
        <div className="flexColumn">
          <p id="zoom">Zoom Link:</p>
          <a
            target="blank"
            href={gameKeys.link || 'https://zoom.us/'}
            id="link"
          >
            {gameKeys.link || 'loading...'}
          </a>
        </div>
      </div>
      {gameKeys.roomCode && (
        <div className="flexColumn">
          <p id="roomCodeTitle">Room Code:</p>
          <p id="roomCode">{gameKeys.roomCode}</p>
        </div>
      )}
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
                  ? 'rgba(121, 206, 61, 0.866)'
                  : 'rgba(245, 245, 245, 0.846)',
              }}
              key={game.path}
              id={game.path}
              onClick={handleVote}
            >
              <div className="gameTitleContainer">
                <h5 className="gameTitle">{game.name}</h5>
              </div>

              <p className="votes">Votes: {game.voteCount}</p>
              <img
                src={`/gamePhotos/${game.path}.jpg`}
                alt={`${game.name} Art`}
                className="gameImg"
              />
            </div>
          ))}
      </div>
      <div id="attendanceList" className="flexColumn">
        <h2>{usersAttending.length} Players Tonight:</h2>
        <div id="alignmentWrapper" className="flexColumn">
          {usersAttending.map((user) => (
            <div className="namePhotoWrapper">
              <img
                src={`/gameDogs/gameDog${user.photoID}.png`}
                alt="gameDog"
                className="gameDogPhoto"
              />
              <div className="nameContainer" key={user.name}>
                <p className="listName">{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
