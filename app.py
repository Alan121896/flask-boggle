from flask import Flask, jsonify, render_template, session, request
from boggle import Boggle

app = Flask(__name__)
app.secret_key = 'the_password_is_password'

game_stats = {
    'played': 0,
    'high_score': 0
}

boggle_game = Boggle()



@app.route('/')
def mainpage():
    board = boggle_game.make_board()
    session['board'] = board
    high_score = session.get('hihgscore', 0)
    played = session.get("played", 0)
    return render_template('index.html', board=board, high_score=high_score, played=played)

@app.route('/check-word', methods= ['POST'])
def check_word():
    #Get user guess from axios request
    guess = request.json.get('guess')
    #Get the board from the session
    board = session.get('board')

    result = boggle_game.check_valid_word(board, guess)
    
    return jsonify({'result' : result})

@app.route('/game-stats', methods=['POST'])
def update_game_stats():
    score = request.json["score"]
    highscore = session.get('highscore', 0)
    played = session.get('played', 0)

    session['played'] = played + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)

