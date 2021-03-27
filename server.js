const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const multer = require('multer');

var db, collection, upload;

const dbName = "capoeira";
const url = `mongodb+srv://admin:123@cluster0.9nt6d.mongodb.net/${dbName}?retryWrites=true&w=majority`

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('capoeiristas').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {capoeiristas: result})
    })
})

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
})
var upload = multer({storage: storage})

app.post('/add', upload.single('file-to-upload'), (req, res) => { console.log(req.file); console.log(req.body);
  db.collection('capoeiristas').insertOne({name: req.body.name, nickname:req.body.nickname, group:req.body.group, rank:req.body.rank, country:req.body.country, logo: "img/" + req.file.filename}, (err, result) => {
    if (err) return console.log(err)
    console.log('Document added to database');
  })
})

app.put('/edit', upload.single('filetoupload'), (req, res) => {
  console.log(req.body);
    db.collection('capoeiristas')
    .findOneAndUpdate({name: req.body.name, nickname:req.body.nickname, group:req.body.group, rank:req.body.rank, country:req.body.country, logo: req.body.logo}, {
      $set: { name: ((req.body.newName === '') ? req.body.name : req.body.newName), 
              nickname: ((req.body.newNickname === '') ? req.body.nickname : req.body.newNickname),
              group: ((req.body.newGroup === '') ? req.body.group : req.body.newGroup),
              rank: ((req.body.newRank === '') ? req.body.rank : req.body.newRank),
              country: ((req.body.newCountry === '') ? req.body.country : req.body.newCountry),
              logo: ((!req.file) ? req.body.logo : "img/" + req.file.filename)}
    }, {
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send('Document updated');
    })
})

app.delete('/delete', (req, res) => {
  console.log(req.body);
  db.collection('capoeiristas').findOneAndDelete({name: req.body.name, nickname:req.body.nickname, group:req.body.group, rank:req.body.rank, country:req.body.country}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Document deleted!')
  })
})
app.delete('/completedTasks', (req, res) => {
  db.collection('capoeiristas').deleteMany({completed: true}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Collection cleared!')
  })
})
app.delete('/clear', (req, res) => {
  db.collection('capoeiristas').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('List Cleared!')
  })
})
