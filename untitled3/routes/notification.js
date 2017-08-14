var express = require('express');
var router = express.Router();
var NotificationController = require('../Controllers/NotificationController')
var multer = require('multer');

var uploadNotificationImage = function (req, res, notificationID,notification) {
    var Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./public/images/notifications");
        },
        filename: function (req, file, callback) {
            callback(null, notificationID + ".jpg");
        }
    });
    var upload = multer({
        storage: Storage
    }).array("ntf_imgName", 3); //Field name and max count
    //Upload the Image
    upload(req, res, function (err) {
        if (err) {
            res.send("false");
        }
        res.send(notification);
    })
};
/**
 * get all the notification per category
 */
router.get('/', function (req, res, next) {
    var notifications = NotificationController.getNotifications({
        success: function (notifications) {
            res.send(notifications);
        },
        fail: function () {
            res.send("notification not found ");
        }
    });

})
/**post notification
 *
 * expected data
 * ntf_ID  : notification ID to be added
 * ntf_data : the created date for the notification
 * ntf_textContent  : the content of the notification
 * ntf:imageName : the name of the image to be added in the notification
 * ntf_categoryID : the id of the category to add the notification on
 *
 *TODO to delete the ntf_id because it's autoincrement value
 *
 * **/
    .post('/', function (req, res,next) {
        var body = req.body;
        var notification = {
            ntf_Date: body.ntf_Date,
            ntf_textContent: body.ntf_textContent,
            ntf_imgName: body.ntf_imgName,
            user_ID:body.user_ID
        };
        var cateogryId = body.ntf_categoryID;
        NotificationController.addNotification(cateogryId, notification,
            {
                success: function (result) {
                    result["ntf_ID"]=result.insertId ;
                    if (body.ntf_imgName) {
                        uploadNotificationImage(req, res, result.insertId,result);
                    } else {
                        res.send(result);
                    }

                },
                fail: function (err) {
                    res.send("false");

                }
            });
    })
    .delete('/', function (req, res) {
        var id = req.body.ntf_ID;
        NotificationController.deleteNotification(id, {
            success: function () {
                res.send("Deleted");
            },
            fail: function (err) {
                res.send(err);
            }
        })
    });

/**
 * get the all notification for specific category by  it's id
 *
 * the expected data is the id of the category  to be returned
 *
 */
router.get('/:id', function (req, res, next) {
    this.notification = NotificationController.getNotificationsByCategoryId(req.params.id, {
        success: function (notification) {
            res.send(notification);
        },
        fail: function (err) {
            res.send("notification not found " + err);
        }
    });
});
module.exports = router;
