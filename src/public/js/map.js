const mapDimensions = {
    width: 1500,
    height: 1500,
    // ratio: 1.46,
    ratio: 1500 / 1500 ,
    img: '/img/Palpagos_Island_temp.png',
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server
    fetch('/map/live')
        .then(response => response.json())
        .then(data => {
            // Destructure the data
            let { players } = data;

            // Draw the map and players
            let canvas = document.getElementById('gameMapCanvas');
            let ctx = canvas.getContext('2d');
            let tooltip = document.getElementById('tooltip');
            let mapImage = new Image();
            mapImage.src = mapDimensions.img;

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
                        let { players } = data;
                        console.log('Data recieved: ', data)
                        updatePlayerPositions(ctx, players, mapImage);
                    });
            }, 10 * 1000);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function resizeCanvas() {
    let canvas = document.getElementById('gameMapCanvas');
    let container = document.getElementById('mapContainer');

    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth / mapDimensions.ratio;

    container.style.height = `${canvas.height}px`
}

function drawMap(ctx, mapImage) {
    const canvas = document.getElementById('gameMapCanvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

function updatePlayerPositions(ctx, players, mapImage) {
    const canvas = document.getElementById('gameMapCanvas');
    const scaleX = canvas.width / mapDimensions.width;
    const scaleY = canvas.height / mapDimensions.height;

    drawMap(ctx, mapImage);

    players.forEach(player => {
        if (player.coords.x || player.coords.y) {
            let { x, y } = playerCoordsToCanvasCoords(player.coords.x, player.coords.y, scaleX, scaleY)
            drawPlayer(ctx, x, y);
        }
    });

}

function drawPlayer(ctx, x, y) {
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
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const scaleX = canvas.width / mapDimensions.width;
    const scaleY = canvas.height / mapDimensions.height;

    let found = false;
    players.forEach(player => {
        let { x, y } = playerCoordsToCanvasCoords(player.coords.x, player.coords.y, scaleX, scaleY);
        let distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));

        // console.log(player.playerName, x, y, player.coords)

        if (distance < 10) {
            found = true;
            tooltip.style.display = 'block';
            tooltip.style.left = `${mouseX + 15}px`;
            tooltip.style.top = `${mouseY + 15}px`;
            tooltip.innerHTML = `Name: ${player.playerName}<br>Level: ${player.level}<br>X: ${player.coords.x} Y: ${player.coords.y}`;
        }
    });

    if (!found) {
        tooltip.style.display = 'none';
    }
}

function playerCoordsToCanvasCoords(playerX, playerY, scaleX, scaleY) {
    const minX = -1000;
    const maxX = 1000;
    const minY = -1000;
    const maxY = 1000;

    let x = parseInt(((playerX - minX) / (maxX - minX)) * mapDimensions.width * scaleX);

    let y = parseInt(((maxY - playerY) / (maxY - minY)) * mapDimensions.height * scaleY);
    console.log('transformCoordinates: ', x, y, playerX, playerY)
    return {
        x, y
    }
}