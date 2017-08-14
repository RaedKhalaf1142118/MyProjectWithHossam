/**
 * Created by nkhalaf on 4/1/2017.
 */
var dataBaseConnection = require('../Utils/DataBaseConnection');

var NotificationController = {



    /**
     * get all the notifications  for all the categories
     *
     * @param callBack object contain the success and the fial functions
     */
    getNotifications: function ( callBack) {
        var notifications = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * from notification LIMIT 3', function (err, rows, fields) {
            if (!err) {
                notifications = JSON.stringify(rows);
                dataBaseConnection.disConnect();
                callBack.success(notifications);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });

    },
    /**
     * get all the notification in some specific category
     *
     * @param id the id of the category
     * @param callBack callBack object contain the success function and the fail function
     *
     *
     * TODO to add the sql statement to display only the needed notifications
     */
    getNotificationsByCategoryId: function (id, callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `notification` WHERE `ntf_ID` = ? LIMIT 3', [id], function (err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        this.notification = JSON.stringify(rows[0]);
                        dataBaseConnection.disConnect();
                        callBack.success(this.notification);

                    }else{
                        dataBaseConnection.disConnect();
                        callBack.fail();

                    }
                }
                else {
                    console.log('Error while performing Query.');
                    dataBaseConnection.disConnect();
                    callBack.fail(err);
                }
            }
        );
    },
    /**
     * add notification for specific catefory
     * @param categoryId  : the catefory to addd the notification to
     * @param notification : object contain the needed data for the notification  (ntf_context , image_name , ..)
     * @param callBack : object contain the success and the fail methods
     *
     */
    addNotification: function (ctg_ID,notification, callBack) {
        var connection = dataBaseConnection.connect();
        this.notification = notification;
        this.ctg_ID =ctg_ID;
        var self = this;
        var addNotificaionQuery  = connection.query('INSERT INTO notification SET ?', notification, function (err, result) {
            if (!err) {
                var t = {"ctg_ID":ctg_ID,"ntf_ID":result.insertId};
                var addToCategory  = connection.query('INSERT INTO ctg_contains_ntfs SET ?',t, function (err,result2) {
                   if(!err){
                        dataBaseConnection.disConnect();
                       callBack.success(notification);
                   } else{
                       dataBaseConnection.disConnect();
                       callBack.fail(err);
                   }
                });
            } else {
                callBack.fail(err);
            }
        });
    },
    /**
     * delete a notification by it's id
     * @param id the id of the notification to be deleted
     * @param callBack object caontain the success and the fial methods
     */
    deleteNotification: function (id, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('DELETE FROM `notification` WHERE `ntf_ID` = ?', [id], function (err, result) {
            if (!err) {1
                dataBaseConnection.disConnect();
                callBack.success();
            } else {
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });
    },
    /**
     * update the value of the notification
     * @param notification the new values of the notification to be saved
     * @param callBack object contain the success and the fail methods
     */
    updateNotification: function (notification, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('UPDATE  notification SET ? WHERE `ntf_ID` = ? ', [notification, notification.ntf_ID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                return true;
            } else {
                dataBaseConnection.disConnect();
                return false;
            }
        });
    }

}
module.exports = NotificationController;

