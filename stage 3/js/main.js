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
    

    // purchasable items

    function add_to_cart(item){
        switch(item){
            case 0:
                insertItem(item_db,{
                    item_id :0,
                    name : 'Boba Tea Mix',
                    price : 19.00
                });
                break;
            case 1:
                //
                break;
            case 2:
                //
                break;
            case 3:
                //
                break;
        }
    }


    //
    

    // Building database
    const cart_btn = document.getElementById("addToCart");

    cart_btn.onclick = function() {
        getAccountId(0);
        console.log(localStorage.getItem("test"));
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
        
       
    }

    // creating cart database
    req_cart_db.onsuccess = (event) => {
        cart_db = event.target.result;

        insertCart(cart_db,{
            account_id : 0,
            item_id : 0,
            quantity : 10
        })

    }

    // creating item database
    req_item_db.onsuccess = (event) => {
        item_db = event.target.result;
    }

    req_cart_db.onupgradeneeded = (event) => {
        let db = event.target.result;
        let store = db.createObjectStore('Cart',{autoIncrement: true});
        store.createIndex('account_id','Accounts',{unique: true});
        store.createIndex('item_id','Items',{unique: true});
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

