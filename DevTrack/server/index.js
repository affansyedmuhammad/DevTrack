import  express  from "express";
const app=express();
import bodyParser from 'body-parser';
import cors from 'cors';
app.use(cors());
import url from 'url'
import mysql from 'mysql';
import { request } from "http";
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"devtrack123!",
    database:"devtrack_db"
});
app.get('/',(req,res)=>{
    res.end("Welcome to DevTrack");
})
app.get('/users',(req,res)=>{
    var text="";
     var username=req.query.username;
     console.log(username)
     con.connect(function(err){
        con.query("select task,date from tasks where username='"+username+"'",function(err,result,fields){
            var count=1;
            for(var x in result){
               text+=(count)+"."+result[x].task+"=> Estimated Completion Date: "+result[x].date+"\n";
               count+=1;
          
            }  
            var index=text.lastIndexOf("\n")
            text=text.substring(0,index); 
            res.send(text);
        });

     })
    
})
app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    var con=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"devtrack123!",
        database:"devtrack_db"
    });
    con.connect(function(err){if(err) throw err;
    con.query("select password from user where username='"+username+"'",function(err,result,fields){
        if(result != null && result.length > 0 && password==result[0].password){
        res.redirect("http://localhost:3000/users?username="+username)
        }
        else{
            res.redirect('http://localhost:3000/invalid');
        }
    });
    
    
    });
    
    
})
app.post('/createtask',(req,res)=>{
   const task=req.body.newtask;
   const date=req.body.compdate;
   const username=req.body.username;
   console.log(username)
   console.log(task)
   var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"devtrack123!",
    database:"devtrack_db"
});

con.connect(function(err){
    if(err) throw err;
var sql="insert into tasks values('"+username+"','"+task+"','"+date+"')";
con.query(sql,function(err,result){
    if (err) throw err;
})
})

//res.send(username)
res.redirect("http://localhost:3000/users?username="+username)
})
app.post('/createacc',(req,res)=>{
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
    const confirmpassword=req.body.confirmpassword;
    if(password==confirmpassword){
    var con=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"devtrack123!",
        database:"devtrack_db"
    });
    con.connect(function(err){
        if(err) throw err;
        var sql="insert into user values('"+username+"','"+email+"','"+password+"')";
        con.query(sql,function(err,result){
            if(err) throw err;
            console.log("inserted");
            res.redirect("http://localhost:3000/acccreated");
        })
        
    })
}

})
app.post('/deletetask',(req,res)=>{
    var task=req.body.task;
    task=task.substring(2);
    var username=req.body.username;
    var con=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"devtrack123!",
        database:"devtrack_db"
    });
    con.connect(function(err){
        if(err) throw err;
        var sql="delete from tasks where task='"+task.split("=>")[0]+"'";
       
        con.query(sql,function(err,result){
         
            console.log("deleted");
            res.redirect("http://localhost:3000/users?username="+username);
        })
        
    })

    
})
app.listen(9000,()=>{
    console.log("server is running on port 9000")
})