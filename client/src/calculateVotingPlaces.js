const calculateVotingPlaces = (gameData) => {
  let finalResults = ['n/a', 'n/a', 'n/a'];

  const gamesNoZero = gameData.filter((game) => game.voteCount > 0);

  if (gamesNoZero.length) {
    let gameVotes = {};

    for (let game of gamesNoZero) {
      if (gameVotes[game.voteCount] === undefined) {
        gameVotes[game.voteCount] = {
          gameCount: 1,
          gameNames: [game.name],
        };
      } else {
        gameVotes[game.voteCount].gameCount++;
        gameVotes[game.voteCount].gameNames.push(game.name);
      }
    }

    const places = Object.keys(gameVotes).sort((a, b) => b - a);

    if (places[0]) {
      finalResults[0] = gameVotes[places[0]].gameNames;
      // Old method for dealing with tie votes:
      // if (gameVotes[places[0]].gameCount === 1) {
      //   finalResults[0] = gameVotes[places[0]].gameNames[0];
      // }
      // else if (gameVotes[places[0]].gameCount > 1) {
      //   finalResults[0] = 'Tie Vote';
      // }
    }

    if (places[1]) {
      finalResults[1] = gameVotes[places[1]].gameNames;
      // Old method for dealing with tie votes:
      // if (gameVotes[places[1]].gameCount === 1) {
      //   finalResults[1] = gameVotes[places[1]].gameNames[0];
      // } else if (gameVotes[places[1]].gameCount > 1) {
      //   finalResults[1] = 'Tie Vote';
      // }
    }

    if (places[2]) {
      finalResults[2] = gameVotes[places[2]].gameNames;
      // Old method for dealing with tie votes:
      // if (gameVotes[places[2]].gameCount === 1) {
      //   finalResults[2] = gameVotes[places[2]].gameNames[0];
      // } else if (gameVotes[places[2]].gameCount > 1) {
      //   finalResults[2] = 'Tie Vote';
      // }
    }
  }
  return finalResults;
};

export default calculateVotingPlaces;
