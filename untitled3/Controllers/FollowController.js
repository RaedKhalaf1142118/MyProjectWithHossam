/**
 * Created by nkhalaf on 4/1/2017.
 */
var dataBaseConnection = require('../Utils/DataBaseConnection');

var UserController = {
    getFollowdCategories: function (user_ID,callBack) {
        var categories = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `user_follow_category` WHERE `user_ID`= ?', [user_ID],function (err, rows, fields) {
            if (!err) {
                 var categoriesIds = [];
                rows.forEach(function (category) {
                    categoriesIds.push(category.category_ID);
                });
                if(categoriesIds.length>0){
                    connection.query('SELECT * FROM `category` WHERE `category_ID` in (?)', [categoriesIds], function (err, rows, fields) {
                        if (!err) {
                            var categories = JSON.stringify(rows);
                            callBack.success(categories);
                        } else {
                            console.log('Error while performing Query.');
                            dataBaseConnection.disConnect();
                            callBack.fail(err)
                        }
                    });
                }else{
                    dataBaseConnection.disConnect();
                    callBack.success("[]");

                }
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });

    },
    followCategory:function (user_ID,category_ID,callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('INSERT INTO `user_follow_category`(`user_ID`, `category_ID`) VALUES (?,?)', [user_ID,category_ID], function (err, rows, fields) {
                if (!err) {
                     callBack.success("true");
                }
                else {
                    console.log('Error while performing Query.');
                    dataBaseConnection.disConnect();
                    callBack.fail(err);
                }
            }
        );

    },
    getFollowersCount:function (category_ID,callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT COUNT(`category_ID`) FROM user_follow_category  WHERE `category_ID`=?', [category_ID], function (err, rows, fields) {
            if (!err) {
                callBack.success(rows[0]["COUNT(`category_ID`)"]);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });

    },getFollowers:function (category_ID,callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM user_follow_category  WHERE `category_ID`=?', [category_ID], function (err, rows, fields) {
            if (!err) {
                var usersId = [] ;
                 rows.forEach(function (user) {
                     usersId.push(user.user_ID);
                });
                if(usersId.length>0){
                    connection.query('SELECT * FROM `ntf_user` WHERE `user_ID` in (?)', [usersId], function (err, rows, fields) {
                        if (!err) {
                            var users = JSON.stringify(rows);
                            callBack.success(users);
                        } else {
                            console.log('Error while performing Query.');
                            dataBaseConnection.disConnect();
                            callBack.fail(err)
                        }
                    });
                }else{
                    dataBaseConnection.disConnect();
                    callBack.success("[]");

                }

            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });

    }

}
module.exports = UserController;

