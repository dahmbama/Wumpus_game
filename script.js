// Store the current player position (initially set to box 7)

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

const socket = io('http://192.168.4.121:5000');

// Handle connect event
socket.on('connect', () => {
    console.log('Connected to the server');
    // You can perform any additional setup or join the game here...
});

// Handle disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
    // Handle disconnection logic...
});

function handleGridClick(event) {
    console.log(event.target.id);
    const moveData = {
        player_id: 'Player_1',
        new_position: event.target.id
    };
    socket.emit('move', moveData);
}

function updateGrid(new_state) {
    boxes = document.getElementsByClassName('grid-item');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].innerHTML = new_state.grid[Math.floor(i/4)][i%4];
    }
}
// Handle move update event
socket.on('move_update', (data) => {
    console.log('Move successful', data.new_state);
    // Update your game UI based on the new state...
    updateGrid(data.new_state);
});

// Handle move error event
socket.on('move_error', (error) => {
    console.error('Move error', error.error);
    // Handle error feedback...
});

// Example of requesting the game state
socket.emit('game_state');

// Handle game state update event
socket.on('game_state_update', (data) => {
    console.log('Game state update', data);
    // Update your game UI based on the new state...
});

// Handle game state error event
socket.on('game_state_error', (error) => {
    console.error('Game state error', error.error);
    // Handle error feedback...
});


