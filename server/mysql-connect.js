const CryptoJS = require('crypto-js');
const mysql = require('mysql');

var bytes  = CryptoJS.AES.decrypt(process.env.mysql_setting, process.env.m_nacl);
var mysql_params = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


var con = mysql.createConnection({
    host: mysql_params.host,
    user: mysql_params.user,
    password: mysql_params.pass,
    database: mysql_params.db
});
con.connect((err, result) => {
    if(err){
        return console.log('something went wrong : ',err);
    }
    console.log('Mysql Connection -good');
});

module.exports = {
    con
}