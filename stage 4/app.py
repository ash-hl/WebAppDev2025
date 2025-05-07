from appUser import AppUser
from flask import Flask, render_template, g,request
import sqlite3

DATABASE = 'sql/projDB.db'

# if current_user is none, we are logged out
current_user : AppUser = AppUser(-1,"","",-1)

# what works now
# - we can log in
# - we can log out!
# - we can add items to card
# - we can see the cart!!!



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

    if not (current_user.is_logged_in()):
        return render_template('managerlogin.html')

    html = ''
    midHhtml = ''
    template_container_opener = '<div id="cartContainer">'
    template_container_closer = '</div>'
    price_total = 0.0

    # --- get items that need to be rendered
    connection = get_db()
    q = f'SELECT * FROM OrderEntry WHERE account_id={current_user.get_account_id()}'
    result = connection.execute(q).fetchall()

    for entry in result:
        # 0 = account_id, 1 = quantity, 2 = item_id
        item_q = f'SELECT name,price FROM Items WHERE item_id={entry[2]}'
        item_res = connection.execute(item_q).fetchone()
        print(f'item_res :{item_res}')
        item_name = item_res[0]
        item_price = item_res[1]

        quantity_q = f"SELECT quantity FROM OrderEntry where account_id={current_user.get_account_id()} AND item_id={entry[2]}"
        quant_res = connection.execute(quantity_q).fetchone()
        quantity = quant_res[0]

        item_price *= quantity
        price_total += item_price
        midHhtml += f'<p><a href="#">{item_name}</a> <span class="price">${item_price}</span></p>'

    

    midHhtml += f'<p>Total <span class="price" style="color:black"><b id="priceTotal" >Total: ${price_total:0.01f}</b></span></p>'
    midHhtml += '<form action="/clearInventory"><input type="submit" value="Clear Cart" class="btn-form" id="completePurchase"></form>'
    html = template_container_opener + midHhtml + template_container_closer

    return render_template('contact.html',content=html)

@app.route('/clearInventory')
def clearCart():

    connection = get_db()
    q=f"DELETE FROM OrderEntry WHERE account_id={current_user.get_account_id()}"
    connection.execute(q)
    connection.commit()


    return checkout()

@app.route('/purchasecomplete')
def purchasecomplete():
    return render_template('purchasecomplete.html')

#connecting to Databse
def get_db()->sqlite3.Connection:
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.autocommit = True
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
    q = f"SELECT username,password,privilege FROM Accounts WHERE username='{username}' AND password='{password}'"

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
            
            if current_user.get_privilege() == 1:
                return render_template('managermenu.html')
            
            print("\tFound USERNAME and PASSWORD")
            return render_template('index.html')
    except:
        print("\tfailed log in, go to log in again")
        return render_template('managerlogin.html')

@app.route("/add_item",methods=['POST'])
def insert_order_entry():
    connection = get_db()
    # this method is not finished
    # creates a new entry into the OrderEntry table
    # (account_id, quantity, item_id)

    if not current_user.is_logged_in():
        print("Not logged in")
        return render_template('managerlogin.html')

    item_id = request.form.get("itemButton")
    
    # query to check if the combo of item_id and account_id exist. if so, increment quantity
    # if not, add new row
    q1 = f"SELECT COUNT(account_id) FROM OrderEntry WHERE account_id = {current_user.get_account_id()} and item_id = {item_id}"

    result1 = int(connection.execute(q1).fetchone()[0])
    print(f"result: {result1} , item_id:{item_id}")
    # try:
    #     if result1:
            # print("result exists")
    if result1 == 0: # zero counts 
        print("\tAdding row with quantity 1")
        q2 = f"INSERT INTO OrderEntry (account_id,quantity,item_id) VALUES({current_user.get_account_id()},1,{item_id});"
        result2 = connection.execute(q2)
        connection.commit()
        
        # if count > 0, increment quantity
    elif result1 > 0:
        q2 = f"UPDATE OrderEntry SET quantity = quantity + 1 WHERE account_id ={current_user.get_account_id()} AND item_id={item_id}"
        connection.execute(q2)
        connection.commit()
        q3 = f"SELECT quantity FROM OrderEntry WHERE account_id={current_user.get_account_id()} AND item_id={item_id}"
        result3 = int(connection.execute(q3).fetchone()[0])
        print(result3)
        print(f"\tIncrementing Quantity({result3}) for account_id:{current_user.get_account_id()} for item_id:{item_id}")
    # except:
    #     # if not.... uuhh I think its broken???
    #     print("\tFailed to attempt reading result..?")
    return render_template('store.html')

@app.route("/logout",methods=['POST'])
def sign_out():
    # this method is not finished
    # remove active user
    print("Logging out")
    current_user.log_out()
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
