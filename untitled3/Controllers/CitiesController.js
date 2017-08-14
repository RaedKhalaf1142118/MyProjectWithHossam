/**
 * Created by nkhalaf on 4/1/2017.
 */
var dataBaseConnection = require('../Utils/DataBaseConnection');

var CitiesController = {
    getCities: function (callBack) {
        var cities = [];
        var connection = dataBaseConnection.connect();
        connection.query('SELECT * from cities', function (err, rows, fields) {
            if (!err) {
                cities = JSON.stringify(rows);
                dataBaseConnection.disConnect();
                callBack.success(cities);
            }
            else {
                console.log('Error while performing Query.');
                dataBaseConnection.disConnect();
                callBack.fail();
            }
        });
    }

}
module.exports = CitiesController;

