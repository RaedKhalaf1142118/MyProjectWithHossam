var mysql  = require('mysql');


var Connection = {
    connection : {},
 connect: function () {
    this.connection = mysql.createConnection({
         host     : 'localhost',
         user     : 'root',
         password : '',
         database : 'notification'
     });
    this.connection.connect();
    return  this.connection ;
},
    disConnect:function () {
        if(!this.connection)
        this.connection.end();
    }
}
module.exports =Connection ;
