var http = require('http');
var url = require('url');
var fs = require('fs');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
var url = require('url');
async function init() {
  try {
    // Create a connection pool which will later be accessed via the
    // pool cache as the 'default' pool.
    await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString
      // edition: 'ORA$BASE', // used for Edition Based Redefintion
      // events: true, // whether to handle Oracle Database FAN and RLB events or support CQN
      // externalAuth: false, // whether connections should be established using External Authentication
      // homogeneous: true, // all connections in the pool have the same credentials
      // poolAlias: 'default', // set an alias to allow access to the pool via a name.
      // poolIncrement: 1, // only grow the pool by one connection at a time
      // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
      // poolMin: 0, // start with no connections; let the pool shrink completely
      // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
      // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
      // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
      // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
      // stmtCacheSize: 30 // number of statements that are cached in the statement cache of each connection
    });
    console.log('Connection pool started');
  } catch (err) {
    console.error('init() error: ' + err.message);
  } 
}

async function ExecuteSQL(sql) {
  let connection;
  try {
    console.log(sql);
    // Get a connection from the default pool
    connection = await oracledb.getConnection();
    const result = await connection.execute(sql);
    await connection.execute('Commit');
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Put the connection back in the pool
        await connection.close();
      } catch (err) {
        console.error(err);
        process.exit(0);
      }
    }
  }
}

async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await oracledb.getPool().close(10);
    console.log('Pool closed');
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);
async function http_handler(req,res)
{
  if(req.method=='GET'){
    if(url.parse(req.url).pathname === '/'){
		let html= fs.readFileSync('./14-01.html');
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
        res.end(html);
    }
    else if(url.parse(req.url).pathname === '/api/faculties'){
      let result= await ExecuteSQL('SELECT FACULTY,FACULTY_NAME FROM FACULTY');
      let jsonresult='[';
      console.log('---------------\n'+result+'\n------------------');
      console.log(result.rows.length);
      for(let i=0;i<result.rows.length;i++)
      {
        jsonresult+='{"Faculty:""'+result.rows[i][0]+'",'+'"Faculty_name":"'+result.rows[i][1]+'"},'
      }
      jsonresult=jsonresult.substring(0,jsonresult.length-1);
      jsonresult+=']';
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(jsonresult);
    }
    else if(url.parse(req.url).pathname === '/api/pulpits'){
      let result= await ExecuteSQL('SELECT PULPIT,PULPIT_NAME,FACULTY FROM PULPIT');
      let jsonresult='[';
      console.log('---------------\n'+result+'\n------------------');
      console.log(result.rows.length);
      for(let i=0;i<result.rows.length;i++)
      {
        jsonresult+='{"Pulpit":"'+result.rows[i][0]+'",'+'"Pulpit_name":"'+result.rows[i][1]+'",'+'"Faculty":"'+result.rows[i][2]+'"},'
      }
      jsonresult=jsonresult.substring(0,jsonresult.length-1);
      jsonresult+=']';
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(jsonresult);
    }
    else if(url.parse(req.url).pathname === '/api/subjects'){
      let result= await ExecuteSQL('SELECT SUBJECT,SUBJECT_NAME,PULPIT FROM SUBJECT');
      let jsonresult='[';
      console.log('---------------\n'+result+'\n------------------');
      console.log(result.rows.length);
      for(let i=0;i<result.rows.length;i++)
      {
        jsonresult+='{"Subject:""'+result.rows[i][0]+'",'+'"Subject_name":"'+result.rows[i][1]+'",'+'"PULPIT":"'+result.rows[i][2]+'"},'
      }
      jsonresult=jsonresult.substring(0,jsonresult.length-1);
      jsonresult+=']';
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(jsonresult);
    }
    else if(url.parse(req.url).pathname === '/api/auditoriumstypes'){
      let result= await ExecuteSQL('SELECT AUDITORIUM_TYPE,AUDITORIUM_TYPENAME FROM AUDITORIUM_TYPE');
      let jsonresult='[';
      console.log('---------------\n'+result+'\n------------------');
      console.log(result.rows.length);
      for(let i=0;i<result.rows.length;i++)
      {
        jsonresult+='{"Auditorium_type:""'+result.rows[i][0]+'",'+'"Auditorium_typename":"'+result.rows[i][1]+'"},'
      }
      jsonresult=jsonresult.substring(0,jsonresult.length-1);
      jsonresult+=']';
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(jsonresult);
    }
    else if(url.parse(req.url).pathname === '/api/auditoriums'){
      let result= await ExecuteSQL('SELECT AUDITORIUM,AUDITORIUM_NAME,AUDITORIUM_CAPACITY,AUDITORIUM_TYPE FROM AUDITORIUM');
      let jsonresult='[';
      console.log('---------------\n'+result+'\n------------------');
      console.log(result.rows.length);
      for(let i=0;i<result.rows.length;i++)
      {
        jsonresult+='{"Auditorium":"'+result.rows[i][0]+'",'+'"Auditorium_name":"'+result.rows[i][1]+'", "Auditorium_capacity":'+result.rows[i][2]+', "Auditorium_type":"'+result.rows[i][3]+'"},'
      }
      jsonresult=jsonresult.substring(0,jsonresult.length-1);
      jsonresult+=']';
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(jsonresult);
    }
  }
  else if(req.method=='POST'){
    if(url.parse(req.url).pathname === '/api/faculties'){
      let body='';
            req.on('data',chunk=>{body+=chunk.toString();});
            req.on('end',async ()=>{
      let o = JSON.parse(body);
      let sql=`INSERT INTO FACULTY(FACULTY,FACULTY_NAME) values('${o.faculty}','${o.faculty_name}')`;
      let result = await ExecuteSQL(sql);
      if(result.rowsAffected>0)
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в факультет"}`);
      }
    });
    }
    else if(url.parse(req.url).pathname === '/api/pulpits'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
          let o = JSON.parse(body);
      let result = await ExecuteSQL(`INSERT INTO PULPIT( PULPIT,PULPIT_NAME,FACULTY) values('${o.pulpit}','${o.pulpit_name}','${o.faculty}')`);
      if(result.rowsAffected>0)
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в кафедру"}`);
      }
      });
    }
    else if(url.parse(req.url).pathname === '/api/subjects'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
          let o = JSON.parse(body);
      let result = await ExecuteSQL(`INSERT INTO SUBJECT(SUBJECT,SUBJECT_NAME,PULPIT) values('${o.subject}','${o.subject_name}','${o.pulpit}')`);
      if(result.rowsAffected>0)
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в предмет"}`);
      }
      });
    }
    else if(url.parse(req.url).pathname === '/api/auditoriumstypes'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
          let o = JSON.parse(body);
      let result= await ExecuteSQL(`INSERT INTO AUDITORIUM_TYPE(AUDITORIUM_TYPE,AUDITORIUM_TYPENAME) values('${o.auditorium_type}','${o.auditorium_typename}')`);
      if(result.rowsAffected>0)
      {
      res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в тип аудитории"}`);
      }
      });
    }
    else if(url.parse(req.url).pathname === '/api/auditoriums'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
          let o = JSON.parse(body);
      let result= await ExecuteSQL(`INSERT INTO AUDITORIUM(AUDITORIUM,AUDITORIUM_NAME,AUDITORIUM_CAPACITY,AUDITORIUM_TYPE) values('${o.auditorium}','${o.auditorium_name}',${o.auditorium_capacity},'${o.auditorium_type}')`);
      if(result.rowsAffected>0)
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`);
      }
        else
        {
          res.writeHead(200,{'Content-Type': 'application/json'});
          res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в аудиторию"}`);
        }
      });
    }
  }
  else if(req.method=='PUT'){
    if(url.parse(req.url).pathname === '/api/faculties'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
      let o = JSON.parse(body);
      let result2 = await ExecuteSQL(`UPDATE FACULTY SET FACULTY_NAME='${o.faculty_name}' where Faculty='${o.faculty}'`);
        if(result2.rowsAffected>0)
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`);
        }
        else
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":2,"message":"Такого кода факультета для обновления не существует"}`);
        }
      });
    }
    else if(url.parse(req.url).pathname === '/api/pulpits'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
      let o = JSON.parse(body);
      let result2 = await ExecuteSQL((`UPDATE PULPIT SET PULPIT_NAME='${o.pulpit_name}',FACULTY='${o.faculty}' where PULPIT='${o.pulpit}'`));
        if(result2.rowsAffected>0)
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`);
        }
        else
        {
        console.log(result2.rowsAffected);
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":2,"message":"Такого кода кафедры для обновления не существует"}`);
        }
      });
    }
    else if(url.parse(req.url).pathname === '/api/subjects'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
          let o = JSON.parse(body);
          let result2 = await ExecuteSQL(`UPDATE SUBJECT SET SUBJECT_NAME='${o.subject_name}',PULPIT='${o.pulpit}' where SUBJECT='${o.subject}'`);
        if(result2.rowsAffected>0)
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`);
        }
        else
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":2,"message":"Такого предмета для обновления не существует"}`);
        }
      });
    }
    else if(url.parse(req.url).pathname === '/api/auditoriumstypes'){
        let body='';
        req.on('data',chunk=>{body+=chunk.toString();});
        req.on('end',async ()=>{
        let o = JSON.parse(body);
        let result2 = await ExecuteSQL(`UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME='${o.auditorium_typename}' where AUDITORIUM_TYPE='${o.auditorium_type}'`);
        if(result2.rowsAffected>0)
        {  
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":2,"message":"Такого типа аудитории для обновления не существует"}`);
      }
      });
    }
    else if(url.parse(req.url).pathname === '/api/auditoriums'){
      let body='';
      req.on('data',chunk=>{body+=chunk.toString();});
      req.on('end',async ()=>{
          let o = JSON.parse(body);
      let result2 = await ExecuteSQL("UPDATE AUDITORIUM SET AUDITORIUM_NAME='"+o.auditorium_name+"',AUDITORIUM_CAPACITY="+o.auditorium_capacity+",AUDITORIUM_TYPE='"+o.auditorium_type+"' where AUDITORIUM='"+o.auditorium+"'");
        if(result2.rowsAffected>0)
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`);
        }
        else
        {
          res.writeHead(200,{'Content-Type': 'application/json'});
          res.end(`{"error":2,"message":"Такой аудитории для обновления не существует"}`);
        }
      });
    }
  }
  else if(req.method=='DELETE'){
    console.log(url.parse(req.url).pathname);
    if(url.parse(req.url).pathname.search('\/api\/faculties\/[A-z]+')!=(-1)){
      let p = url.parse(req.url,true);
      let r =decodeURI(p.pathname).split('/');
      let o = r[3];
      let result = await ExecuteSQL("SELECT FACULTY,FACULTY_NAME FROM FACULTY where FACULTY='"+o+"'");
      let result2= await ExecuteSQL("DELETE from FACULTY where Faculty='"+o+"'");
        if(result2.rowsAffected>0)
        {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Faculty":"${result.rows[0][0]}","Faculty_name":"${result.rows[0][1]}"}`);
        }
        else
        {
          res.writeHead(200,{'Content-Type': 'application/json'});
          res.end(`{"error":"1","messsage":"Такого факультета для удаления не существует"}`);
        }
    }
    else if(url.parse(req.url).pathname.search('\/api\/pulpits\/[A-z]+')!=(-1)){
        let p = url.parse(req.url,true);
        let r =decodeURI(p.pathname).split('/');
        let o = r[3];
        let result = await ExecuteSQL("SELECT PULPIT,PULPIT_NAME,FACULTY FROM PULPIT where PULPIT='"+o+"'");
        let result2 = await ExecuteSQL("Delete from PULPIT where PULPIT='"+o+"'");
          if(result2.rowsAffected>0)
          {
          res.writeHead(200,{'Content-Type': 'application/json'});
          res.end(`{"Pulpit":"${result.rows[0][0]}","Pulpit_name":"${result.rows[0][1]}","Faculty":"${result.rows[0][2]}"}`);
          }
          else
          {
            console.log(result2.rowsAffected);
            res.writeHead(200,{'Content-Type': 'application/json'});
            res.end(`{"error":"1","messsage":"Такого кода кафедры для удаления не существует"}`);
          }
    }
    else if(url.parse(req.url).pathname.search('\/api\/subjects\/[A-z]+')!=(-1)){
        let p = url.parse(req.url,true);
        let r =decodeURI(p.pathname).split('/');
        let o = r[3];
        let result = await ExecuteSQL("SELECT SUBJECT,SUBJECT_NAME,PULPIT FROM SUBJECT where SUBJECT='"+o+"'");
        let result2= await ExecuteSQL("Delete from SUBJECT where SUBJECT='"+o+"'");
        if(result2.rowsAffected>0){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"Subject":"${result.rows[0][0]}","Subject_name":"${result.rows[0][1]}","Pulpit":"${result.rows[0][2]}"}`);
        }
        else
        {
          res.writeHead(200,{'Content-Type': 'application/json'});
          res.end(`{"error":"1","messsage":"Такого предмета для удаления не существует"}`);
        }
    }
    else if(url.parse(req.url).pathname.search('\/api\/auditoriumstypes\/[A-z]+')!=(-1)){
      let p = url.parse(req.url,true);
      let r =decodeURI(p.pathname).split('/');
      let o = r[3];
      let result = await ExecuteSQL("SELECT AUDITORIUM_TYPE,AUDITORIUM_TYPENAME FROM AUDITORIUM_TYPE where AUDITORIUM_TYPE='"+o+"'");
      let result2 = await ExecuteSQL("DELETE from AUDITORIUM_TYPE where AUDITORIUM_TYPE='"+o+"'");
      if(result2.rowsAffected>0)
      {
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(`{"Audtiorium_type":"${result.rows[0][0]}","Auditorium_typename":"${result.rows[0][1]}"}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":1,"message":"Такого типа аудитории для удаления не существует"}`);
      }
    }
    else if(url.parse(req.url).pathname.search('\/api\/auditoriums\/[A-z]+')!=(-1)){
        let p = url.parse(req.url,true);
      let r =decodeURI(p.pathname).split('/');
      let o = r[3];
      let result = await ExecuteSQL("SELECT  AUDITORIUM,AUDITORIUM_NAME,AUDITORIUM_CAPACITY,AUDITORIUM_TYPE FROM AUDITORIUM where AUDITORIUM='"+o+"'");
      let result2 = await ExecuteSQL("DELETE from AUDITORIUM where AUDITORIUM='"+o+"'");
      if(result2.rowsAffected>0)
      {
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.end(`{"Auditorium":"${result.rows[0][0]}","Auditorium_name":"${result.rows[0][1]}","Auditorium_capacity":${result.rows[0][2]}, "Auditorium_type":${result.rows[0][3]}}`);
      }
      else
      {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(`{"error":1,"message":"Такой аудитории для удаления не существует"}`);
      }
    }
  }
    //console.log(1);
}
init();
var server=http.createServer(function (req, res){
    try{
        http_handler(req,res);
    }
    catch(e)
    {
        console.error(e);
    }

}).listen(5000);