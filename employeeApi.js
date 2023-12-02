let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Orihgin, X-Requested-With, Content-Type, Accept"

    );
    next();
});
//const port=2410;
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

//let {getConnection}=require("./mobDB.js");

const {Client}=require("pg");
const client=new Client({
    user : "postgres",
    password : "Sameem@1231231",
    database : "postgres",
    port:5432,
    host : "db.itxplwceqtnpqyifanqm.supabase.co",
    ssl:{ rejectUnauthorized: false},
});
 client.connect(function(res, error){
        console.log(`Connected!!!`);
    });

app.get("/employees",function(req,res,next){

    let department=req.query.department
    let designation=req.query.designation
    let gender=req.query.gender
    let=req.query
    let options=``;
    let optionArr=[];
   
    if(department){
        options=options?`${options} AND  designation=$1`:`WHERE department=$1`;
        optionArr.push(`${department}`);
        
    }
    if(designation){
        options=options?`${options} AND  designation=$2` :` WHERE designation=$1`;
        optionArr.push(`${designation}`);
        
    }
    if(gender){
        options=options?`${options} AND  gender=$3` :` WHERE gender=$1`;
        optionArr.push(`${gender}`);
      
    }
    console.log("optionArr",optionArr)
    /*
    if(department){
        options=`WHERE department=\'${department}\'`;
        optionArr.push(`\'${department}\'`);
        
    }
    if(designation){
        options=options?`${options} AND  designation=\'${designation}\'` :` WHERE designation=\'${designation}\'`;
        optionArr.push(`\'${designation}\'`);
        
    }
    if(gender){
        options=options?`${options} AND  gender=\'${gender}\'` :` WHERE gender=\'${gender}\'`;
        optionArr.push(`\'${gender}\'`);
      
    }
    */


    let sql=`SELECT * FROM employee ${options}`;
    client.query(sql,optionArr,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
        else  {
            res.send(result.rows);
        }
    });
});


app.get("/employees/:empcode",function(req,res,next){
    let empcode=+req.params.empcode;
   
    let sql=`SELECT * FROM employee WHERE empcode=${empcode}`;
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);}
        else if(result.length===0) { res.status(404).send("No employee found");}
       
             else res.send(result.rows);
         
      
    })
 });

app.post("/employees",function(req,res,next){
    let values=Object.values(req.body);
  
   console.log(values)
    let sql=`INSERT INTO employee (empcode,name,department,designation,salary,gender) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(sql,values,function(err,result){
        if(err){ res.status(404).send(err);}
        else{
            res.send(`POST SUCCESS..NUM OF ROWS ${result.rowCount}`);
    }
    })
})

app.put("/employees/:empcode", function(req,res,next){
    let empcode=req.params.empcode;
    let name=req.body.name;
    let department=req.body.department;
    let designation=req.body.designation;
    let salary=req.body.salary;
    let gender=req.body.gender;
    
    let sql=`UPDATE employee SET empcode=${empcode},name=\'${name}\',department=\'${department}\',designation=\'${designation}\',salary=${salary}, gender=\'${gender}\' WHERE empcode=${empcode}`;
   // values=[name,department,designation,salary,empcode]
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
       
         else{ res.send("Update success")}
    })
 })


 app.delete("/employees/:empcode", function(req,res,next){
    let empcode=req.params.empcode;
   
    let sql=`DELETE FROM employee WHERE empcode=${empcode}`;
   
    client.query(sql,function(err,result){
        if(err) res.status(404).send("Error in deleting data");
        else if (result.affectedRows===0) res.status(404).send("No  delete happened");
         else res.send("delete success")
    })
 })