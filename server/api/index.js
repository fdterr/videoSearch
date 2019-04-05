const router = require('express').Router();
const axios = require('axios');
const {Player} = require('../db/models');
module.exports = router;

router.use('/users', require('./users'));
router.use('/teams', async (req, res, next) => {
  try {
    const {data} = await axios.get('http://statsapi.mlb.com/api/v1/teams');
    const allTeams = data.teams;
    console.log('data is', typeof data);
    const teams = [];
    allTeams.forEach(team => {
      // for (let team in data) {
      // console.log('team is', team);
      const id = team.league.id;
      if (id === 104 || id === 103) {
        teams.push(team.id);
      }
    });
    res.json(teams);
  } catch (err) {
    next(err);
  }
});

router.get('/createList', async (req, res, next) => {
  const teams = await getTeams();
  // console.log('teams is', teams);
  const players = [];
  for (let i = 0; i < teams.length; i++) {
    const id = teams[i];
    const {data} = await axios.get(
      `http://statsapi.mlb.com/api/v1/teams/${id}/roster/fullSeason?season=2019`
    );
    const roster = data.roster;

    await roster.forEach(async player => {
      const newPlayer = {
        playerId: player.person.id,
        fullName: player.person.fullName,
        team: teams[i],
        season: 2019
      };

      await Player.findOrCreate({
        where: {playerId: player.person.id},
        defaults: {...newPlayer}
      });
    });
  }
});

router.get('/players', async (req, res, next) => {
  try {
    const players = await Player.findAll();
    // console.log('players are', players);
    res.json(players);
  } catch (err) {
    next(err);
  }
});

router.get('/player/:id/games', async (req, res, next) => {
  const games = await getPlayerGames(req.params.id, 'pitching', '2019');
  res.json(games);
});

router.get('/player/:id/content', async (req, res, next) => {
  const games = await getPlayerGames(req.params.id, 'pitching', '2019');
  const content = await getPlayerContent('Jacob deGrom', 567365);
  res.json(content);
});

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

const getTeams = async () => {
  const {data} = await axios.get('http://statsapi.mlb.com/api/v1/teams');
  const allTeams = data.teams;
  console.log('data is', typeof data);
  const teams = [];
  await allTeams.forEach(team => {
    // for (let team in data) {
    // console.log('team is', team);
    const id = team.league.id;
    if (id === 104 || id === 103) {
      teams.push(team.id);
    }
  });
  return teams;
};

const getPlayerGames = async (player, group, season) => {
  const {data} = await axios.get(
    `http://statsapi.mlb.com/api/v1/people/${player}/stats?stats=gameLog&season=${season}`
  );
  // console.log('data is', data);
  const splits = data.stats[0].splits;
  const games = [];
  splits.forEach(game => {
    const gamePk = game.game.gamePk;
    games.push(gamePk);
  });
  return games;
};

const getPlayerContent = async (player, game) => {
  let highlights = [];

  const {data} = await axios.get(
    `http://statsapi.mlb.com/api/v1/game/${game}/content`
  );
  const content = data.highlights.highlights.items;
  // console.log('player conent data is', content);
  for (let i = 0; i < content.length; i++) {
    const highlight = content[i];
    if (highlight.type === 'video') {
      console.log(highlight.description.includes(player));
      if (highlight.description.includes(player) !== 0) {
        highlights.push(highlight);
      }
    }
  }
  console.log('highlights are', highlights);
  return highlights;
};
