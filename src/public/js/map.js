document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server
    fetch('/map/live')
        .then(response => response.json())
        .then(data => {
            // Destructure the data
            const { players } = data;

            // Draw the map and players
            const canvas = document.getElementById('gameMapCanvas');
            const ctx = canvas.getContext('2d');
            const tooltip = document.getElementById('tooltip');
            const mapImage = new Image();
            mapImage.src = '/img/Palpagos_Islands.webp';

            mapImage.onload = () => {
                resizeCanvas();
                drawMap(ctx, mapImage);
                updatePlayerPositions(ctx, players, mapImage);
            };

            window.addEventListener('resize', () => {
                resizeCanvas();
                drawMap(ctx, mapImage);
                updatePlayerPositions(ctx, players, mapImage);
            });

            canvas.addEventListener('mousemove', (event) => {
                handleMouseMove(event, canvas, players, tooltip);
            });

            setInterval(() => {
                console.log('Updating player pos...');

                fetch('/map/live')
                    .then(response => response.json())
                    .then(data => {
                        const { players } = data;
                        console.log('Data recieved: ', data)
                        updatePlayerPositions(ctx, players, mapImage);
                    });
            }, 10 * 1000);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function resizeCanvas() {
    const canvas = document.getElementById('gameMapCanvas');
    const container = document.getElementById('mapContainer');
    let aspectRatio = 2200 / 1500;

    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth / aspectRatio;

    container.style.height = `${canvas.height}px`
}

function drawMap(ctx, mapImage) {
    const canvas = document.getElementById('gameMapCanvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

function updatePlayerPositions(ctx, players, mapImage) {
    const canvas = document.getElementById('gameMapCanvas');
    const scaleX = canvas.width / 2200;
    const scaleY = canvas.height / 1500;
    drawMap(ctx, mapImage);

    players.forEach(player => {
        if (player.location_x || player.location_y) drawPlayer(ctx, player, scaleX, scaleY);
    });
}

function drawPlayer(ctx, player, scaleX, scaleY) {
    let { location_x, location_y } = player;
    let { x, y } = transformCoordinates(location_x, location_y, scaleX, scaleY);
    // console.log('draw player: ', x, y)
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);

    ctx.fillStyle = '#FFD700';
    ctx.fill();

    ctx.lineWidth = 2;

    ctx.strokeStyle = '#C0C0C0';
    ctx.stroke();
}

function handleMouseMove(event, canvas, players, tooltip) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const scaleX = canvas.width / 2200;
    const scaleY = canvas.height / 1500;

    let found = false;
    players.forEach(player => {
        let { location_x, location_y } = player;
        let { x: playerX, y: playerY } = transformCoordinates(location_x, location_y, scaleX, scaleY);
        let distance = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));

        // console.log(player.playerName, x, y)

        if (distance < 10) {
            found = true;
            tooltip.style.display = 'block';
            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
            tooltip.innerHTML = `Name: ${player.name}<br>Level: ${player.level}<br>X: ${location_x} Y: ${location_y}`;
        }
    });

    if (!found) {
        tooltip.style.display = 'none';
    }
}

function transformCoordinates(location_x, location_y, scaleX, scaleY) {
    /* const minX = -582888.0;
    const maxX = 335112.0;

    const minY = -301000.0;
    const maxY = 617000.0;
    
    const x = ((location_x - minX) / (maxX - minX)) * 2200 * scaleX;
    const y = ((maxY - location_y) / (maxY - minY)) * 1500 * scaleY; */
    
    let transl_x = 123888;
    let transl_y = 158000;
    let _scale = 459;

    // Convert from ingame .sav files to map coords
    let x = ((location_x + transl_x) / _scale);
    let y = ((location_y + transl_y) / _scale);
    // goal -531, 33
    console.log(x,y);
    return {
        x: x,
        y: y,
    }
}