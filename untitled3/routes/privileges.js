var express = require('express');
var router = express.Router();
var PrivilegeController = require('../Controllers/PrivilegeController.js')

/* GET users */
router.get('/', function (req, res, next) {
    var users = PrivilegeController.getPrivileges({
        success: function (privileges) {
            res.send(privileges);
        },
        fail: function () {
            res.send("privileges not found ");
        }
    });

}).get('/user/:id', function (req, res, next) {
    var id = req.params.id;
    var users = PrivilegeController.getUserPrivilege(id, {
        success: function (privileges) {
            res.send(privileges);
        },
        fail: function () {
            res.send("privileges not found ");
        }
    });
}).post('/user/addPrivilege', function (req, res) {
    var body = req.body;

    PrivilegeController.addPrivilegeToUser(body.privilege_ID, body.user_ID, {
        success: function (result) {
            res.send(result);
        },
        fail: function () {
            res.send("privileges not found ");
        }
    });

}).post('/user/deletePrivilege', function (req, res) {
    var body = req.body;

    PrivilegeController.deleteUserPrivilege(body.privilege_ID, body.user_ID, {
        success: function (result) {
            res.send(result);
        },
        fail: function () {
            res.send("privileges not found ");
        }
    });

}).post('/addPrivilegeProfile', function (req, res) {
    var body = req.body;
    var profile = {
        profile_name:body.profile_name,
        number_of_notification:body.number_of_notification
    };
    PrivilegeController.createPrivileeProfile(profile,{
        success: function (result) {
            res.send(result);
        },
        fail: function (err) {
            res.send("false");
        }
    });
}).get('/category/:id', function (req, res, next) {
    var id = req.params.id;
    var users = PrivilegeController.getcategoriesForSpecificPrivilegeProfile(id, {
        success: function (result) {
            res.send(result);
        },
        fail: function (err) {
            res.send(err);
        }
    });
}).post('/category/addPrivilege', function (req, res) {
    var body = req.body;

    PrivilegeController.addCategoryToPrivilege(body.category_ID,body.privilege_ID, {
        success: function (result) {
            res.send(result);
        },
        fail: function () {
            res.send("privilege not added ");
        }
    });

}).post('/category/deletePrivilege', function (req, res) {
    var body = req.body;

    PrivilegeController.deleteCategoryPrivilege(body.category_ID,body.privilege_ID, {
        success: function (result) {
            res.send(result);
        },
        fail: function () {
            res.send("privilege not added ");
        }
    });

});



module.exports = router;
