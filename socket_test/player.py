class Player:
    def __init__(self, player_id, name, start_position=(0, 0)):
        self.player_id = player_id
        self.name = name
        self.position = start_position  # tuple (0 <= x < 4, 0 <= y < 4)
        self.visited = set([start_position])  # Initialize with the starting position
        self.move_count = 0  # used in the leaderboard IF the player won
        self.is_alive = True  # Set to False if fell to a pit or killed
        self.is_spectating = False  # Set to True if fell to a pit or killed, spectate view is activated if true
        self.environmental_cues = {'glare': False, 'stench': False, 'breeze': False}

    def update_position(self, new_position):
        if self.is_valid_move(new_position):
            self.position = new_position
            self.move_count += 1
            self.visited.add(new_position)  # Add the new position to visited set

    def is_valid_move(self, new_position):  # Check if within borders
        row, col = new_position
        return 0 <= row < 4 and 0 <= col < 4

    def set_status(self, is_alive):
        self.is_alive = is_alive
        if not is_alive:  # If dead, activate spectating
            self.is_spectating = True

    def update_environmental_cues(self, cues):
        self.environmental_cues.update(cues)

    def to_dict(self):
        """Return a dictionary representation of the player."""
        return {
            "player_id": self.player_id,
            "name": self.name,
            "position": self.position,
            "move_count": self.move_count,
            "is_alive": self.is_alive,
            "is_spectating": self.is_spectating,
            "environmental_cues": self.environmental_cues
        }

    def __str__(self):
         return (f"Player {self.player_id} - {self.name}: Position {self.position}, "
                    f"Moves: {self.move_count}, Alive: {self.is_alive}, "
                    f"Spectating: {self.is_spectating}, Cues: {self.environmental_cues}")