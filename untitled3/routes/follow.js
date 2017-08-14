var express = require('express');
var router = express.Router();
var FollowController = require('../Controllers/FollowController.js')
var multer = require('multer');

/* GET users */
router.get('/user/:id', function (req, res, next) {
    var id =req.params.id;
    var categories = FollowController.getFollowdCategories(id,{
        success: function (categories) {
            res.send(categories);
        },
        fail: function () {
            res.send("no followed categories");
        }
    });

})
/**post User **/
    .post('/user', function (req, res) {
        var body = req.body;

        FollowController.followCategory(body.user_ID,body.category_ID,{
            success: function (result) {
                res.send(result)
            }, fail: function (err) {
                res.send(false)

            }
        });

    }).post('/user', function (req, res) {
    var body = req.body;

    FollowController.followCategory(body.user_ID,body.category_ID,{
        success: function (result) {
            res.send(result)
        }, fail: function (err) {
            res.send(false)

        }
    });
    }).get('/category/getFollowersCount/:id', function (req, res, next) {
        var id =req.params.id;
        var categories = FollowController.getFollowersCount(id,{
            success: function (categories) {
                res.send('{"count":'+categories+'}');
            },
            fail: function () {
                res.send(false);
            }
        });

    }).get('/category/getFollowers/:id', function (req, res, next) {
    var id =req.params.id;
    var categories = FollowController.getFollowers(id,{
        success: function (users) {
            res.send(users);
        },
        fail: function () {
            res.send(false);
        }
    });

});


module.exports = router;
