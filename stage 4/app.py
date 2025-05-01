from flask import Flask, render_template
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


if __name__ == "__main__":
    app.run(debug=True)
    
    
  
  
  
    