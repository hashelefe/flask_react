from flask import Flask, request, jsonify, make_response
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import ApplicationConfig
from models import db, User, Question, Quiz, Score
import jwt
import datetime

app = Flask(__name__, static_folder='../client/build')
app.config.from_object(ApplicationConfig)


bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
db.init_app(app)
with app.app_context():
    db.create_all()

def generate_token(username):
    expiration_date = datetime.datetime.now() + datetime.timedelta(hours=1)
    payload = {'email': username, 'exp': expiration_date}
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['email']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
    
def get_auth_user():
    auth = request.headers["Authorization"].split(' ')
    if len(auth) != 2:
        return jsonify({"error": "401 - Unauthorized"})
    token = auth[1]
    email = decode_token(token)
    user = User.query.filter_by(email=email).first()
    return user


@app.get("/@me")
def get_current_user():
    user = get_auth_user()
    print(user)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name       
    }) 

@app.post("/register")
def register_user():
  email = request.json["email"]
  password = request.json["password"]
  name = request.json["name"]

  # Check for unique email and name (separate checks)
  user_exists_email = User.query.filter_by(email=email).first() is not None
  user_exists_name = User.query.filter_by(name=name).first() is not None

  if user_exists_email or user_exists_name:
    if user_exists_email:
      error_message = "Email already exists"
    else:
      error_message = "Name already exists"
    return jsonify({"error": error_message}), 409

  # Generate hashed password and create new user
  hash_password = bcrypt.generate_password_hash(password)
  new_user = User(email=email, password=hash_password, name=name)
  db.session.add(new_user)
  db.session.commit()

  return jsonify({
      "id": new_user.id,
      "email": new_user.email,
      "name": new_user.name
  })

@app.post("/api/create_question")
def create_and_store_questions():
    question = request.json["question"]
    quiz_id = request.json["quiz_id"]
    answers = request.json["answers"]
    correct_answer_index = request.json["correct_answer_index"]

    new_question = Question(
        quiz_id=quiz_id,
        question=question,
        answers=answers, 
        correct_answer_index=correct_answer_index
        )
    db.session.add(new_question)
    db.session.commit()

    return jsonify({
        "id": quiz_id,
        "question": question,       
    })

@app.post('/login')
def login():
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = generate_token(email)
    response = make_response(jsonify({"token":token}))
    response.set_cookie('token', token, httponly=True)
    return response


@app.get('/api/questions')
def get_questions():
    questions = Question.query.all()
    question_data = []
    for question in questions:
        question_data.append({
            'id': question.id,
            'quiz_id': question.quiz_id,
            'question': question.question,
            'answers': question.answers,
            'correctAnswer': question.correct_answer_index
        })
    return jsonify(question_data)


@app.route('/api/questions/<int:quiz_id>')
def get_questions_by_quiz(quiz_id):
   try:
       # Fetch 5 questions for the specified quiz_id
       questions = Question.query.filter_by(quiz_id=quiz_id).limit(5).all()

       question_data = []
       for question in questions:
           question_data.append({
               'id': question.id,
               'quiz_id': question.quiz_id,
               'question': question.question,
               'answers': question.answers,
               'correctAnswer': question.correct_answer_index
           })

       return jsonify(question_data), 200

   except Exception as e:
       return jsonify({'error': str(e)}), 400
   

@app.post("/api/add_score")
def add_score():
    user = request.json["user"]
    score = request.json["score"]
    quiz_id = request.json["quiz_id"]
    
    new_score = Score(
        user=user,
        score = score,
        quiz_id = quiz_id
    )

    db.session.add(new_score)
    db.session.commit()

    return jsonify({
        "status": 200
    })

@app.get("/api/get_scores")
def get_scores():
    try:
        scores = Score.query.limit(10).all()
        score_data = []
        for score in scores:
            score_data.append({
                'user': score.user,
                'score': score.score,
                'quiz_id': score.quiz_id
            })
        return jsonify(score_data, 200)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)