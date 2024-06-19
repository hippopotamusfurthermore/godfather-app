from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS, cross_origin
import pydash
import jwt as manual_jwt
import os


class User: 
    def __init__(self):
        self.id = None
        self.username = None
        self.email = None
        self.password = None
        self.godfather_email = None
        self.role = None


JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', "cantBeTheFlag...Isn7iT?")

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY 
cors = CORS(app)
jwt = JWTManager(app)

user_db = []


def init():
    global user_db

    admin_info = {"id":0, "username":"john", "email":"john@email.com", "password": os.environ.get('JOHN_PASSWD', "p4ssw0rd"), "role": "user"}
    user_info = {"id":1, "username":"theo", "email":"theo@email.com", "password": os.environ.get('THEO_PASSWD', "p4ssw0rd"), "role": "user"}

    admin = User()
    pydash.set_(admin, "id", admin_info['id'])
    pydash.set_(admin, "username", admin_info['username'])
    pydash.set_(admin, "email", admin_info['email'])
    pydash.set_(admin, "password", admin_info['password'])
    pydash.set_(admin, "role", admin_info['role'])

    user = User()
    pydash.set_(user, "id", user_info['id'])
    pydash.set_(user, "username", user_info['username'])
    pydash.set_(user, "email", user_info['email'])
    pydash.set_(user, "password", user_info['password'])
    pydash.set_(user, "role", user_info['role'])

    user_db = [admin, user]


def get_user_info(id):
    index = int(id)
    if len(user_db) - 1 >= index:
        return jsonify({'username': pydash.get(user_db[index], "username"),
                        'email': pydash.get(user_db[index], "email"),
                        'godfather_email': pydash.get(user_db[index], "godfather_email")})
    else:
        return jsonify({'error': 'Unknown user'}), 400
    

@cross_origin()
@app.route("/user/me", methods=['GET'])
@jwt_required()
def user_me():
    current_user_id = get_jwt_identity()
    return get_user_info(current_user_id)


@cross_origin()
@app.route("/user/<id>")
@jwt_required()
def user_info(id):
    return get_user_info(id)
    
    
@cross_origin()
@app.route("/update", methods=['PATCH'])
@jwt_required()
def update():
    user_id = get_jwt_identity()
    key, value = list(request.get_json().items())[0] 
    pydash.set_(user_db[int(user_id)], key, value)
    user = user_db[int(user_id)]
    return jsonify({'username': user.username, 'email': user.email, 'godfather_email': user.godfather_email})


@cross_origin()
@app.route("/register", methods=['POST']) 
def register():
    if request.is_json:
        user_info = request.get_json() 
        username = user_info['username']

        if username.lower() == "admin": # Cannot create admin
            return jsonify({'error': 'Invalid username - Forbidden'}), 400
    
        for user in user_db:
            if user.username.lower() == username.lower():
                return jsonify({'error': 'Invalid username - Already existing'}), 400
        
        additional_claims = {
            "username": username,
            "role": "user"
        }
        
        user_id = len(user_db)
        user = User()
        pydash.set_(user, "id", user_id)
        pydash.set_(user, "username", user_info['username'])
        pydash.set_(user, "email", user_info['email'])
        pydash.set_(user, "password", user_info['password'])
        pydash.set_(user, "role", "user")
        pydash.set_(user, "godfather_email", "")

        # Add the new user to the data base
        # TODO : Use a proper SQL database
        user_db.append(user)

        access_token = create_access_token(identity=user_id, additional_claims=additional_claims)
        return jsonify({'message':'ok', 'token': access_token}), 200
    else:
        return jsonify({"error": "Invalid content type"}), 400
    

@app.route("/admin", methods=['GET'])
def is_admin():
    token = request.headers.get('Authorization').replace("Bearer ", "") if "Bearer " in request.headers.get('Authorization') else None
    if token:
        current_user_role = manual_jwt.decode(token, JWT_SECRET_KEY, algorithms="HS256")['role']

        if 'admin' == current_user_role:
            return jsonify({'admin': True, "flag": os.environ.get("FLAG")})
        
    return jsonify({'admin': False})
    

if __name__ == "__main__":
    init()
    app.run(host='0.0.0.0', port='5000', debug = False)