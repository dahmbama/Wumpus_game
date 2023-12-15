import uuid
import pickle

def generate_unique_id():
    return str(uuid.uuid4())

from flask import Flask, render_template
from flask_socketio import SocketIO

from threading import Lock

from wumpus_game import WumpusGame
from flask import request
from player import Player
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
game_instances = {}
game_instance_lock = Lock()
PLAYERS_TO_START = 2  # Define minimum number of players to start a game

@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('initiate_game')
def handle_initiate_game(data):
    player_id = data['player_id']
    player_name = data['player_name']

    player = Player(player_id, player_name)
    # Assign player to an existing game instance or create a new one
    game_instance_id = create_game_instance()
    WumpusGame.get_game(game_instance_id).players.pop()
    WumpusGame.get_game(game_instance_id).players.pop()

    WumpusGame.get_game(game_instance_id).add_player(player.player_id, player.name)
    # if WumpusGame.get_game(game_instance_id).is_ready_to_start():
    #     WumpusGame.get_game(game_instance_id).start_game()

    socketio.emit('game_data', {
        "game_instance_id": game_instance_id, 
        "player_id": player.player_id, 
        "game_state": WumpusGame.get_game(game_instance_id).get_player_pov_game_state(player.player_id)
    })

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    # Handle client disconnection logic here...
    for game_instance_id, game_instance in game_instances.items():
        for player in game_instance.players:
            if id(player) == request.sid:
                game_instance.players.remove(player)
                break

@socketio.on('move')
def handle_move(data):
    try:
        player_id = data['player_id']
        new_position = data['new_position']
        game_instance_id = data['game_instance_id']
        
        # Find the game instance that the player belongs to
        # game_instance_id = None
        # for id, instance in game_instances.items():

        #     if player_id in [id(p) for p in instance.players]:
        #         game_instance_id = id
        #         break
        
        if game_instance_id:
            # Handle move logic and emit updates to clients in the same game instance
            
            WumpusGame.get_game(game_instance_id).move_player(player_id, new_position)
            game_state = WumpusGame.get_game(game_instance_id).get_game_state()
            for player in game_state['players']:
                if player["player_id"] == player_id:
                    socketio.emit('move_update', {"message": "Move successful", "new_state": player})


            # for player in WumpusGame.get_game(game_instance_id).players:
            #     socketio.emit('move_update', {"message": "Move successful", "new_state": game_state})
        else:
            raise Exception("Player not found in any game instance")
    
    except Exception as e:
        print(str(e))
        socketio.emit('move_error', {"error": str(e)})

def find_available_game_instance():
    for game_instance_id, game_instance in game_instances.items():
        if len(game_instance.players) < PLAYERS_TO_START and not game_instance.game_over:
            return game_instance_id
    return None

def create_game_instance():
    game_instance_id = generate_unique_id()  # Unique ID generation logic
    game_instances[game_instance_id] = WumpusGame(game_instance_id)
    game_instances[game_instance_id].create_new_game(game_instance_id)
    return game_instance_id

@socketio.on('game_state')
def handle_game_state():
    try:
        player_id = request.sid
        game_instance_id = None
        for id, instance in game_instances.items():
            if player_id in [id(p) for p in instance.players]:
                game_instance_id = id
                break
        
        if game_instance_id:
            game_state = WumpusGame.get_game(game_instance_id).get_player_pov_game_state(player_id)
            socketio.emit('game_state_update', game_state, room=player_id)
        else:
            raise Exception("Player not found in any game instance")
    
    except Exception as e:
        socketio.emit('game_state_error', {"error": str(e)})
# @app.route('/')
# def index():
#     return render_template('mainmenu.html')
# @app.route('/mainmenu.html')
# def index():
#     return render_template('mainmenu.html')

@app.route('/game')
def game():
    return render_template('index.html')  # Added ".html"

# @app.route('/createlobby.html')
# def createlobby():
#     return render_template('createlobby.html')

@app.route('/joinlobby')
def joinlobby():
    return render_template('joinlobby.html')

@app.route('/joinlobby', methods=['POST'])
def joinlobby_POST():
    # Handle the AJAX request here
    return {'status': 'success'}


@app.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html')

@app.route('/leaderboard', methods=['POST'])
def leaderboard_POST():
    # Handle the AJAX request here
    return {'status': 'success'}

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)