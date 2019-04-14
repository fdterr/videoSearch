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
  try {
    const games = await getPlayerGames(
      req.params.id,
      'pitching',
      req.params.season
    );

    res.json(games);
  } catch (err) {
    next(err);
  }
});

router.put('/player/:id/content', async (req, res, next) => {
  const games = req.body;
  let content = [];
  for (let i = 0; i < games.length; i++) {
    const {fullName} = await getPlayer(req.params.id);
    // console.log('fullName is', fullName);
    const highlights = await getPlayerContent(
      // await getPlayer(req.params.id).fullName,
      fullName,
      games[i]
    );
    content.push(highlights);
  }
  // console.log('content is', content[0].length, content[1].length);
  console.log('content is', content);
  res.json(content);
});

router.get('/createList', async (req, res, next) => {
  console.log('creating list');
  const teams = await getTeams();
  const players = [];
  for (let i = 0; i < teams.length; i++) {
    const id = teams[i];
    const {data} = await axios.get(
      `http://statsapi.mlb.com/api/v1/teams/${id}/roster/fullSeason?season=2019`
    );
    const roster = data.roster;

    await roster.forEach(async player => {
      const {debutDate} = await getPlayer(player.person.id);
      const newPlayer = {
        playerId: player.person.id,
        fullName: player.person.fullName,
        team: teams[i],
        season: 2019,
        debutDate
      };
      players.push(newPlayer);

      await Player.findOrCreate({
        where: {playerId: player.person.id},
        defaults: {...newPlayer}
      });
    });
  }
  res.status(201).send(players);
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
  console.log('got teams');
  return teams;
};

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

const getPlayerGames = async (player, group, season) => {
  try {
    const games = [];
    console.log('getting games of player', player);
    const debutYear = +await playerDebut(player);
    console.log('player debut year is', debutYear);
    while (season >= debutYear) {
      const seasonGames = [];
      console.log('getting games, season is', season);
      try {
        const {data} = await axios.get(
          `http://statsapi.mlb.com/api/v1/people/${player}/stats?stats=gameLog&season=${season--}`
        );
        const splits = data.stats[0].splits;
        splits.forEach(game => {
          const gamePk = game.game.gamePk;
          seasonGames.push(gamePk);
        });
        seasonGames.reverse();
        games.push.apply(games, seasonGames);
        // console.log('seasonGames are', seasonGames);
        // season--;
      } catch (err) {
        console.error(err);
      }
    }
    return games;
  } catch (err) {
    return {error: 'No games'};
  }
};

const allPlayerGames = async player => {
  try {
    //something
  } catch (err) {
    console.error(err);
  }
};

const playerDebut = async player => {
  try {
    console.log('trying to find player', player);
    const {debutDate} = await Player.findOne({where: {playerId: player}});
    return debutDate.split('-')[0];
  } catch (err) {
    console.error(err);
  }
};

const getPlayerContent = async (player, game) => {
  // console.log('looking for name', player);
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

const getPlayer = async playerId => {
  const {data} = await axios.get(
    `http://statsapi.mlb.com/api/v1/people/${playerId}`
  );
  return {
    fullName: data.people[0].fullName,
    debutDate: data.people[0].mlbDebutDate
  };
};
