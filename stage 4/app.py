from appUser import AppUser
from flask import Flask, render_template, g,request
import sqlite3

DATABASE = 'sql/projDB.db'

# if current_user is none, we are logged out
current_user : AppUser = AppUser(-1,"","",-1)

# what works now
# - we can log in
# - we can click oolong tea, and it will NOT log us out. This is to test the add to cart stuff

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
def get_db()->sqlite3.Connection:
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.route("/manager-dashboard",methods=["POST"])
def get_username():
    
    username = request.form.get('username')
    password = request.form.get('password')

    
    return _validate_login(username,password)

def _validate_login(username,password):
    print("Validating Login")
    connection = get_db()

    # sanitizing inputs
    username = str(username)
    password = str(password)

    # writing query
    q = f"SELECT username,password FROM Accounts WHERE username='{username}' AND password='{password}'"

    # getting data from query
    data = connection.execute(q).fetchone()

    try:
        # if user if found, log in and set active user
        if username in data and password in data:
            user_q = f"SELECT account_id,username,password,privilege FROM Accounts WHERE username='{username}' AND password='{password}'"

            # getting data from query
            user_data = connection.execute(user_q).fetchone()
            
            # updating user to match the user data found
            current_user.update_user(
                int(user_data[0]),
                str(user_data[1]),
                str(user_data[2]),
                int(user_data[3])
                )
            

            print("\tFound USERNAME and PASSWORD")
            return render_template('index.html')
    except:
        print("\tfailed log in, go to log in again")
        return render_template('managerlogin.html')

@app.route("/add_item",methods=['POST'])
def insert_order_entry():
    
    # this method is not finished
    # creates a new entry into the OrderEntry table
    # (account_id, quantity, item_id)

    if not current_user.is_logged_in():
        print("Not logged in")
        return render_template('managerlogin.html')

    item_id = request.form.get("itemButton")
    print(f"\tItem ID:{item_id}")

    q = ""


    return render_template('store.html')



def sign_out():
    # this method is not finished
    # remove active user
    current_user.log_out()
    return


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
    
    
  
  
  
    
