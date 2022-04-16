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
    const guess = req.body.pal;
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

    for(let i = 0; i < palavra.length; i++){
      if(guess.charAt(i) == palavra.charAt(i) && palavra.split(guess.charAt(i)).length-1 > ocorrencias (quase, guess.charAt(i))){
        acerto.push(guess.charAt(i));
        ret[i] = 1;
      }
      else if(!palavra.includes(guess.charAt(i))){
        ret[i] = 0;
      }
      else{
        if(palavra.split(guess.charAt(i)).length-1 > ocorrencias(acerto, guess.charAt(i)) + ocorrencias (quase, guess.charAt(i))){
          quase.push(guess.charAt(i));
          ret[i] = 2;
        }
        else{
          ret[i] = 0;
        }
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