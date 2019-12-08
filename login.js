const bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');
const bcrypt = require('bcrypt');



module.exports = (app, User) => {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/', function(req, res) {
    return res.render('login.html');
  })

  app.get('/register', function(req, res) {
    res.render('register.html');
  });

  app.get('/reset_pw', function(req, res){
  res.render('reset_pw.html');
  });

  app.get('/good', (req, res)=>{

    // console.log(req.query.token);

    jwt.verify(req.query.token, config.secret, (err,decoded)=>{
      if (err){
        return res.redirect('/');
      }
      else{
        return res.render('BABTime.html');
      }
    })
    ////////////////////////
    // res.json({
    //   success: true,
    //   message: 'Index page'
    // });
    /////////////////////////
    // console.log("good");
    
  });

  app.post('/api/add', (req, res) => {
    /* 빈 input인지 확인 */
    if (req.body.id.length === 0 || req.body.pw.length === 0 || req.body.pwcheck.length === 0||req.body.email.length===0) {
      console.log('Wrong input');
      return res.json({
        success : false,
        message : "Please put all input"
      });
    }
    /* pw와 pwcheck이 일치하는지 확인 */
    if (req.body.pw !== req.body.pwcheck) {
      console.log('PW and Retype PW is different');
      return res.json({
        success : false,
        message : "PW and Retype PW is different"
      })
    }

    /* 이미 존재하는 id인지 확인 */
    User.findOne({id: req.body.id}, function(err, user) {
      if (err) return res.json({success : false, message : 'error'});
      else if (user !== null) {
        console.log('ID already exists');
        return res.json({
          success :  false,
          message : "ID already exists"
        })
      }
      User.findOne({email:req.body.email}, function(error,ser){
        if (error) return res.json({success : false, message : 'error'});
        else if (ser!==null){
          console.log('email already exist');
          return res.json({
            success : false,
            message : "email already exist"
          })
        }

        bcrypt.hash(req.body.pw,10,(error,hash)=>{
          const newuser = new User();
          newuser.id = req.body.id;
          newuser.pw = hash;
          newuser.email=req.body.email;
      
          newuser.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                success : false
              })
            }
            console.log('good database created');
            return res.json({
              success : true
            })
          });
        })
        

      })

      /* id가 존재하지 않으면 db에 저장 */

    });
  }); //register끝

  app.post('/api/reset_pw', function(req, res) {
    /* 빈 input인지 확인 */
    if (req.body.id.length === 0 || req.body.pw.length === 0 || req.body.pwcheck.length === 0||req.body.email.length===0) {
      console.log('Wrong input');
      return res.json({
        success : false,
        message : "Please put all Input"
      })
    }

    /* pw와 pwcheck이 일치하는지 확인 */
    if (req.body.pw !== req.body.pwcheck) {
      console.log('PW and Retype PW is different');
      return res.json({
        success : false,
        message : "PW and Retype PW is different"
      })
    }
    
    /* 존재하는 id인지 확인 */
    User.findOne({id: req.body.id}, function(err, user){
      if (err) return res.redirect('/reset_pw');
      else if (user === null) {
        console.log('ID does not exists');
        return res.json({
          success : false,
          message : "ID does not exists"
        })
      }
      /* id가 존재하면 pw reset를 한다 */
      if(req.body.email==user.email){
        
        bcrypt.hash(req.body.pw, 10, (error, hash) => {
  
          
          user.pw = hash;
      
          user.save(err => {
            if (err) {
              console.log(err);
              return res.redirect('/reset_pw');
            }
            console.log('database successfully reset');
            return res.json({
              success : true
            })
          });
          
  
        })

      }
      
      else{
        return res.json({
          success : false,
          message : "Please check your email"
        })
      }
    });
  }); //reset끝

  // app.get('/test', (req, res) => {
  //   return res.render('BABTime.html');
  // })

  app.post('/api/login', function(req, res) {
    /* 빈 input인지 확인 */
    // console.log(req.body.id, req.body.pw);
    if (req.body.id.length === 0 || req.body.pw.length === 0) {
      console.log('Wrong input');
      return res.json({
        success : false,
        message : 'Please put all data'
      })
    }

    /* 존재하는 id인지 확인 */
    User.findOne({id: req.body.id}, function(err, user){
      if (err) {
        // ////////////////////////
        res.send(400).json({
          success: false,
          message: 'Authentication failed! Please check the request'
        });
        // ////////////////////////
        // return res.redirect('/');
      }
      else if (user === null) {
        console.log('ID does not exists');
        // return res.redirect('/');
        return res.json({
          success : false,
          message : "No ID exists"
        })
      }


      bcrypt.compare(req.body.pw, user.pw,(error,result)=>{

        if (result){
          console.log("good login");
          // ///////////////////////////////
          let token = jwt.sign({username: req.body.id},
            config.secret,
            { expiresIn: '24h' // expires in 24 hours
            }
          );
          // return the JWT token for the future API calls
          res.json({
            success: true,
            message: 'login successful!',
            token: token
          });
        }
        
        else {
          console.log('PW wrong');
          //////////////////////
          // res.send().json({
          //   success: false,
          //   message: 'Incorrect username or password'
          // });
          // //////////////////////////
          res.json({
            success : false,
            message:'wrong password'
          });
        }

      })
      


      
      
    });
    
  });//login끝

}

