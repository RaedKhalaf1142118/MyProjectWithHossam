var express = require('express');
var router = express.Router();
var UserController = require('../Controllers/UserController.js')
var multer = require('multer');

var uploadUserImage = function (req, res, userID) {
    var Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./public/images/users");
        },
        filename: function (req, file, callback) {
            callback(null, userID + ".jpg");
        }
    });
    var upload = multer({
        storage: Storage
    }).array("user_imgName", 3); //Field name and max count
    //Upload the Image
    upload(req, res, function (err) {
        if (err) {
            res.send("notification added but Something went wrong when upload image!");
        }
        res.send("notification added ");
    })
}
/* GET users */
router.get('/', function (req, res, next) {
    var users = UserController.getUsers({
        success: function (users) {
            res.send(users);
        },
        fail: function () {
            res.send("user not found ");
        }
    });

})
/**post User **/
    .post('/registry', function (req, res) {
        var body = req.body;

        var user = {
            user_name: body.user_name,
            user_password: body.user_password,
            user_email: body.user_email,
            user_region: body.user_region,
            user_phone: body.user_phone,
            user_Type: 2
        };
        UserController.addUser(user,{
        success: function (user) {
            res.send(user)
        }, fail: function (err) {
            res.send(false)

        }
        });

    }).post('/', function (req, res) {
    var body = req.body;
    UserController.logInUser(body.user_email, body.user_password, {
        success: function (user) {
            res.send(user)
        }, fail: function (err) {
            res.send(false)

        }
    });
})
    .delete('/', function (req, res) {
        var id = req.body.user_ID;
        UserController.deleteUser(id, {
            success: function () {
                res.send("Deleted");
            },
            fail: function (err) {
                res.send(err);
            }
        })
    });
router.post('/uploadImage/:id', function (req, res){
    UserController.updateUserImage(req.params.id,{
        success: function (user) {
            uploadUserImage(req,res,req.params.id);
 5        },
        fail: function (err) {
            res.send("user not found " + err);
        }
    });

});
router.get('/:id', function (req, res, next) {
    this.user = UserController.getUserById(req.params.id, {
        success: function (user) {
            res.send(user);
        },
        fail: function (err) {
            res.send("user not found " + err);
        }
    });
});
module.exports = router;
