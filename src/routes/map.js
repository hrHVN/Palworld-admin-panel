const router = require('express').Router();
const R = require('ramda');
const { fetchData, config } = require('../utils/fetchData.js');
const { updatePlayerStatus, playerLogFile } = require('../utils/playerLogData.js');
const { sendSshComand, sshComands } = require('../utils/ssh2.js');
const organizeLogData = require('../utils/organizeLogData.js');


router.get('/', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };


        console.info('GET /map: [info, metrics]', info, metrics);

        res.render('map_view', { info, metrics });
    }
    catch (err) {
        next(err)
    }
});

router.get('/live', async (req, res, next) => {
    let { players } = await fetchData(config('get', '/players'));
    let serverLog = await sendSshComand(sshComands.readLog);
    let log = organizeLogData(serverLog)

    log.arrayOfObjects.forEach(updatePlayerStatus);

    if (players.length != 0) players.forEach(updatePlayerStatus);

    let data = Object.values(playerLogFile);
    // console.log(players);

    res.status(200).send({ players: data });
});

module.exports = router;