var express = require('express');
const router = express.Router();
var { con } = require('../../mysql-connect');
const validator = require('validator');

var isSuper = function (req, res, next){
  let xemail = req.get('X-Email');
    let sql = `select EMAIL, SUPER_USER from AD_ACCESS_USERS where EMAIL='${xemail}'`;
  
      con.query(sql, (err, result) => {
        if(err){
          let res1 = { 
            operation: 'authentication',
            status : -1,
            err : err.code 
            
          }
        return res.status(200).send(res1);
        }
        if(result == undefined || result == ''){
          let res1 = {
            operation: 'authentication',
            status: 0,
            message: 'Not authorized to take action.' 
          }
          return res.status(200).send(res1);
        }
        if(result[0].SUPER_USER != 1){
          let res1 = {
            operation: 'authentication',
            status: 0,
            message: 'Not authorized to take action.' 
          }
          return res.status(200).send(res1);
        }
        // let res1 = {
        //   operation: 'superuser',
        //   status: result[0].SUPER_USER
        // }
        next();
      })
}
/* GET ALL USERS */
router.post('/user/userall', function(req, res, next) {
  let reqparam = req.body.query ? req.body.query : '*';
  
  let sql = `select ${reqparam} from AD_ACCESS_USERS ORDER BY ID`;
    con.query(sql, (err, result) => {
    if(err){
    return res.status(400).send({ 
      operation: 'fetchuserall',
      status : 0,
      err : err.code
      
    });
    }
    res.status(200).send({operation: 'fetchuserall',result});
    
    });
});
/* GET ALL USERS with access*/
router.post('/user/all', function(req, res, next) {
    // let reqparam = req.get('X-Query') ? req.get('X-Query') : '*';
    // let sql = `select ${reqparam} from AD_ACCESS_USERS ORDER BY ID`;
    let lowercap = req.body.lowercap ? req.body.lowercap : req.body.lowercap;
    let uppercap = req.body.uppercap ? req.body.uppercap : req.body.uppercap;
    let sql;
    if(lowercap != undefined && uppercap != undefined){
       sql = `SELECT a.ID, a.NAME, a.EMAIL, a.SUPER_USER, b.AID, b.APPROVER, b.PROJECT, b.COSTCENTER, b.ACCESS_TYPE FROM (SELECT ID, NAME, EMAIL, SUPER_USER FROM AD_ACCESS_USERS ORDER BY ID LIMIT ${lowercap},${uppercap}) AS a LEFT OUTER JOIN AD_ACCESS_NEW AS b ON a.ID = b.ID ORDER BY a.ID;`;
      // sql = `select a.ID, a.NAME, a.EMAIL, a.SUPER_USER, b.AID, b.APPROVER, b.PROJECT, b.COSTCENTER, b.ACCESS_TYPE from AD_ACCESS_USERS a LEFT OUTER JOIN AD_ACCESS_NEW b on a.ID=b.ID ORDER BY a.ID`;
    }
    else{
       sql = `select a.ID, a.NAME, a.EMAIL, a.SUPER_USER, b.AID, b.APPROVER, b.PROJECT, b.COSTCENTER, b.ACCESS_TYPE from AD_ACCESS_USERS a LEFT OUTER JOIN AD_ACCESS_NEW b on a.ID=b.ID ORDER BY a.ID`;
    }
    
      
      con.query(sql, (err, result) => {
      if(err){
      return res.status(400).send({ 
        operation: 'fetchall1',
        status : 0,
        err : err.code
        
      });
      }
      // console.log(JSON.stringify(result, undefined,2));
      var result2 = new Array();
      for(var i=0;i<result.length;i++){
        var right = {
          AID: result[i].AID,
          APPROVER: result[i].APPROVER,
          PROJECT: result[i].PROJECT,
          COSTCENTER: result[i].COSTCENTER,
          ACCESS_TYPE: result[i].ACCESS_TYPE
        }
        // console.log(JSON.stringify(result, undefined,2));
        let indexarr = result[i].ID;
        if(result2[indexarr] == '' || typeof result2[indexarr] == undefined || result2[indexarr] == undefined){
          result2[indexarr] = {
            ID: result[i].ID,
            NAME: result[i].NAME,
            EMAIL: result[i].EMAIL,
            SUPER_USER: result[i].SUPER_USER,
            rights: new Array()
          };
          if(result[i].AID != null || result[i].AID != undefined){
            result2[indexarr].rights.push(right); 
          }
          
        }
        else{
          result2[indexarr].rights.push(right); 
        } 
      }
      result2 = result2.filter(function(n){ return n != undefined }); 
      res.status(200).send({operation: 'fetchall',result: result2});
      
      });
  });
  //GET SPECIFIC ACCESS DETAILS
  router.post('/user/fetchaccess', isSuper,  function(req, res, next) {
    let AID = req.body.aid;
      let sqlaccess = `select AID, APPROVER, PROJECT, COSTCENTER, ACCESS_TYPE from AD_ACCESS_NEW where AID='${AID}'`;
      con.query(sqlaccess, (err, result) => {
        if(err){
        return res.status(400).send({ 
          operation: 'fetchaccess',
          status : 0,
          err : err.code 
          
        });
        }
        res.status(200).send({
          operation: 'fetchaccess',
          result});
      });

  });
  //GET All ACCESS DETAILS of specific user
  router.post('/user/fetchaccessbyuser', isSuper,  function(req, res, next) {
    let ID = req.body.id;
    let COSTCENTER = req.body.business;
    let sqlaccess;
    if(COSTCENTER == undefined || COSTCENTER == ''){
      sqlaccess = `select PROJECT from AD_ACCESS_NEW where ID='${ID}'`;
    }
    else{
      sqlaccess = `select PROJECT from AD_ACCESS_NEW where ID='${ID}' AND COSTCENTER='${COSTCENTER}'`;
    }
      
      con.query(sqlaccess, (err, result) => {
        if(err){
        return res.status(400).send({ 
          operation: 'fetchaccessbyuser',
          status : 0,
          err : err.code 
          
        });
        }
        res.status(200).send({
          operation: 'fetchaccessbyuser',
          result});
      });

  });
/* GET SINGLE USER */
router.post('/user/fetchuser', isSuper,  function(req, res, next) {
    // let reqparam = req.get('X-Query') ? req.get('X-Query') : '*';
    let EMAIL = req.body.email;
    let ID = req.body.id;
    let sql;
    if(ID != undefined && ID != '')
    {
      sql = `select ID, NAME, EMAIL, SUPER_USER from AD_ACCESS_USERS where ID='${ID}'`;
    }
    else if(EMAIL != undefined && EMAIL != ''){
      sql = `select ID, NAME, EMAIL, SUPER_USER from AD_ACCESS_USERS where EMAIL='${EMAIL}'`;
    }
    
  
      con.query(sql, (err, result) => {
      if(err){
      return res.status(400).send({ 
        operation: 'fetchuser1',
        status : 0,
        err : err.code
        
      });
      }
      if(result[0] == undefined || result[0] == '' || result[0]== null){
        return res.status(200).send({
          operation: 'fetchuser',
          result,
          message: 'No User found'
        });
      }
      let userid = result[0].ID;
      let sqlaccess = `select AID, APPROVER, PROJECT, COSTCENTER, ACCESS_TYPE from AD_ACCESS_NEW where ID='${userid}'`;
      con.query(sqlaccess, (err, result2) => {
        if(err){
        return res.status(400).send({ 
          operation: 'fetchuser2',
          status : 0,
          err : err.code 
          
        });
        }
        // console.log(result2);
        var newres = Object.create(result);
        var actres =  newres;
        result[0].rights = result2;
        res.status(200).send({
          operation: 'fetchuser',
          result});
      });
        });
      
      
  });
  /* GET Super USER */
router.post('/user/issuperuser', function(req, res, next) {
    // let EMAIL = req.body.email;
    let EMAIL = req.get('X-Email');
    let sql = `select EMAIL, SUPER_USER from AD_ACCESS_USERS where EMAIL='${EMAIL}'`;
  
      con.query(sql, (err, result) => {
      if(err){
      return res.status(400).send({ 
        operation: 'superuser',
        status : -1,
        err: err.code
        
      });
      }
      // console.log(result);
      if(result[0]=='' || result[0]==null || result[0]==undefined){
        return res.status(200).send({
          operation: 'superuser',
          status: 0
        });
      }
      if(result[0].SUPER_USER != 1){
        return res.status(200).send({
            operation: 'superuser',
            status: result[0].SUPER_USER
          });
      }
      res.status(200).send({
        operation: 'superuser',
        status: result[0].SUPER_USER
      });
      
      });
  });
//   UPDATE USER ROUTER  // 
  router.post('/user/updateuser', isSuper, (req, res, next) => {
        let ID = req.body.id ? req.body.id.toString() : req.body.id;
        let NAME = req.body.name;
        let EMAIL = req.body.email;
        let SUPER_USER = req.body.super_user ? req.body.super_user : 0;
        
    if(validator.isEmpty(ID) || validator.isEmpty(NAME) || validator.isEmpty(EMAIL)){
        return res.status(400).send({ 
            operation: 'updateuser',
            status : 0,
            err : 'Validation error. please provide all param values except SUPER USER.'
            
          });
        }
        let sql = 'update AD_ACCESS_USERS SET NAME = ?, EMAIL = ?, SUPER_USER = ? where ID = ?';
    con.query(sql, [NAME, EMAIL, SUPER_USER, ID], (err, result) => {
      if(err){
        return res.status(400).send({ 
            operation: 'updateuser',
            status : 0,
            err : err.code 
            
          });
      }
      res.status(200).send({ 
        operation: 'updateuser',
        status : 1 
      });
    });
  });
//   UPDATE USER ACCESS ROUTER  //
router.post('/user/updateaccess', isSuper, (req, res, next) => {
    let ID = req.body.id ? req.body.id.toString() : req.body.id;
    // let APPROVER = req.body.approver ? req.body.approver : null;
    // let PROJECT = req.body.project;
    // let COSTCENTER = req.body.costcenter;
    let ACCESS_TYPE = req.body.access_type;
    
if(validator.isEmpty(ID)){
    return res.status(400).send({ 
        operation: 'updateaccess',
        status : 0,
        err : 'Validation error. please provide all param values.'
        
      });
    }
    let sql = 'update AD_ACCESS_NEW SET ACCESS_TYPE = ? where AID = ?';
con.query(sql, [ACCESS_TYPE, ID], (err, result) => {
  if(err){
    return res.status(400).send({ 
        operation: 'updateaccess',
        status : 0,
        err : err.code 
        
      });
  }
  res.status(200).send({ 
    operation: 'updateaccess',
    status : 1 
  });
});
});
//   Add User router
  router.post('/user/adduser', isSuper, (req, res, next) => {
    let NAME = req.body.name;
    let EMAIL = req.body.email;
    let SUPER_USER = req.body.super_user ? req.body.super_user : 0;

    let obj = {
      NAME,
      EMAIL,
      SUPER_USER
    };
    if(validator.isEmpty(NAME) || validator.isEmpty(EMAIL)){
        return res.status(400).send({ 
            operation: 'adduser',
            status : 0,
            err : 'Validation error. please provide all param values except SUPER USER.'
            
          });
        }
    let sql = 'insert into AD_ACCESS_USERS SET ?';
    con.query(sql, obj, (err, result) => {
      if(err){
        return res.status(400).send({ 
            operation: 'adduser',
            status : 0,
            err: err.code
          });
      }
      res.status(200).send({ 
        operation: 'adduser',
        status : 1 
        
      });
    });
  });
// Add User Access
  router.post('/user/addaccess', isSuper, (req, res, next) => {
    let ID = req.body.id ? req.body.id.toString() : req.body.id;
    let APPROVER = req.body.approver ? req.body.approver : null;
    let PROJECT = req.body.project;
    let COSTCENTER = req.body.costcenter;
    let ACCESS_TYPE = req.body.access_type;
    

    let obj = {
        ID,
        APPROVER,
        PROJECT,
        COSTCENTER,
        ACCESS_TYPE
    };
    if(validator.isEmpty(ID) || validator.isEmpty(PROJECT) || validator.isEmpty(COSTCENTER)){
        return res.status(400).send({ 
            operation: 'addaccess',
            status : 0,
            err : 'Validation error. please provide all param values except APPROVER AND ACCESSTYPE.'
            
          });
        }
    let sql = 'insert into AD_ACCESS_NEW SET ?';
    con.query(sql, obj, (err, result) => {
      if(err){
        return res.status(400).send({ 
            operation: 'addaccess',
            status : 0,
            err : err.code 
          });
      }
      res.status(200).send({ 
        operation: 'addaccess',
        status : 1 
        
      });
    });
  });

//   DELETE USER  //
router.post('/user/deleteuser', isSuper, function(req, res, next){
    let EMAIL = req.body.email;
    if(validator.isEmpty(EMAIL)){
        return res.status(400).send({ 
            operation: 'deleteuser',
            status : 0,
            err : 'Validation error. please provide EMAIL.'
            
          });
        }
    let sql = 'delete from AD_ACCESS_USERS where EMAIL = ?';
    con.query(sql, EMAIL, (err, result) => {
      if(err){
        return res.status(400).send({ 
            operation: 'deleteuser',
            status : 0,
            err : err.code 
          });
      }
  
      res.status(200).send({ 
        operation: 'deleteuser',
        status : 1 
      });
    });
});
router.post('/user/deleteaccess', isSuper, function(req, res, next){
    let AID = req.body.id ? req.body.id.toString() : req.body.id;
    if(validator.isEmpty(AID)){
        return res.status(400).send({ 
            operation: 'deleteaccess',
            status : 0,
            err : 'Validation error. please provide ID.'
            
          });
        }
    let sql = 'delete from AD_ACCESS_NEW where AID = ?';
    con.query(sql, AID, (err, result) => {
      if(err){
        return res.status(400).send({ 
            operation: 'deleteaccess',
            status : 0,
            err : err.code 
          });
      }
  
      res.status(200).send({ 
        operation: 'deleteaccess',
        status : 1 
      });
    });
});
/* GET SINGLE USER */
router.post('/user/test', isSuper, function(req, res, next) {
  let reqparam = req.get('X-Query') ? req.get('X-Query') : '*';
  let xemail = req.get('X-Email');
  let EMAIL = req.body.email;
  res.status(200).send({'status':'allcrossed'});
  // let sql = `select ${reqparam} from AD_ACCESS_USERS where EMAIL='${EMAIL}'`;

  //   con.query(sql, (err, result) => {
  //   if(err){
  //   return res.status(400).send({ 
  //     operation: 'fetchuser',
  //     status : 0,
  //     err 
      
  //   });
  //   }
  //   res.status(200).send({
  //       operation: 'fetchuser',
  //       result});
  //   });
});

router.post('/user/*', function(req, res, next) {
  let validatestatus = 'Not Allowed!';
  res.status(400).send({status: validatestatus});
})
router.get('/user/*',  function(req, res, next) {
  let validatestatus = 'Not Allowed!';
  res.status(400).send({status: validatestatus});
})
router.put('/user/*', function(req, res, next) {
  let validatestatus = 'Not Allowed!';
  res.status(400).send({status: validatestatus});
})
router.patch('/user/*', function(req, res, next) {
  let validatestatus = 'Not Allowed!';
  res.status(400).send({status: validatestatus});
})
router.delete('/user/*', function(req, res, next) {
  let validatestatus = 'Not Allowed!';
  res.status(400).send({status: validatestatus});
});


  module.exports = router;