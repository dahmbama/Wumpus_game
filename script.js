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

async function initialGame() {
    // Create the grid container
    parent = document.createElement("div");
    parent.className = "grid-container";
    parent.id = "container";
    parent.addEventListener('click', handleGridClick);

    // get initial game state
    const response = await fetch('http://server_ip:5000/game_state',
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log(data);

    // Create the grid items
    for (i = 0; i < 16; i++) {
        newBox = document.createElement("div");
        newBox.className = "grid-item";
        newBox.id = "grid-item" + i;

        // Add the text to the grid item
        const textnode = document.createTextNode(data.grid[Math.floor(i/4)][i%4]);
        newBox.appendChild(textnode);
        parent.appendChild(newBox);
    }
    document.body.appendChild(parent);

    // Set the current player position
    currentPlayerPosition = data.players[0].position[0] * 4 + data.players[0].position[1];
}

async function handleGridClick(event) {
    // Get the clicked grid item
    const clickedItem = event.target;
    
    // Get the ID of the clicked item and convert it to a number
    const clickedItemId = parseInt(clickedItem.id.split('grid-item')[1], 10);

    // Move the player by sending a request to the server
    const response = await fetch('http://server_ip:5000/move',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({player_id: 1, new_position: [Math.floor(clickedItem / 4), (clickedItem) % 4]}),
    });

    // receive the new game state
    const data = await response.json();
    console.log(data)

    
    // TODO: check if the clicked item is adjacent to the current player position
    if (0) {
        // Perform your desired action when a valid adjacent box is clicked
        boxes = document.getElementsByClassName("grid-item")
        for (i = 0; i < boxes.length; i++) {
            boxes[i].innerHTML = data.grid[Math.floor(i/4)][i%4];
        }
        currentPlayerPosition = data.players[0].position[0] * 4 + data.players[0].position[1];
        //currentPlayerPosition = clickedItemId;
    } else {
        // Notify the user that the clicked box is not adjacent
        alert('You can only click on boxes adjacent to the player.');
    }
}

