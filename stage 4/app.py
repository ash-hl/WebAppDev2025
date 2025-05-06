from flask import Flask, render_template, g,request
import sqlite3


DATABASE = 'sql/projDB.db'

app = Flask(__name__)
@app.route('/')

def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/product')
def product():
    return render_template('product.html')

@app.route('/store')
def store():
    return render_template('store.html')


@app.route('/login')
def login():
    #add login logic   
    return render_template('managerlogin.html')

@app.route('/checkout')
#checkout logic? :/
def checkout():
    return render_template('contact.html')

@app.route('/purchasecomplete')
def purchasecomplete():
    return render_template('purchasecomplete.html')

#connecting to Databse
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.route("/manager-dashboard",methods=["POST"])
def get_username():
    
    username = request.form.get('username')
    password = request.form.get('password')

    _validate_login(username,password)

    return render_template('index.html')

def _validate_login(username,password):
    print("Validating Login")
    connection = sqlite3.connect(DATABASE)

    # sanitizing inputs
    username = str(username)
    password = str(password)

    # writing query
    q = f"SELECT username,password FROM Accounts WHERE username='{username}' AND password='{password}'"

    # getting data from query
    data = connection.execute(q)

    for entry in data:
        print(entry)
    return render_template('index.html')



@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/testdb')
def testdb():
    try:
        db = get_db()
        cur = db.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cur.fetchall()
        return f"Connected! Tables: {[table[0] for table in tables]}"
    except Exception as e:
        return f"Database connection failed: {e}"
    


if __name__ == "__main__":
    app.run(debug=True)
    
    
  
  
  
    
