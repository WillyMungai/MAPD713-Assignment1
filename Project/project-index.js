//seneca plugin 
var plugin = function(options) 
{
    var seneca = this;
    var getCount = 0;
    var postCount = 0;

    seneca.add({role: 'product', cmd: 'add' }, function (msg, respond){
        this.make('product').data$(msg.data).save$(respond);
        getCount = getCount++;
        postCount = postCount++;
        console.log('Request Count --> Get: ${getCount} Post: ${postCount}' );

    });

    seneca.add({role: 'product', cmd: 'get'}, function (msg, respond){
        this.make('product').load$(msg.data.product_id, respond);
        getCount = getCount++;
        console.log('Request Count --> Get: ${getCount} Post: ${postCount}' );
    });

    seneca.add({role: 'product', cmd: 'get-all'}, function(msg,respond){
        this.make('product').list$({}, respond);
        getCount = getCount++;
        console.log('Request Count --> Get: ${getCount} Post: ${postCount}' );
    });

    seneca.add({role: 'product', cmd: 'delete'}, function(msg, respond){
        this.make('product').remove$(msg.data.product_id, respond);

    });

    seneca.add({role: 'product', cmd: 'delete-all'}, function(msg,respond){
        this.make('product').list$({}, respond);
    });

}

module.exports = plugin;

//call backs
var seneca = require("seneca")();
seneca.use (plugin);
seneca.use('seneca-entity');

seneca.add('role:product, cmd: add-product', function(args, done)
{
    console.log("********** add-product");
    var product =
    {
        productname: args.productname,
        productprice: args.productprice,
        productcartegory: args.productcartegory,
        productinventory: args.productinventory,
        productdescription: args.productdescription
    }
    console.log("--> product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });

});

seneca.add('role:product, cmd:get-product', function (args, done) {
    console.log("--> cmd:get-product, args.productr_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'get', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:product, cmd:get-all-products', function (args, done) {
    console.log("--> cmd:get-all-products");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:product, cmd:delete-product', function (args, done) 
{
    console.log("--> cmd:delete-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'delete', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:product, cmd:delete-all-products', function (args, done) 
{   console.log(" --> cmd:delete-all-products");
    seneca.act({ role: 'product', cmd: 'delete-all' }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });
});

// Initiliazed express 
seneca.act('role:web', {
    use: {
        prefix: '/productinventory',
        pin: { role: 'product', cmd: '*' },
        map: {
            'add-product': { GET: true, POST: true},
            'get-product': { GET: true},
            'get-all-products': { GET: true},
            'delete-product': { GET: true}
        }
    }
})


//express web server
var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));

app.listen(3009)
console.log("Server listening on localhost:3009 ...");
console.log("----- Requests -------------------------");
console.log("http://localhost:3009/productinventory/add-product?productname=macbook&productprice=2000&productcartegory=Computer&productinventory=100&productdescription= 32gbram, 512ssd");
console.log("http://localhost:3009/productinventory/get-product?product_id=g8fdpw");
console.log("http://localhost:3009/productinventory/get-all-products");
console.log("http://localhost:3009/productinventory/delete-product?product_id=g8fdpw");
console.log("http://localhost:3009/productinventory/delete-all-products");