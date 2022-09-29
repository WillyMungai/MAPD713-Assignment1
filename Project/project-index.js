//seneca plugin 
var plugin = function(options) 
{
    var seneca = this;

    seneca.add({role: 'product', cmd: 'add' }, function (msg, respond){
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({role: 'product', cmd: 'get'}, function (msg, respond){
        this.make('product').load$(msg.data.product_id, respond);
    });

    seneca.add({role: 'product', cmd: 'get-all'}, function(msg,respond){
        this.make('product').list$({}, respond);
    });

    seneca.add({role: 'product', cmd: 'delete'}, function(msg, respond){
        this.make('product').remove$(msg.data.product_id, respond);

    });

}

module.exports = plugin;

//call backs
var seneca = require("seneca")();
seneca.use (plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd: add-product', function(args, done)
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
    console.log("********** product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });

});

seneca.add('role:api, cmd:get-product', function (args, done) {
    console.log("--> cmd:get-product, args.productr_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'get', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-products', function (args, done) {
    console.log("********** cmd:get-all-products");
    seneca.act({ role: 'products', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-product', function (args, done) 
{
    console.log("********** cmd:delete-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'delete', data: { product_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-products', function (args, done) 
{   console.log(null, "********** cmd:delete-all-products");
    seneca.act({ role: 'products', cmd: 'get-all' }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });
});

// Initiliazed express 
seneca.act('role:web', {
    use: {
        prefix: '/productinventory',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { GET: true, POST: true },
            'get-all-product': { GET: true },
            'get-product': { GETT: true, },
            'delete-product': { GET: true, }
        }
    }
})

let countGet=0;
let countPost=0;

var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));