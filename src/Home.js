import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [gameData, updateGameData] = useState(['initial state']);

  useEffect(() => {
    if (gameData[0] === 'initial state') {
      console.log('Home useEffect triggered!');
      const loadGameData = async () => {
        const data = await axios.get('/api/games');
        const sortedData = data.data.sort(function (a, b) {
          var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        updateGameData(sortedData);
      };
      loadGameData();
    }
  }, []);

  const [votedGames, voteForAGame] = useState([]);

  const [votesRemaining, updateVoteCount] = useState(3);

  const handleVote = async (e) => {
    if (votedGames.includes(e.currentTarget.id)) {
      voteForAGame(votedGames.filter((game) => game !== e.currentTarget.id));
      updateVoteCount(votesRemaining + 1);
      const gameData = await axios.put(`/api/games/${e.currentTarget.id}`, {
        vote: '-',
      });
      const sortedGameData = gameData.data.sort(function (a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      updateGameData(sortedGameData);
    } else if (votesRemaining > 0 && !votedGames.includes(e.currentTarget.id)) {
      voteForAGame([...votedGames, e.currentTarget.id]);
      updateVoteCount(votesRemaining - 1);
      const gameData = await axios.put(`/api/games/${e.currentTarget.id}`, {
        vote: '+',
      });
      const sortedGameData = gameData.data.sort(function (a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      updateGameData(sortedGameData);
    }
  };
  console.log('gameData State--->', gameData);
  return (
    <>
      <div id="zoomDiv" className="flexColumn">
        <p id="zoom">Zoom Link:</p>
        <a target="blank" href="https://zoom.us/" id="link">
          https://us02web.zoom.us/j/86285028379?pwd=aURVY2tRUUd3WnZRS3ltTWtlWFhNZz09
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
    </>
  );
};

export default Home;
