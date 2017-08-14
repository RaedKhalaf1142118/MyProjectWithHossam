/**
 * Created by nkhalaf on 4/1/2017.
 */
var dataBaseConnection = require('../Utils/DataBaseConnection');

var CategoryController = {

    getAllcategories: function (callBack) {
        var categories = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `category` ', function (err, rows, fields) {
            if (!err) {
                categories = JSON.stringify(rows);
                dataBaseConnection.disConnect();
                callBack.success(categories);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });

    },
    getcategories: function (callBack, id) {
        var categories = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `category` WHERE `isParent`= "true" and `cityID` =?', [id], function (err, rows, fields) {
            if (!err) {
                categories = JSON.stringify(rows);
                dataBaseConnection.disConnect();
                callBack.success(categories);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });

    },
    getChildrenCategories: function (id, callBack) {
        var self = this;
        self.categoryId = id;
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `ctg_contains_ctgs` WHERE `parent_ID`=?', [id], function (err, rows, fields) {
                if (!err) {
                    var categories = [];
                    var categoryIds = [];
                    if (rows.length > 0) {
                        rows.forEach(function (category) {
                            categoryIds.push(category.child_ID);

                        });
                        connection.query('SELECT * FROM `category` WHERE `category_ID` in (?)', [categoryIds], function (err, rows, fields) {
                            if (!err) {
                                var categoriesJson = {"categories": rows};
                                var categories = JSON.stringify(categoriesJson);
                                dataBaseConnection.disConnect();
                                callBack.success(categories);
                            } else {
                                dataBaseConnection.disConnect();
                                callBack.fail();
                            }
                        });
                    } else {
                        self.getNotification(id,{
                            success:function (notifications) {
                                dataBaseConnection.disConnect();
                                callBack.success(notifications);
                            },fail:function (err) {
                                dataBaseConnection.disConnect();
                                callBack.fail(err)
                            }
                        });
                    }
                }else {
                    console.log('Error while performing Query.');
                    dataBaseConnection.disConnect();
                    callBack.fail(err);
                }
            }
        );
    },
    getNotification:function (id,callBack) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `ctg_contains_ntfs` WHERE `ctg_ID` in (?)', [id], function (err, rows, fields) {
            var notificationIds = [];
            if(!err){
            if (rows.length > 0) {
                rows.forEach(function (notification) {
                    notificationIds.push(notification.ntf_ID);
                });
                connection.query('SELECT * FROM `notification` WHERE `ntf_ID` in (?) LIMIT 4', [notificationIds], function (err, rows, fields) {
                    if (!err) {
                        var notificationsJson = {"notifications": rows, "category_ID": id};
                        var notifications = JSON.stringify(notificationsJson);
                        dataBaseConnection.disConnect();
                        callBack.success(notifications);
                    } else {
                        dataBaseConnection.disConnect();
                        callBack.fail(err);
                    }
                });
            } else {
                callBack.success('{"notifications":[]}');
            }
            }else{
                callBack.fail('{"notifications":['+err+']}');
            }
        });
    },
    getAllNotificationForAllSubCategories: function (id, callBack) {
        var self = this ;
        var categories = [];
        var connection = dataBaseConnection.connect();
         connection.query('SELECT * FROM `ctg_contains_ctgs` WHERE `parents_path` like "%-?-%"', [parseInt(id)], function (err, rows, fields) {
            if (!err) {
                var categoryIds = [];
                categories = JSON.stringify(rows);
                rows.forEach(function (category) {
                    categoryIds.push(category.child_ID);
                });
                if(categoryIds.length>0){
                self.getNotification(categoryIds,{
                    success:function (notifications) {
                        dataBaseConnection.disConnect();
                        callBack.success(notifications);
                    },fail:function (err) {
                        dataBaseConnection.disConnect();
                        callBack.fail(err)
                    }
                });
             }else{
                    callBack.success('{"notifications":[]}');
                }
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });
    },

    getCategoryById: function (id, callback) {
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `category` WHERE `category_ID` = ?', [id], function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    var categories = JSON.stringify(rows[0]);
                    dataBaseConnection.disConnect();
                    callback.success(categories);
                } else {
                    callback.success(JSON.stringify("{}"));
                }
            }else {
                dataBaseConnection.disConnect();
                callback.fail();
            }
        });
    },
    addCategory: function (category, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('INSERT INTO category SET ?', category, function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success(result);
            } else {
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });

    },
    AssociateCategoryWithParent: function (parentId, categoryID, callBack) {
        var connection = dataBaseConnection.connect();
        var query2 = connection.query('SELECT * FROM `ctg_contains_ctgs` WHERE `parent_ID`= ?', [parentId], function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    var category = JSON.stringify(rows[0]);
                    var parents_path = category.parents_path+"-"+parentId+"-";
                    var query = connection.query('INSERT INTO `ctg_contains_ctgs`(`parent_ID`, `child_ID`,`parents_path`) VALUES (?,?)', [parentId,categoryID,parents_path], function (err, result) {
                        if (!err) {
                            dataBaseConnection.disConnect();
                            callBack.success();
                        } else {
                            dataBaseConnection.disConnect();
                            callBack.fail(err);
                        }
                    });

                } else {
                    callBack.success(JSON.stringify("{}"));
                }
            } else {
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });
    }
}
module.exports = CategoryController;

