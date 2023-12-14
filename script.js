const adjacent_list = {1: [2, 5],
              2: [1, 3, 6],
              3: [2, 4, 7],
              4: [3, 8],
              5: [1, 6, 9],
              6: [2, 5, 7, 10],
              7: [3, 6, 8, 11],
              8: [4, 7, 12],
              9: [5, 10, 13],
              10: [6, 9, 11, 14],
              11: [7, 10, 12, 15],
              12: [8, 11, 16],
              13: [9, 14],
              14: [10, 13, 15],
              15: [11, 14, 16],
              16: [12, 15]};
function generateRandomNumber() {
// Generate a random decimal between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale the random decimal to the range [10000000, 99999999]
    const randomNumberInRange = Math.floor(randomDecimal * 90000000) + 10000000;

    return randomNumberInRange;
}

const socket = io('http://10.74.115.115:5000');

let player_position;
const player_id = generateRandomNumber();
const player_name = generateRandomNumber();
let flag = false;
// Handle connect event
socket.on('connect', () => {
    console.log('Connected to the server');
    // You can perform any additional setup or join the game here...
    // socket.emit("create_game", {player_id: player_id, player_name: player_name});
    socket.emit("game_state");
});


// Handle disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
    // Handle disconnection logic...
});

function handleGridClick(event) {
    const clickedItem = event.target;

    const clickedItemId = parseInt(clickedItem.id.split('grid-item')[1], 10);
    if (adjacent_list[player_position + 1].includes(clickedItemId + 1)) {
        const moveData = {
            player_id: "Player_1",
            new_position: [Math.floor(clickedItemId / 4), clickedItemId % 4]
        };
        socket.emit('move', moveData);
    }
}

function updateGrid(new_state, position) {
    previos_box = document.getElementById('grid-item' + player_position + '-player');
    effect_box = document.getElementById('grid-item' + (position[0] * 4 + position[1]) + '-effects');
    let effects = "";
    if (new_state.player_data.environmental_cues.breeze){
        effects += "Breeze ";
    }
    if (new_state.player_data.environmental_cues.stench){
        effects += "Stench ";
    }
    if (new_state.player_data.environmental_cues.glare){
        effects += "Glare ";
    }
    if (effect_box.innerHTML == ""){
        effect_box.innerHTML = effects;
    }
    console.log('grid-item' + player_position + '-player');
    previos_box.innerHTML = '';
    new_box = document.getElementById('grid-item' + (position[0] * 4 + position[1]) + '-player');
    new_box.innerHTML = 'P1';
}
// Handle move update event
socket.on('move_update', (data) => {
    if (flag) {
        alert("You can't move because you are dead")
        return;
    }
    console.log('Move successful', data.new_state);
    // Update your game UI based on the new state...
    if (data.new_state.game_over) {
        alert('YOU WIN!');
    }
    if (!data.new_state.player_data.is_alive) {
        alert('YOU LOSE!');
        flag = true;
    }

    updateGrid(data.new_state, data.new_state.player_data.position);

    position = data.new_state.player_data.position;
    player_position = position[0] * 4 + position[1];
});

// Handle move error event
socket.on('move_error', (error) => {
    console.error('Move error', error.error);
    // Handle error feedback...
});

// socket.on('turn')
// Example of requesting the game state

// Handle game state update event
socket.on('game_state_update', (data) => {
    console.log('Game state update', data);
    // Update your game UI based on the new state...
    player_position = data.players[0].position;
    // player2_position = data.players[1].position;
    player_position = player_position[0] * 4 + player_position[1];
    // player2_position = player2_position[0] * 4 + player2_position[1];
    player1_box = document.getElementById('grid-item' + player_position + '-player');
    // player2_box = document.getElementById('grid-item' + player2_position + '-player');
    player1_box.innerHTML = 'P1';
    // player2_box.innerHTML = 'P2';
})
// Handle game state error event
socket.on('game_state_error', (error) => {
    console.error('Game state error', error.error);
    // Handle error feedback...
});


