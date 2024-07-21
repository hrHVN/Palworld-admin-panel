module.exports = playerCoordsToCanvasCoords = (location_x, location_y) => {
    const coords = {
        min_X: -582888,
        max_X: 335112,
        min_Y: -301000,
        max_Y: 617000
    };

    // sqrt((-582888 – 335112)² + (-301000 – 617000)²)
    let transl_x = 123888;
    // sqrt((-1000 – 1000)² + (-1000 – 1000)²) 
    let transl_y = 158000;
    // transl_x / transl_y 
    let scale = 459;

    /**
     *  Convert coordinates from the system in .sav files to in-game coordinate system in Paldex
     */
    let palDekcY = ((location_x + transl_x) / scale);
    let palDeckX = ((location_y - transl_y) / scale);

    /**
     * Convert coordinates from the in-game coordinates system in Paldex to the system in .sav files
     */
    let savX = (palDekcY * scale) - transl_x;
    let savY = (palDeckX * scale) - transl_y;

    // Goal { location_x: -126110.921875,location_y: -96506.96875 } => palDeck [x,y] = (-554, 8)
    // console.log(`Paldeck (x,y): (${palDeckX}, ${palDekcY}) \n.sav (x,y): (${savX},${savY})`);

    return {
        x: parseInt(palDeckX),
        y: parseInt(palDekcY),
        savX,
        savY
    }
}