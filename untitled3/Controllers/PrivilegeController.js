/**
 * Created by nkhalaf on 4/1/2017.
 */
var dataBaseConnection = require('../Utils/DataBaseConnection');

var PrivilegeController = {
    getPrivileges: function (callBack) {
        var privileges = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * from privilege_profile', function (err, rows, fields) {
            if (!err) {
                privileges = JSON.stringify(rows);
                dataBaseConnection.disConnect();
                callBack.success(privileges);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail(err);
            }
        });

    },
    createPrivileeProfile: function (privileeProfile, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('INSERT INTO privilege_profile SET ?', privileeProfile, function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                privileeProfile["profile_ID"] = result.insertId;
                callBack.success(privileeProfile);
            } else {
                dataBaseConnection.disConnect();
                callBack.fail("false");
            }
        });

    },
    addPrivilegeToUser: function (privilegeID, userID, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('INSERT INTO `user_has_privilege`(`privilege_ID`, `user_ID`) VALUES (?,?)', [privilegeID, userID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success("true");
            } else {
                dataBaseConnection.disConnect();
                callBack.fail("false");
            }
        });
    },deleteUserPrivilege: function (privilegeID, userID, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('DELETE FROM `user_has_privilege` WHERE `privilege_ID` = ? and `user_ID`= ?', [privilegeID, userID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success("true");
            } else {
                dataBaseConnection.disConnect();
                callBack.fail("false");
            }
        });
    },
    addPrivilegeToCategory: function (cateogryID, privilegeID, callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('INSERT INTO `category_need_privilege`(`category_ID`, `profile_ID`) VALUES (?,?)', [cateogryID, privilegeID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success("true");
            } else {
                dataBaseConnection.disConnect();
                callBack.fail("false");
            }
        });
    },
    getUserPrivilege: function (userId, callBack) {
        var privileges = [];
        var id = parseInt(userId);
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `user_has_privilege` WHERE `user_ID` = ?', [id], function (err, rows, fields) {
            if (!err) {
                var privilegeIds = [];
                rows.forEach(function (privilege) {
                    privilegeIds.push(privilege.privilege_ID);
                });
                if (privilegeIds.length > 0) {
                    connection.query('SELECT * FROM `privilege_profile` WHERE `profile_ID`in (?)', [privilegeIds], function (err, rows, fields) {
                        if (!err) {
                            var privileges = JSON.stringify(rows);
                            callBack.success(privileges);
                        } else {
                            console.log('Error while performing Query.');
                            dataBaseConnection.disConnect();
                            callBack.fail(err)
                        }
                    });
                } else {
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
    getcategoriesForSpecificPrivilegeProfile:function (profileId,callBack) {

        var id = parseInt(profileId);
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * FROM `category_need_privilege` WHERE  `profile_ID` = ?', [id], function (err, rows, fields) {
            if (!err) {
                var categoriesIds = [];
                rows.forEach(function (row) {
                    categoriesIds.push(row.category_ID);
                });
                if (categoriesIds.length > 0) {
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
                } else {
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
    addCategoryToPrivilege:function (category_ID,privilege_ID) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('INSERT INTO `category_need_privilege`(`category_ID`, `profile_ID`) VALUES (?,?)', [category_ID, privilege_ID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success("true");
            } else {
                dataBaseConnection.disConnect();
                callBack.fail("false");
            }
        });
    },
    deleteCategoryPrivilege:function (category_ID,privilege_ID,callBack) {
        var connection = dataBaseConnection.connect();
        var query = connection.query('DELETE FROM `category_need_privilege` WHERE `category_ID` = ? and `profile_ID` = ?', [category_ID, privilege_ID], function (err, result) {
            if (!err) {
                dataBaseConnection.disConnect();
                callBack.success("true");
            } else {
                dataBaseConnection.disConnect();
                callBack.fail("false");
            }
        });
    }

}
module.exports = PrivilegeController;

