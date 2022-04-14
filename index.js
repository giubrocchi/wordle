const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crypto = require("crypto");

let fs = require("fs");
let texto = fs.readFileSync("./palavras.txt", "utf-8");
const port = texto.split("\r\n");

let text = fs.readFileSync("./ingles.txt", "utf-8");
const ing = text.split("\r\n");

let users = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/getpalavra', function (req, res) {
    let lg = req.body.lg;
    let pal;
    
    if(lg == 'pt')
      pal = port;
    else if(lg == 'en')
      pal = ing;
    
    res.send((Math.floor(Math.random()*pal.length)).toString());
});

app.post('/resposta', function (req, res) {
  let id = req.body.id;
  let lg = req.body.lg;
  let pal;
  if(lg == 'pt')
    pal = port;
  else if(lg == 'en')
    pal = ing;
  
  res.send(pal[id]);
});

app.get('/user', function (req, res) {
  let id = crypto.randomBytes(16).toString("hex");

  while(users.filter((v) => (v.id === id)).length > 0){
    id = crypto.randomBytes(16).toString("hex");
  }
  
  users.push({
    "id": id,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0
  });

  res.send(id);
});

app.post('/corrigir', function (req, res) {
    // 0 NAO TEM, 1 TA NO LUGAR CERTO E 2 TEM MAS NO LUGAR ERRADO
    const p1 = req.body.p1;
    const p2 = req.body.p2;
    const p3 = req.body.p3;
    const p4 = req.body.p4;
    const p5 = req.body.p5;
    const idx = req.body.idx;
    const lg = req.body.lg;
    let pal;
    if(lg == 'pt')
      pal = port;
    else if(lg == 'en')
      pal = ing;
    const palavra = pal[idx];
    let quase = [];
    let acerto = [];
    let ret = [];

    function ocorrencias(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    
    if(p1 == palavra.charAt(0)){
      acerto.push(p1);
      ret[0] = 1;
    }
    else if(!palavra.includes(p1)){
      ret[0] = 0;
    }
    else{
      quase.push(p1);
      ret[0] = 2;
    }
    
    if(p2 == palavra.charAt(1) && palavra.split(p2).length-1 > ocorrencias (quase, p2)){
      acerto.push(p2);
      ret[1] = 1;
    }
    else if(!palavra.includes(p2)){
      ret[1] = 0;
    }
    else{
      if(palavra.split(p2).length-1 > ocorrencias(acerto, p2) + ocorrencias (quase, p2)){
        quase.push(p2);
        ret[1] = 2;
      }
      else{
        ret[1] = 0;
      }
    }
    
    if(p3 == palavra.charAt(2) && palavra.split(p3).length-1 > ocorrencias (quase, p3)){
      acerto.push(p3);
      ret[2] = 1;
    }
    else if(!palavra.includes(p3)){
      ret[2] = 0;
    }
    else{
      if(palavra.split(p3).length-1 > ocorrencias(acerto, p3) + ocorrencias (quase, p3)){
        quase.push(p3);
        ret[2] = 2;
      }
      else{
        ret[2] = 0;
      }
    }
    
    if(p4 == palavra.charAt(3) && palavra.split(p4).length-1 > ocorrencias (quase, p4)){
      acerto.push(p4);
      ret[3] = 1;
    }
    else if(!palavra.includes(p4)){
      ret[3] = 0;
    }
    else{
      if(palavra.split(p4).length-1 > ocorrencias(acerto, p4) + ocorrencias (quase, p4)){
        quase.push(p4);
        ret[3] = 2;
      }
      else{
        ret[3] = 0;
      }
    }
    
    if(p5 == palavra.charAt(4) && palavra.split(p5).length-1 > ocorrencias (quase, p5)){
      acerto.push(p5);
      ret[4] = 1;
    }
    else if(!palavra.includes(p5)){
      ret[4] = 0;
    }
    else{
      if(palavra.split(p5).length-1 > ocorrencias(acerto, p5) + ocorrencias (quase, p5)){
        quase.push(p5);
        ret[4] = 2;
      }
      else{
        ret[4] = 0;
      }
    }
    
    let resp = "";
    for(let i = 0; i < ret.length; i++){
      resp += ret[i].toString();
    }
    res.send(resp);
});

app.post('/verifica', function (req, res) {
    let palavra = req.body.palavra;
    let lg = req.body.lg;
    let pal;

    if(lg == "pt")
      pal = port;
    else if(lg == "en")
      pal = ing;

    let ret;
    if(!pal.includes(palavra)){
        ret = "0";
    }
    else{
        ret = "1";
    }
    res.send(ret);
});

app.post('/acertos', function (req, res) {
  let acerto = req.body.acerto;
  let user = req.body.user;

  if(users.filter((v) => (v.id === user)).length == 0){
    let id = crypto.randomBytes(16).toString("hex");
    while(users.filter((v) => (v.id === id)).length > 0){
      id = crypto.randomBytes(16).toString("hex");
    }
    users.push({
      "id": id,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    });

    for(let i=0; i<users.length; i++){
      if(users[i].id == id){
        users[i][acerto.toString()]++;
      }
    }
    
    res.send(id);
  }
  else{
    for(let i=0; i<users.length; i++){
      if(users[i].id == user){
        users[i][acerto.toString()]++;
      }
    }
  
    res.send();
  }
});

app.post('/getacertos', function (req, res) {
  let user = req.body.user;

  if(user === null)
    res.end();

  ret = "";
  for(let j=0; j<users.length; j++){
    if(users[j].id == user){
      for(let i = 1; i <= 7; i++){
        ret += users[j][i.toString()];
      }
    }
  }

  res.send(ret);
});

app.listen(process.env.PORT || 5000);