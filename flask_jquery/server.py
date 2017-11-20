import flask
from flask import Flask, request, render_template
import pickle
import json
import os

app = Flask(__name__)


@app.route('/todo', methods=['GET', 'POST'])
def list_todo():
    if request.method == 'GET':
        user_name = read_user()
        return render_template('todo_index.html', user_name=user_name)
    else:
        return 'hello'


@app.route('/todo/api/user', methods=['POST'])
def update_user():
    if request.method == 'GET':
        read_user()

    else:
        # http://conta.hatenablog.com/entry/2013/02/06/162829
        import sys
        print(request.data, file=sys.stdout)
        print(request.json, file=sys.stderr)
        user_name = request.json.get('user_name')
        if user_name:
            with open('user.pickle', mode='wb') as f:
                pickle.dump(user_name, f)
            return flask.jsonify(res='ok')
        else:
            return flask.jsonify(res='error'), 400


@app.route('/todo/api/todo', methods=['GET'])
def show_todo():
    with open('todo.json', mode='r') as f:
        todos = json.load(f)
    return flask.jsonify(todos)


@app.route('/todo/api/todo/create', methods=['POST'])
def create_todo():
    if os.path.exists('todo.json'):
        with open('todo.json', mode='r') as f:
            todos = json.load(f)
    else:
        todos = {}
    todos[len(todos) + 1] = {
        'is_done': False,
        'content': request.json.get('content'),
    }
    with open('todo.json', mode='w') as f:
        json.dump(todos, f)
    return flask.jsonify(res='ok')


@app.route('/todo/api/todo/update', methods=['POST'])
def update_todo():
    with open('todo.json', mode='w+') as f:
        todos = json.load(f)
        todo = todos.get(request.json.get('id'))
        todo['is_done'] = not(todo['is_done'])
        todos[request.json.get('id')] = todo
        json.dump(todos, f)
    return flask.jsonify(res='ok')


def read_user():
    try:
        with open('user.pickle', mode='rb') as f:
            return pickle.load(f)
    except FileNotFoundError as e:
        return '未設定'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
