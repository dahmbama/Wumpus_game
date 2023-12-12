// Store the current player position (initially set to box 7)
let currentPlayerPosition = 1;
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
/*
[   ["P1", "", "", "PIT"],
    ["", "W", "", "T"],
    ["", "PIT", "W", ""],
    ["", "", "", ""]];
 */
game_states = {1: [["P1", "", "", ""],
                    ["", "", "", ""],
                    ["", "", "", ""],
                    ["", "", "", ""]],
                2: [["V", "P1,VS", "", ""],
                ["", "", "", ""],
                ["", "", "", ""],
                ["", "", "", ""]],
                3: [["V", "VS", "P,VB", ""],
                ["", "", "", ""],
                ["", "", "", ""],
                ["", "", "", ""]],
                4: [["V", "VS", "VB", ""],
                ["", "", "P,VSG", ""],
                ["", "", "", ""],
                ["", "", "", ""]],
                5: [["V", "VS", "VB", ""],
                ["", "", "VSG", "P,Win"],
                ["", "", "", ""],
                ["", "", "", ""]],
}
counter = 1;
function initialGame() {
    parent = document.createElement("div");
    parent.className = "grid-container";
    parent.id = "container";
    parent.addEventListener('click', handleGridClick);
    console.log("hello")
    game_state = game_states[counter];
    for (i = 0; i < 16; i++) {
        newBox = document.createElement("div");
        newBox.className = "grid-item";
        newBox.id = "grid-item" + i;
        const textnode = document.createTextNode(game_state[Math.floor(i/4)][i%4]);
        newBox.appendChild(textnode);
        parent.appendChild(newBox);
    }
    console.log(parent)
    document.body.appendChild(parent);
    counter += 1;
}

function handleGridClick(event) {
    // Get the clicked grid item
    const clickedItem = event.target;
    
    // Get the ID of the clicked item and convert it to a number
    const clickedItemId = parseInt(clickedItem.id.split('grid-item')[1], 10);
    // Check if the clicked item is adjacent to the current player position
    game_state = game_states[counter];
    if (adjacent_list[currentPlayerPosition].includes(clickedItemId + 1)) {
        // TODO: Make a POST request to the server to update the player position
        // const response = fetch('/move',
        // {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({"player_id": 1, new_position: [Math.floor((clickedItem + 1) / 4), (clickedItem + 1) % 4]}),
        // });
        // Perform your desired action when a valid adjacent box is clicked
        boxes = document.getElementsByClassName("grid-item")
        for (i = 0; i < boxes.length; i++) {
            boxes[i].innerHTML = game_state[Math.floor(i/4)][i%4];
        }
        currentPlayerPosition = clickedItemId + 1;
        // Update the player position to the clicked item
        //currentPlayerPosition = clickedItemId;
        counter += 1;
    } else {
        // Notify the user that the clicked box is not adjacent
        alert('You can only click on boxes adjacent to the player.');
    }
}

// Function to check if two box numbers are adjacent

