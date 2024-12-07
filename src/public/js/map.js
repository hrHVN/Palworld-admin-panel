const mapDimensions = {
    width: 2200,
    height: 2200,
    // ratio: 1.46,
    ratio: 2200 / 2200,
    img: '/img/Palpagos_Island_temp.png',
}

document.addEventListener('DOMContentLoaded', () => {
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let startDragOffsetX = 0;
    let startDragOffsetY = 0;
    let isDragging = false;
    let players = [];
    // Draw the map and players
    let canvas = document.getElementById('gameMapCanvas');
    let ctx = canvas.getContext('2d');
    let tooltip = document.getElementById('tooltip');
    let mapImage = new Image();
    mapImage.src = mapDimensions.img;

    mapImage.onload = () => {
        resizeCanvas(canvas);
        // drawMap(ctx, mapImage);
        updatePlayerPositions(ctx, players, canvas, mapImage)
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
        // drawMap(ctx, mapImage);
        updatePlayerPositions(ctx, players, canvas, mapImage)
    });

    canvas.addEventListener('mousemove', (event) => {
        handleMouseMove(event, canvas, players, tooltip);
    });

    // Handle zoom
    // canvas.addEventListener('wheel', event => {
    //     let mouseX = event.clientX - canvas.offsetLeft;
    //     let mouseY = event.clientY - canvas.offsetTop;
    //     let wheel = event.deltaY < 0 ? 1 : -1;
    //     let zoom = Math.exp(wheel * 0.1);
    //     ctx.translate(mouseX, mouseY);
    //     ctx.scale(zoom, zoom);
    //     ctx.translate(-mouseX, -mouseY);
    //     scale *= zoom;
    //     event.preventDefault();
    //     drawMap(ctx);
    // });

    // Handle drag start
    canvas.addEventListener('mousedown', event => {
        isDragging = true;
        startDragOffsetX = event.clientX - offsetX;
        startDragOffsetY = event.clientY - offsetY;
    });

    // Handle drag end
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Fetch data from the server
    fetch('/map/live')
        .then(response => response.json())
        .then(data => {
            // Destructure the data
            players = data.players;
            console.log('Data recieved: ', data)
            updatePlayerPositions(ctx, players, canvas, mapImage)
        })
        .catch(error => console.error('Error fetching data:', error));

    // refresh player positions
    setInterval(() => {
        console.log('Updating player pos...');

        fetch('/map/live')
            .then(response => response.json())
            .then(data => {
                players = data.players;
                console.log('Data recieved: ', data)
                updatePlayerPositions(ctx, players, canvas, mapImage)
            })
            .catch(error => console.error('Error fetching data:', error));

    }, 10 * 1000);
});

function resizeCanvas(canvas) {
    let container = document.getElementById('mapContainer');

    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth / mapDimensions.ratio;

    container.style.height = `${canvas.height}px`
}

function drawMap(ctx, mapImage) {
    let canvas = document.getElementById('gameMapCanvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

function updatePlayerPositions(ctx, players, canvas, mapImage) {
    drawMap(ctx, mapImage);
    drawPlayer(ctx, players, canvas);
}

function drawPlayer(ctx, players, canvas) {
    let scaleX = canvas.width / mapDimensions.width;
    let scaleY = canvas.height / mapDimensions.height;

    players.forEach(player => {
        const { x, y } = playerCoordsToCanvasCoords(player.location_x, player.location_y, scaleX, scaleY);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);

        ctx.fillStyle = '#FF0000';
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    });
}


function handleMouseMove(event, canvas, players, tooltip) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    let scaleX = canvas.width / mapDimensions.width;
    let scaleY = canvas.height / mapDimensions.height;

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

    if (found) {
        tooltip.style.display = 'block';
    } else {
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
    // console.log('transformCoordinates: ', x, y, playerX, playerY)
    return {
        x, y
    }
}