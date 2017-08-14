/**
 * Created by nkhalaf on 4/1/2017.
 */
var dataBaseConnection = require('../Utils/DataBaseConnection');

var UserController = {
    getUsers: function (callBack) {
        var users = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * from ntf_user', function (err, rows, fields) {
            if (!err) {
                users = JSON.stringify(rows);
                dataBaseConnection.disConnect();
                callBack.success(users);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });

    },
    logInUser:function (userEmail,password,callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `ntf_user` WHERE `user_email`=? and `user_password`=?', [userEmail,password], function (err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        this.user = JSON.stringify(rows[0]);
                        dataBaseConnection.disConnect();
                        callBack.success(this.user);

                    }else{
                        dataBaseConnection.disConnect();
                        callBack.fail(err);

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
    getUserById: function (id, callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `ntf_user` WHERE `user_ID` = ? ', [id], function (err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        this.user = JSON.stringify(rows[0]);
                        dataBaseConnection.disConnect();
                        callBack.success(this.user);

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
    addUser: function (user, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('INSERT INTO ntf_user SET ?', user, function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success(user);
            } else {
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });
    },
    deleteUser: function (id, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('DELETE FROM `ntf_user` WHERE `user_ID` = ?', [id], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success();
            } else {
                dataBaseConnection.disConnect();
               callBack.fail(err);
            }
        });
    },
    updateUser: function (user, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('UPDATE  ntf_user SET ? WHERE `user_ID` = ? ', [user, id.user_ID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                return true;
            } else {
                dataBaseConnection.disConnect();
                return false;
            }
        });
    },
    updateUserImage:function (userId,callBack) {
        var connection = dataBaseConnection.connect();
        var image = "images/users/"+userId+".jpg";
        var query = connection.query('UPDATE `ntf_user` SET `userImage`=? WHERE `user_ID` = ?  ', [image,userId], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success();
            } else {
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });

    }

}
module.exports = UserController;

