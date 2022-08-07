// Import modules and packages
const express=require('express');
const app=express();
const server = require('http').createServer(app)
const port = process.env.PORT || 9000
const sql = require('mysql2')
const path = require('path')


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://tadi:turnipe@rth387@cluster0.rbe4jci.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Mongo connected')
//   // perform actions on the collection object
//   client.close();
// });

const session = require('express-session')
var bodyParser = require('body-parser');
const { dirname } = require('path');


let loginstatus = false;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.set('views','./public');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname + '/public')))

// sql configure

var con = sql.createConnection({
    host: "localhost",
    user: "TaDi",
    password: "TURNIPE@RTh387",
    database: "intern",
    insecureAuth: true
});
con.connect((err) => {
    if (err) throw err;
    console.log("connected to my sql")
})

let createdb='create database if not exists intern';
con.query(createdb,function(err, results, fields){
    if (err) {
        console.log(err.message);
      }
      console.log('DB created')
});
sql.createConnection({
    host: "localhost",
    user: "TaDi",
    password: "TURNIPE@RTh387",
    database: "intern"
});


let createUsers=`create table if not exists users(
    ID int primary key auto_increment,
    USERNAME varchar(100) not null,
    EMAIL varchar(100) not null,
    PASSWORD varchar(250) not null
)`

con.query(createUsers, function(err, results, fields) {
  if (err) {
    console.log(err.message);
  }
});

let createTeach = `create table if not exists teacher
  (
    id int primary key auto_increment,
    name varchar(255) not null,
    subject varchar(255) not null,
    fee int not null,
    studentsallocated varchar(2000) not null
  )`;

con.query(createTeach, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT IGNORE INTO teacher (id,name,subject,fee,studentsallocated) VALUES ?";
    var values = 
    [ ['1',['name1'],['maths'],['500'],['']],
      ['2',['name2'],['geography'],['500'],['']],
      ['3',['name3'],['history'],['500'],['']],
      ['4',['name4'],['english'],['500'],['']],
      ['5',['name5'],['hindi'],['500'],['']],
      ['6',['name6'],['computers'],['500'],['']],
      ['7',['name7'],['physics'],['500'],['']],
      ['8',['name8'],['chemistry'],['500'],['']],
      ['9',['name9'],['biology'],['500'],['']],
      ['10',['name10'],['french'],['500'],['']],
    
    ];
    if(con.query)
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });






app.get('/', (req, res) => {
    res.render('index',{'username':req.session.username});

})

app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.redirect('/')
        if (err) throw err
        loginstatus=false;
    })
})


app.get('/studyMaterial',(req,res)=>{
    res.sendFile(path.join(__dirname)+"/public/studyMaterial/studymaterial.html");
})
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname)+"/public/register/loginreg.html");
})










app.get('/sign-in', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    console.log(username + " " + password)
    con.query(`SELECT * FROM users WHERE USERNAME=? AND PASSWORD=?`, [username, password], (err, result, fields) => {
        if (err) throw err;
        if (result[0] != undefined) 
        {
            req.session.loggedin = true
            loginstatus=req.session.loggedin = true;
            req.session.username = username
            res.json({ login: req.session.loggedin, username: req.session.username })
            console.log(loginstatus);
        } 
        else 
        {
            console.log("Wrong Credentials")
            res.json({ login: req.session.loggedin })
        }
    })

})

app.post('/sign-up', (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let confirmPassword = req.body.passwordConfirm
    console.log(req.body)
        con.query('SELECT * FROM users WHERE USERNAME=? OR EMAIL=?', [username, email], (err, result, fields) => {
            if (err) throw err;
            console.log(result)
            if (result[0] == undefined) 
            {
                con.query(`INSERT INTO users (USERNAME, EMAIL, PASSWORD) VALUES ("${username}", "${email}", "${password}")`, (err, result, fields) => {
                    if (err) throw err;
                    console.log(result)
                    console.log("Account Created")
                    res.json({ status: true })
                })
            } 
            else 
            {
                res.json({ status: false, message: "Username or Email already used." })
            }
        })
    
})



server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
