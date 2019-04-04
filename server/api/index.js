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

router.use('/players', async (req, res, next) => {
  try {
    // const teams = await getTeams();
    // console.log('teams is', teams);
    // const players = [];
    // for (let i = 0; i < teams.length; i++) {
    //   const id = teams[i];
    //   const {data} = await axios.get(
    //     `http://statsapi.mlb.com/api/v1/teams/${id}/roster/fullSeason?season=2019`
    //   );
    //   const roster = data.roster;

    //   await roster.forEach(async player => {
    //     const newPlayer = {
    //       playerId: player.person.id,
    //       fullName: player.person.fullName,
    //       team: teams[i],
    //       season: 2019
    //     };

    //     await Player.findOrCreate({
    //       where: {playerId: player.person.id},
    //       defaults: {...newPlayer}
    //     });
    //   });
    // }
    const players = await Player.findAll();
    // console.log('players are', players);
    res.json(players);
  } catch (err) {
    next(err);
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
