(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-150px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Product carousel
    $(".product-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
			0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        loop: true,
        dots: true,
        nav: false,
    });
    
    
    // Log in 
    const login_btn = document.getElementById("login");
    const entry_username = document.getElementById("username");
    const entry_password = document.getElementById("password")
    
    // entry_username.value = 'AdminAccount'
    // entry_password.value = 'password123'
    
    if (login_btn != null){
        login_btn.onclick = function() {
            console.log("Logging in...");
            // create login function... 
            // if login works, user will be redirected to Homepage
            tryLogin(entry_username.value,entry_password.value);
        }
    }


    // add item to cart
    // check to see if item is in the database for this user already.
    // if so, increase the quantity
    // if not, add a new entry

    const btn_boba = document.getElementById("boba");
    const btn_green = document.getElementById("greenTea");
    const btn_chai = document.getElementById("chai");
    const btn_oolong = document.getElementById("oolong");
    
    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log( page );


    // redirect to login if not logged in
    function redirectIfNotLoggedIn(){
        if (localStorage.getItem("username") == null){
            window.location.href = "managerlogin.html";
        }
    }


    if (page == "ordermanagement.html"){
        const accountList = document.getElementById("account-list");
        
        let orderList = [];

        for (let key in localStorage){
            if (key.startsWith("ORDER_")){
                let order = {
                    date: JSON.parse(localStorage.getItem(key))["date"],
                    items: JSON.parse(JSON.parse(localStorage.getItem(key))["items"])
                }
                orderList.push(order);
                // console.log(order);
            }
        }
        
        for (let i in orderList){
            console.log(orderList[i]["date"]);
            accountList.innerHTML +='<li><a>ORDER: '+ orderList[i]["date"]+'<button class="btn btn-dark rounded-pill py-2 px-4 m-2">Remove Order</button></a></li>';
            //<li><a href="#" onclick="goToOrder('account1')">Account 1</a></li>
        }
        
    }


    if (page == "contact.html"){

        redirectIfNotLoggedIn()
        populateCart()

        const purchase_btn = document.getElementById("completePurchase");
        purchase_btn.onclick = function(){
            // generate order
            console.log("GENERATING ORDER");
            let d = new Date;
            let date = d.getDay()+"-"+d.getMonth()+'-'+d.getMilliseconds()
            let items_array = [];
            let acc_id = localStorage.getItem("account_id");

            for (let key in localStorage){
                if (key.startsWith("cart_"+acc_id)){
                    let obj = localStorage.getItem(key); // no need to parse
                    items_array.push(obj);
                }
            }

            console.log(d.getTime())
            let new_order = {
                // item name?
                date: date,
                items: JSON.stringify(items_array)
            }

            insertOrder(new_order);
        }
    }

    if (page == "store.html"){

        redirectIfNotLoggedIn()

        const BOBA_ID = 0;
        const GREENTEA_ID = 1;
        const CHAI_ID = 2;
        const OOLONG_ID = 3;


        // handle store stuff here

        btn_boba.onclick = function(){
            console.log("boba");
            let item = {
                item_id: BOBA_ID,
                name: "Boba Tea Mix",
                price: 19.00,
                quantity:1
            }
            add_to_cart(item);
        }

        btn_green.onclick = function(){
            console.log("green tea");
            let item = {
                item_id: GREENTEA_ID,
                name: "Green Tea Mix",
                price: 19.00,
                quantity:1
            }
            add_to_cart(item);
        }

        btn_chai.onclick = function(){
            console.log("chai");
            let item = {
                item_id: CHAI_ID,
                name: "Chai Tea Mix",
                price: 19.00,
                quantity:1
            }
            add_to_cart(item);
        }

        btn_oolong.onclick = function(){
            console.log("oolong");
            let item = {
                item_id: OOLONG_ID,
                name: "Oolong Tea Mix",
                price: 19.00,
                quantity:1
            }
            add_to_cart(item);
        }


    }

    // management nav bar

    function enableManagerMenu(){
        //<a href="store.html" class="nav-item nav-link">Store</a>
        let priv = localStorage.getItem("privilege");

        if (priv == null){
            return
        }
        
        if (priv == 1){
            console.log("MANAGER");
            document.getElementById("navbarCollapse").innerHTML += '<a href="managermenu.html" class="nav-item nav-link">Management</a>';
        }
    }

    enableManagerMenu();

    function add_to_cart(item){
        // check in local storage to see if this item
        let acc_id = localStorage.getItem("account_id"); 

        // if a cart doesnt exist, create an empty cart
        // if (localStorage.getItem(acc_id) == null){
        //     localStorage.setItem(acc_id,[]);
        // }

        let stringified_item = JSON.stringify(item);
        let cart_id = 'cart_'+acc_id+'_'+item['item_id'];

        if (localStorage.getItem(cart_id) == null){
            localStorage.setItem(cart_id,[stringified_item]);
        }
        else{
            let parsed_item = JSON.parse(localStorage.getItem(cart_id))
            parsed_item['quantity'] += 1;
            let restringified_item = JSON.stringify(parsed_item);
            localStorage.setItem(cart_id,restringified_item);
        }

        // let string_item = JSON.stringify(item);

        // localStorage.setItem('cart_'+acc_id,string_item);
    }   

    function reduceQuantity(item_id){
        console.log(item_id);
        let stringified_item = JSON.stringify(stringified_item)

        // if quantity is 1, remove completely,
        // if quantity if greater than 1, remove one
    }

    function insertOrder(order){
        console.log("INSERTING ORDER");
        let acc_id = localStorage.getItem("account_id");
        let order_date = order["date"];
        let stringified_order = JSON.stringify(order);
        localStorage.setItem("ORDER_"+acc_id+'_'+order_date,stringified_order);
        console.log("Finished Inserting");
    }

    // checkout page stuff
    function populateCart(){
        let container = document.getElementById("cartContainer");
        let price_text = document.getElementById("price");
        let prod_template = '<p><a href="#">{product} 1</a> <span class="price">${price}</span></p>'
        
        let compiled_cart = [];
        let acc_id = localStorage.getItem("account_id");
        for (let key in localStorage){
            if (key.startsWith("cart_"+acc_id)){
                // console.log(key);
                let obj = JSON.parse(localStorage.getItem(key));
                // console.log(obj);
                compiled_cart.push(obj);
            }
            
        }
        
        let finalPrice = 0.0;

        for (let i = 0; i< compiled_cart.length; i++){
            let product = compiled_cart[i]["name"];
            let item_id = compiled_cart[i]["item_id"]
            let price = compiled_cart[i]["price"];
            let quantity = compiled_cart[i]["quantity"]
            
            finalPrice += parseFloat(price) * parseFloat(quantity);
            // console.log(quantity);
            // <button id="reduceQuantity" onclick="reduceQuantity('+item_id+')" class="btn-form">Remove from Cart</button>
            let item = '<div><p>'+product+' ( '+quantity+' Count ) • $'+price*quantity+'</p></div>';
            
            container.innerHTML += item;
        }


        for (let e = 0; e < container.childNodes.length; e ++){
            
            if (e instanceof HTMLDivElement){
                console.log(e);
            }
        }

        let finalPriceDisplay = document.getElementById("priceTotal");
        
        console.log(finalPrice);
        finalPriceDisplay.innerHTML = "$"+finalPrice;
        container.innerHTML += '<hr>'
        // container.innerHTML += '<button>Yello!</button>'
    }

    // opening databases
    const req_account_db = indexedDB.open("AccountDB",1);
    const req_cart_db = indexedDB.open("CartDB",1);
    const req_item_db = indexedDB.open("ItemDB",1);

    // storing db in variables
    var account_db = null;
    var cart_db = null;
    var item_db = null;

    // creating account database
    req_account_db.onsuccess = (event) => {
        account_db = event.target.result;
        
        console.table(account_db);
        
        insertAccount(account_db,{
            account_id : 0,
            username : 'AdminAccount',
            password : 'password123',
            privilege :1
        });
        
        insertAccount(account_db,{
            account_id : 2,
            username : 'user',
            password : '123',
            privilege :0
        });
        
        // insertAccount(account_db,{
        //     account_id : 1,
        //     username : 'ash',
        //     password : '123',
        //     privilege :1
        // });
       
    }

    // creating cart database
    req_cart_db.onsuccess = (event) => {
        cart_db = event.target.result;

        // insertCart(cart_db,{
        //     account_id : 1,
        //     item_id : 0,
        //     quantity : 10
        // })

    }

    // creating item database
    req_item_db.onsuccess = (event) => {
        item_db = event.target.result;

        insertItem(item_db, {
            item_id:0,
            name:"Boba Tea Mix",
            price: 19.00
        })

        
        insertItem(item_db, {
            item_id:1,
            name:"Green Tea Mix",
            price: 19.00
        })

        
        insertItem(item_db, {
            item_id:2,
            name:"Chai Tea Mix",
            price: 19.00
        })

        
        insertItem(item_db, {
            item_id:3,
            name:"Oolong Tea Mix",
            price: 19.00
        })

        
    }

    req_cart_db.onupgradeneeded = (event) => {
        let db = event.target.result;
        let store = db.createObjectStore('Cart',{autoIncrement: true});
        store.createIndex('account_id','account_id',{unique: true});
        store.createIndex('item_id','item_id',{unique: true});
        store.createIndex('quantity','quantity',{unique: false});        
    }

    req_item_db.onupgradeneeded = (event) => {
        let db = event.target.result;
        let store = db.createObjectStore('Items',{autoIncrement: true});
        store.createIndex('item_id','item_id',{unique: true});
        store.createIndex('name','name',{unique: false});
        store.createIndex('price','price',{unique: false});

    }

    req_account_db.onupgradeneeded=(event)=>{
        let db = event.target.result;
        let store = db.createObjectStore('Accounts',{autoIncrement: true});
        store.createIndex('account_id','account_id',{unique: true});
        store.createIndex('username','username',{unique: true});
        store.createIndex('password','password',{unique: false});
        store.createIndex('privilege','privilege',{unique: false});

    };

    function insertItem(db,item){
        const txn = db.transaction('Items','readwrite');

        const store = txn.objectStore('Items');

        let query = store.put(item);

        query.onsuccess = function (event) {
            console.log(event);
        }

        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }

        txn.oncomplete = function () {
            db.close();
        } 
    }

    function insertCart(db,cart){
        const txn = db.transaction('Cart','readwrite');

        const store = txn.objectStore('Cart');

        let query = store.put(cart);

        query.onsuccess = function (event) {
            console.log(event);
        }

        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }

        txn.oncomplete = function () {
            db.close();
        } 
    }

    function insertAccount(db,account) {
        const txn = db.transaction('Accounts','readwrite');

        const store = txn.objectStore('Accounts');

        let query = store.put(account);

        query.onsuccess = function (event) {
            console.log(event);
        }

        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }

        txn.oncomplete = function () {
            db.close();
        }
    }

    function tryLogin(username,password){
        let req = indexedDB.open("AccountDB",1);
        let db;
        let possible_match;
        req.onsuccess = (event) => {
            db = event.target.result;

            console.table(db);

            const trans = db.transaction('Accounts','readwrite');
            const store = trans.objectStore('Accounts');
            const index = store.index('password')

            let query = index.get(password);

            query.onsuccess = (event) => {
                possible_match = query.result;

                if (query.result['password'] == password &&
                    query.result['username'] == username
                 ){
                    console.log("Account reached!");
                    // on account reached, save account info in local storage
                    localStorage.setItem("account_id",possible_match['account_id']);
                    localStorage.setItem("username",possible_match['username']);
                    localStorage.setItem("password",possible_match['password']);
                    localStorage.setItem("privilege",possible_match['privilege']);
                    
                    if (localStorage.getItem("privilege")==0){
                        window.location.href = "index.html";
                    }
                    else{
                        window.location.href = "managermenu.html";
                    }

                }
                else{
                    console.log("Login failed </3")
                }
            }

            trans.oncomplete = function(){
                db.close();
            }

        }
    }

    function getAccountId(account_id) {
        let req = indexedDB.open("AccountDB",1);
        let db;
        let account=5;
        req.onsuccess = (event) =>{
            db = event.target.result;
            console.log("Request Complete.")
            
            const txn = db.transaction('Accounts','readonly');
            const store = txn.objectStore('Accounts');
            const index = store.index('account_id')
            
            let query = index.get(account_id);
    
            query.onsuccess = (event) => {
                // console.log(event);
                account = query.result['username'];
                localStorage.setItem("test",query.result['username']);
                
                
                // return account;
            }
            // query.onerror = (event)=>{
                //     console.log("error bruh..");
                // }
                txn.oncomplete = function(){
                    db.close();
                }
            }
            
        console.log(account);
        
        return account;
    }
    

    function removeAccount(req_account_db,id) {
        const txn = db.transaction('Accounts','readwrite');
        const store = txn.objectStore('Accounts');

        let query = store.delete(id);

        query.onsuccess = function(event) {
            console.log(event);
        };

        query.onerror = function(event) {
            console.log(event.target.errorcode);
        };

        txn.oncomplete = function(){
            db.close;
        }
    }

})(jQuery);

