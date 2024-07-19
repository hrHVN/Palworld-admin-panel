const router = require('express').Router();
const R = require('ramda');
const { fetchData, config, bodyConf } = require('../utils/fetchData.js');
const { updatePlayerStatus, playerLogFile } = require('../utils/playerLogData.js');

router.get('/', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        players = players.players || [{ name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 }];
    
        players.forEach(updatePlayerStatus);

        console.info('GET /: [info, metrics, players]', info, metrics, players, playerLogFile);

        res.render('index', { info, metrics, players, playerLogFile });
    }
    catch (err) {
        next(err)
    }
});

/*
// Endpoint to supply the map feture with player data. 
// Goal -> provide semi-live player location on the map.
router.get('/map', async (req, res, next) => {
try {
    
} catch (error) {
    next
}
});
*/

module.exports = router;