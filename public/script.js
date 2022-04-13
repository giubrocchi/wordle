let pal;
novaPalavra(valor => pal = valor);
let rodada = 1;
let acerto = 0;
let tec;

function load(){
  if (window.matchMedia('(max-device-width: 960px)').matches){
    for(let i = 1; i < 6; i++){
      let id = "1letra" + i;
      document.getElementById(id).readOnly = true;
    }
  }
}

document.addEventListener("keydown", function(e) {
	if (e.key == 'Enter') {
    tec = '';
    verifica()
  }
  else if(e.key == 'Backspace'){
    let linha = document.activeElement.id.charAt(0);
    let coluna = document.activeElement.id.charAt(6);
    if(document.activeElement.value != "" || coluna == "1")
      return;
    focoApaga(linha + coluna);
  }
});

function focoApaga(id){
  if(id == null)
    return;
  let linha = id.charAt(0);
  let coluna = id.charAt(1);
  let nome = linha + "letra" + coluna;
  
  document.getElementById(nome).value = "";
  coluna  = coluna - 1;
  nome = linha + "letra" + coluna;
  document.getElementById(nome).focus();
}

function novaPalavra(cb){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","/getpalavra", true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send();
}

function verifica(){
  let id = rodada.toString() + "letra1";
  let p1 = document.getElementById(id).value;
  if(p1 == '' || p1.search(/[^a-zA-Z]+/) == 0){
    document.getElementById("mensagem").innerHTML = "Caracteres inválidos";
    setTimeout(tirarAlerta, 5000);
    return;
  }

  id = rodada.toString() + "letra2";
  let p2 = document.getElementById(id).value;
  if(p2 == '' || p2.search(/[^a-zA-Z]+/) == 0){
    document.getElementById("mensagem").innerHTML = "Caracteres inválidos";
    setTimeout(tirarAlerta, 5000);
    return;
  }

  id = rodada.toString() + "letra3";
  let p3 = document.getElementById(id).value;
  if(p3 == '' || p3.search(/[^a-zA-Z]+/) == 0){
    document.getElementById("mensagem").innerHTML = "Caracteres inválidos";
    setTimeout(tirarAlerta, 5000);
    return;
  };

  id = rodada.toString() + "letra4";
  let p4 = document.getElementById(id).value;
  if(p4 == '' || p4.search(/[^a-zA-Z]+/) == 0){
    document.getElementById("mensagem").innerHTML = "Caracteres inválidos";
    setTimeout(tirarAlerta, 5000);
    return;
  }

  id = rodada.toString() + "letra5";
  let p5 = document.getElementById(id).value;
  if(p5 == '' || p5.search(/[^a-zA-Z]+/) == 0){
    document.getElementById("mensagem").innerHTML = "Caracteres inválidos";
    setTimeout(tirarAlerta, 5000);
    return;
  }

  p1 = p1.toLowerCase();
  p2 = p2.toLowerCase();
  p3 = p3.toLowerCase();
  p4 = p4.toLowerCase();
  p5 = p5.toLowerCase();
  let palavra = p1 + p2 + p3 + p4 + p5;

  let ret;

  verificarPal(palavra, valor => {
    ret = valor;
    if(ret == "0"){
      document.getElementById("mensagem").innerHTML = "Palavra inválida";
      setTimeout(tirarAlerta, 5000);
      return;
    }

    comparar(p1, p2, p3, p4, p5, valor => {
      mostraResultado(valor, p1, p2, p3, p4, p5);
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
  xmlhttp.send("palavra=" + palavra);
}

function comparar(p1, p2, p3, p4, p5, cb){
  let req = "p1=" + p1 + "&p2=" + p2 + "&p3=" + p3 + "&p4=" + p4 + "&p5=" + p5 + "&idx=" + pal;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/corrigir", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb(xmlhttp.responseText);
  }
  xmlhttp.send(req);
}

function mostraResultado(valor, p1, p2, p3, p4, p5){
  acerto = 0;
  let inseridas = [p1, p2, p3, p4, p5];
  let letra = [];
  
  for(let i = 0; i < inseridas.length; i++){
    letra[i] = valor.charAt(i);
    let id1 = rodada.toString() + "letra" + (i + 1).toString();
    if(letra[i] == 1){
      document.getElementById(id1).style.backgroundColor = "#3bd165";
      document.getElementById(inseridas[i]).style.backgroundColor = "#3bd165";
      acerto ++;
    }
    else if(letra[i] == 0){
      document.getElementById(id1).style.backgroundColor = "#8c8c8c";
      if(window.getComputedStyle(document.getElementById(inseridas[i]), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
        document.getElementById(inseridas[i]).style.backgroundColor = "#8c8c8c";
    }
    else{
      document.getElementById(id1).style.backgroundColor = "#edd432";
      if(window.getComputedStyle(document.getElementById(inseridas[i]), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
        document.getElementById(inseridas[i]).style.backgroundColor = "#edd432";
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
    
      enviarStats(ant, () => {
        getStats(pal, valores => setTimeout(function(){mostraStats(valores, resp, rod)}, 2000))
      });
      return;
    }
    
    if(rod == 7){
      for(let i = 1; i < 6; i++){
        let id = "6letra" + i;
        document.getElementById(id).readOnly = true;
      }

      enviarStats(rod, () => {
        getStats(pal, valores => setTimeout(function(){mostraStats(valores, resp, rod)}, 2000))
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
  let req = "id=" + id;
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
  let req = "pal=" + pal + "&acerto=" + rodada;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/acertos", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      return cb();
  }
  xmlhttp.send(req);
}

function getStats(palavra, cb){
  let req = "pal=" + palavra;
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

  let stat = "Estatísticas globais<br/><br/>";
  for(let i=0; i<valores.length-1; i++){
    stat += (i+1) + ": " + valores.charAt(i) + " usuários<br/>";
  }
  stat += "💀: " + valores.charAt(6) + " usuários<br/>";
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