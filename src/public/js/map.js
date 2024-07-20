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
                updatePlayerPositions(ctx, players);
            };

            window.addEventListener('resize', () => {
                resizeCanvas();
                drawMap(ctx, mapImage);
                updatePlayerPositions(ctx, players);
            });

            canvas.addEventListener('mousemove', (event) => {
                handleMouseMove(event, canvas, ctx, players, tooltip);
            });

            setInterval(() => {
                console.log('Updating player pos...');

                fetch('/map/live')
                    .then(response => response.json())
                    .then(data => {
                        const { players } = data;
                        console.log('Data recieved: ', data)
                        updatePlayerPositions(ctx, players);
                    });
            }, 60 * 1000);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function resizeCanvas() {
    const canvas = document.getElementById('gameMapCanvas');
    const container = document.getElementById('mapContainer');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function drawMap(ctx, mapImage) {
    const canvas = document.getElementById('gameMapCanvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

function updatePlayerPositions(ctx, players) {
    const canvas = document.getElementById('gameMapCanvas');
    const scaleX = canvas.width / 2200;
    const scaleY = canvas.height / 2000;
    players.forEach(player => {
        if (player.location_x || player.location_y) drawPlayer(ctx, player, scaleX, scaleY);
    });
}

function drawPlayer(ctx, player, scaleX, scaleY) {
    const { location_x, location_y } = player;
    ctx.beginPath();
    ctx.arc(location_x * scaleX, location_y * scaleY, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#C0C0C0';
    ctx.stroke();
}

function handleMouseMove(event, canvas, ctx, players, tooltip) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const scaleX = canvas.width / 2200;
    const scaleY = canvas.height / 2000;

    players.forEach(player => {
        const playerX = player.location_x * scaleX;
        const playerY = player.location_y * scaleY;
        const distance = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
        if (distance < 10) {
            tooltip.style.display = 'block';
            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
            tooltip.innerHTML = `Name: ${player.name}<br>Level: ${player.level}<br>X: ${player.location_x} Y: ${player.location_y}`;
            return;
        }
    });

    tooltip.style.display = 'none';
}