const router = require('express').Router();
const axios = require('axios');
const {Player} = require('../db/models');
module.exports = router;

router.use('/users', require('./users'));
router.use('/teams', async (req, res, next) => {
  try {
    const {data} = await axios.get('http://statsapi.mlb.com/api/v1/teams');
    const allTeams = data.teams;
    const teams = [];
    allTeams.forEach(team => {
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

router.get('/players', async (req, res, next) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (err) {
    next(err);
  }
});

router.get('/player/:id/games/:season', async (req, res, next) => {
  const games = await getPlayerGames(
    req.params.id,
    'pitching',
    req.params.season
  );
  res.json(games);
});

router.put('/player/:id/content', async (req, res, next) => {
  // const games = await getPlayerGames(req.params.id, 'pitching', '2018');
  const games = req.body;
  console.log('games are', games);
  let content = [];
  for (let i = 0; i < games.length; i++) {
    const highlights = await getPlayerContent('Jacob deGrom', games[i]);
    content.push(highlights);
  }
  res.json(content);
});

router.get('/createList', async (req, res, next) => {
  const teams = await getTeams();
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

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

const getTeams = async () => {
  const {data} = await axios.get('http://statsapi.mlb.com/api/v1/teams');
  const allTeams = data.teams;
  const teams = [];
  await allTeams.forEach(team => {
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
  for (let i = 0; i < content.length; i++) {
    const highlight = content[i];
    try {
      if (highlight.type === 'video') {
        if (highlight.description.includes(player)) {
          highlights.push(highlight);
        }
      }
    } catch (err) {
      console.error('error!', highlight);
    }
  }
  return highlights;
};
