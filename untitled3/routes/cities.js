var express = require('express');
var router = express.Router();
var  CitiesController = require('../Controllers/CitiesController.js')

/* GET users */
router.get('/', function (req, res, next) {
    var cities = CitiesController.getCities({
        success:function (cities) {
            res.send(cities);
        },
        fail:function () {
            res.send("cities not found ");
        }
    });

});
module.exports = router;
