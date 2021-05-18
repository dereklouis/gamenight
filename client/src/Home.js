import { useState, useEffect } from 'react';
import axios from 'axios';
import calculateVotingPlaces from './calculateVotingPlaces';
import './styles/Home.css';

const Home = (props) => {
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
    props.socket.on('DB-Refresh', function (data) {
      console.log('$$$$', data);
      loadGameData();
    });
  }, []);

  const handleVote = async (e) => {
    if (votedGames.includes(e.currentTarget.id)) {
      let gameName = e.currentTarget.id;
      await axios.put(`/api/users/vote/${userNameLS}`, {
        vote: '-',
        game: gameName,
      });
      await axios.put(`/api/games/${gameName}`, {
        vote: '-',
      });
    } else if (votesRemaining > 0 && !votedGames.includes(e.currentTarget.id)) {
      let gameName = e.currentTarget.id;
      await axios.put(`/api/users/vote/${userNameLS}`, {
        vote: '+',
        game: gameName,
      });
      await axios.put(`/api/games/${gameName}`, {
        vote: '+',
      });
    } else if (
      votesRemaining <= 0 &&
      !votedGames.includes(e.currentTarget.id)
    ) {
      const voteDisplay = document.getElementById('voteCount');
      voteDisplay.className = '';
      void voteDisplay.offsetWidth;
      voteDisplay.className = 'emphasize';
    }
    props.socket.emit('DB-Update');
  };

  const votingResults = calculateVotingPlaces(gameData);

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
              {votingResults[0].includes(game.name) && (
                <img
                  src="/firstPlace.png"
                  alt="First Place"
                  className="medal"
                />
              )}
              {votingResults[1].includes(game.name) && (
                <img
                  src="/secondPlace.png"
                  alt="Second Place"
                  className="medal"
                />
              )}
              {votingResults[2].includes(game.name) && (
                <img
                  src="/thirdPlace.png"
                  alt="Third Place"
                  className="medal"
                />
              )}
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
            <div className="namePhotoWrapper" key={user.name}>
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
