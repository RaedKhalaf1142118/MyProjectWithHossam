var express = require('express');
var router = express.Router();
var CategoryController = require('../Controllers/CategoryController.js')

/* GET users */
router.get('/', function (req, res, next) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var id = query.id;

        var categories = CategoryController.getcategories({
            success: function (categories) {
                res.send(categories);
            },
            fail: function () {
                res.send("cities not found ");
            }
        }, id);

});
router.get('/allCategories', function (req, res, next) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var id = query.id;

    var categories = CategoryController.getAllcategories({
        success: function (categories) {
            res.send(categories);
        },
        fail: function () {
            res.send("cities not found ");
        }
    });

});
router.get('/:id', function (req, res, next) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var showSubCategories = query.showSubCategories;
    if (showSubCategories&&showSubCategories=="false") {
        CategoryController.getAllNotificationForAllSubCategories(req.params.id, {
            success: function (categories) {
                res.send(categories);
            },
            fail: function () {
                res.send(err);
            }
        })
    }else {
        this.user = CategoryController.getChildrenCategories(req.params.id, {
            success: function (notifications) {
                res.send(notifications);
            },
            fail: function (err) {
                res.send(" " + err);
            }
        });
    }
}).post('/', function (req, res) {
    var body = req.body;
    var category = {
        category_Name:body.category_Name,
        cityID:body.cityID,
        description:body.description,
        isParent:"true"
    }
    CategoryController.addCategory(category, {
        success: function (result) {
            category["category_ID"]=result.insertId;
             res.send(category);
        }, fail: function (err) {
            res.send("Error while creating category",err);

        }
    });
}).post('/subCategory', function (req, res,next) {
    var body = req.body;
    var parentID = body.parentID ;
    var category = {
        category_Name:body.category_Name,
        cityID:body.cityID,
        description:body.description
    }
    CategoryController.addCategory(category, {
        success: function (result) {
            CategoryController.AssociateCategoryWithParent(parentID,result.insertId,{
                success:function () {
                    category["category_ID"]=result.insertId;
                    category["isParent"]=false;
                    res.send(category);
                },fail:function (err) {
                    res.send("Error while associating category to parent");
                }
            })
        }, fail: function (err) {
            res.send("Error while creating category");

        }
    });
});
module.exports = router;
