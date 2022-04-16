let pal;
let rodada = 1;
let acerto = 0;
let tec;
let lg = "pt";

function load(){
  if (window.matchMedia('(max-device-width: 960px)').matches){
    for(let i = 1; i < 6; i++){
      let id = "1letra" + i;
      document.getElementById(id).readOnly = true;
    }
  }

  novaPalavra(valor => {
    pal = valor;
    if(localStorage.getItem("user") === null){
      novoUser(valor => localStorage.setItem("user", valor));
    }
  });
}

document.addEventListener("keydown", function(e) {
	if (e.key === 'Enter') {
    tec = '';
    verifica();
  }
  else if(e.key === 'Backspace'){
    let linha = document.activeElement.id.charAt(0);
    let coluna = document.activeElement.id.charAt(6);
    if(document.activeElement.value != "" || coluna == "1")
      return;
    focoApaga(linha, coluna);
  }
});

function focoApaga(linha, coluna){
  if(linha === null || coluna === null)
    return;

  let nome = linha + "letra" + coluna;
  document.getElementById(nome).value = "";
  coluna  = coluna - 1;
  nome = linha + "letra" + coluna;
  document.getElementById(nome).focus();
}

function mudarLinguagem(lang){
  if(rodada != 1){
    document.getElementById("mensagem").innerHTML = "Não é possível alterar a linguagem em jogo!";
    setTimeout(tirarAlerta, 5000);
    return;
  }

  document.getElementById(lg).style.textDecoration = "none";
  lg = lang;
  document.getElementById(lg).style.textDecoration = "underline";
}

function novaPalavra(cb){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/getpalavra", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send("lg=" + lg);
}

function novoUser(cb){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","/user", true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send();
}

function verifica(){
  let palavra = "";
  for(let i = 1; i < 6; i++){
    let id = rodada.toString() + "letra" + i;
    let p = document.getElementById(id).value.toLowerCase();
    palavra += p;
  }

  for(let i = 0; i < palavra.length; i++){
    if(palavra.charAt(i) == '' || palavra.charAt(i).search(/[^a-zA-Z]+/) == 0){
      document.getElementById("mensagem").innerHTML = "Caracteres inválidos";
      setTimeout(tirarAlerta, 5000);
      return;
    }
  }

  let ret;
  verificarPal(palavra, valor => {
    ret = valor;
    if(ret == "0"){
      document.getElementById("mensagem").innerHTML = "Palavra inválida";
      setTimeout(tirarAlerta, 5000);
      return;
    }

    comparar(palavra, valor => {
      mostraResultado(valor, palavra);
      mudaRodada(++rodada);
    });
  });
}

function verificarPal(palavra, cb){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/verifica", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send("palavra=" + palavra + "&lg=" + lg);
}

function comparar(palavra, cb){
  let req = "pal=" + palavra + "&idx=" + pal + "&lg=" + lg;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/corrigir", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send(req);
}

function mostraResultado(valor, palavra){
  acerto = 0;
  let inseridas = palavra;
  let letra = [];
  
  for(let i = 0; i < inseridas.length; i++){
    letra[i] = valor.charAt(i);
    let id1 = rodada.toString() + "letra" + (i + 1).toString();
    if(letra[i] == 1){
      document.getElementById(id1).style.backgroundColor = "#3bd165";
      document.getElementById(inseridas.charAt(i)).style.backgroundColor = "#3bd165";
      acerto ++;
    }
    else if(letra[i] == 0){
      document.getElementById(id1).style.backgroundColor = "#8c8c8c";
      if(window.getComputedStyle(document.getElementById(inseridas.charAt(i)), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
        document.getElementById(inseridas.charAt(i)).style.backgroundColor = "#8c8c8c";
    }
    else{
      document.getElementById(id1).style.backgroundColor = "#edd432";
      if(window.getComputedStyle(document.getElementById(inseridas.charAt(i)), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
        document.getElementById(inseridas.charAt(i)).style.backgroundColor = "#edd432";
    }
  }
}

function mudaRodada(rod){
  let ant = rod - 1;
  
  getPalavra(pal, valor => {
    let resp = valor;

    if(acerto == 5){
      for(let i = 1; i < 6; i++){
        let id = ant + "letra" + i;
        document.getElementById(id).readOnly = true;
      }
    
      enviarStats(ant, (valor) => {
        if(valor != '')
          localStorage.setItem("user", valor);
        getStats(valores => setTimeout(function(){mostraStats(valores, resp, rod)}, 2000))
      });
      return;
    }
    
    if(rod == 7){
      for(let i = 1; i < 6; i++){
        let id = "6letra" + i;
        document.getElementById(id).readOnly = true;
      }

      enviarStats(rod, (valor) => {
        if(valor != '')
          localStorage.setItem("user", valor);
        getStats(valores => setTimeout(function(){mostraStats(valores, resp, rod+1)}, 2000))
      });
      return;
    }
  
    if(tec != 'tec' || !window.matchMedia('(max-device-width: 960px)').matches){
      let f = rod + "1";
      foco(f);
  
      for(let i = 1; i < 6; i++){
        let id = ant.toString() + "letra" + i;
        document.getElementById(id).readOnly = true;
    
        let id2 = rod.toString() + "letra" + i;
        document.getElementById(id2).readOnly = false;
      }
    }
  });
}

function getPalavra(id, cb){
  let req = "id=" + id + "&lg=" + lg;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/resposta", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send(req);
}

function enviarStats(rodada, cb){
  let req = "acerto=" + rodada + "&user=" + localStorage.getItem("user");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/acertos", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send(req);
}

function getStats(cb){
  let req = "user=" + localStorage.getItem("user");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/getacertos", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send(req);
}

function mostraStats(valores, resp, rod){
  let ant = rod-1;
  document.getElementById("finalizar").style.display = "inherit";
  
  if(acerto == 5){
    let str = "Parabéns!!<br/> A palavra era: " + resp.toUpperCase() + "<br/>Você levou " + ant;
    if(ant == 1)
      str += " rodada";
    else
      str += " rodadas";
    document.getElementById("msg-finalizar").innerHTML = str;
  }
  else{
    let str = "Você perdeu!<br/> A palavra era: " + resp.toUpperCase();
    document.getElementById("msg-finalizar").innerHTML = str;
  }

  let stat = "Estatísticas<br/><br/>";
  for(let i=0; i<valores.length-1; i++){
    if(i == ant-1){
      stat += "<p id='atual'>" + (i+1) + ": " + valores.charAt(i) + " acertos</p>";
      continue;
    }
    stat += (i+1) + ": " + valores.charAt(i) + " acertos<br/>";
  }

  if(ant == 7){
    stat += "<p id='atual'>" + "💀: " + valores.charAt(6) + " acertos</p>";
  }
  else{
    stat += "💀: " + valores.charAt(6) + " acertos<br/>";
  }
  document.getElementById("stats").innerHTML = stat;
}

function reload(){
  novaPalavra(valor => pal = valor);
  rodada = 1;
  acerto = 0;
  document.getElementById("finalizar").style.display = "none";

  let inputs = document.getElementsByClassName("rodadas");
  for(let i=0; i<inputs.length; i++){
    if(i < 5 && !window.matchMedia('(max-device-width: 960px)').matches){
      inputs[i].readOnly = false;
      if(i == 0)
        inputs[i].focus();
    }
    inputs[i].style.backgroundColor="white";
    inputs[i].value = "";
  }

  let teclas = document.getElementsByClassName("letras");
  for(let i=0; i<teclas.length; i++){
    teclas[i].style.backgroundColor="#d6d6d6";
  }
  
}

function foco(n){
  let linha = parseInt(n.charAt(0));
  let col = parseInt(n.charAt(1));
  if(col < 1){
    return;
  }
  else if(col == 1){
    let nome = linha + "letra" + col;
    document.getElementById(nome).focus();
    return;
  }
  let nome = linha + "letra" + (col-1);
  if(document.getElementById(nome).value != ''){
    let id = linha + "letra" + col;
    document.getElementById(id).focus();
  }
}

function tecla(a){
  if(a == 'enter'){
    tec = 'tec';
    verifica();
    return;
  }
  else if(a == 'del'){
    for(let i = 5; i > 0; i--){
      let id = rodada + "letra" + i;
      if(document.getElementById(id).value != ''){
        document.getElementById(id).value = '';
        return;
      }
    }
    return;
  }
  for(let i = 1; i < 6; i++){
    let id = rodada + "letra" + i;
    if(document.getElementById(id).value == ''){
      document.getElementById(id).value = a;
      return;
    }
  }
}

function tirarAlerta(){
  document.getElementById("mensagem").innerHTML = "";
}