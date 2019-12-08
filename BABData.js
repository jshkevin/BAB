const bodyParser = require('body-parser');


module.exports = (app, Data) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.post('/data/add', (req, res)=>{  
        if(req.body.placeName.length===0||req.body.startTime.length===0||req.body.endTime.length===0||req.body.date.length===0){
            console.log("wrong input");
            return res.json({
              success: false,
              message : 'Please put all data'
            })
        }

        if(req.body.startTime>=req.body.endTime){
            console.log("wrong input");
            return res.json({
              success: false,
              message :'Check your time again'
            })
        }

        const newDATA =new Data();
        newDATA.id = req.body.id;
        newDATA.date = req.body.date;
        newDATA.placeName= req.body.placeName;
        newDATA.startTime = req.body.startTime;
        newDATA.endTime = req.body.endTime;
        
        newDATA.save(err => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message : 'error'
            })
          }
          console.log('good database created');
          res.json({
            success: true
          });
        });

    });

    app.get('/data/get',(req,res)=>{
      Data.find({}).then(function (datas) {
        // console.log(datas);
        // console.log(typeof(datas));
        res.send(datas)

        });
    });

}