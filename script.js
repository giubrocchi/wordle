let pal = novaPalavra();
let rodada = 1;
let acerto = [];
let tec;

function load(){
  if (window.matchMedia('(max-device-width: 960px)').matches){
    for(let i = 1; i < 6; i++){
      let id = "1letra" + i;
      console.log(id);
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
    if(document.activeElement.value != "")
      return;
    focoApaga(linha + coluna);
  }
});

function focoApaga(id){
  let linha = id.charAt(0);
  let coluna = id.charAt(1);
  let nome = linha + "letra" + coluna;
  
  document.getElementById(nome).value = "";
  coluna  = coluna - 1;
  nome = linha + "letra" + coluna;
  document.getElementById(nome).focus();
}

function novaPalavra(){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","/getpalavra", true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      console.log(xmlhttp.responseText);
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

  let palavra = p1.toLowerCase() + p2.toLowerCase() + p3.toLowerCase() + p4.toLowerCase() + p5.toLowerCase();

  // PARTE DO SERVIDOR
  if(!Ma.includes(palavra)){
    document.getElementById("mensagem").innerHTML = "Palavra inválida";
    setTimeout(tirarAlerta, 5000);
    return;
  }

  // PARTE DO SERVIDOR
  comparar(p1, p2, p3, p4, p5);
}

// FUNÇÃO DO SERVIDOR - DEVOLVER VETOR TIPO [0, 1, 0, 2, 0] - 0 NAO TEM, 1 TA NO LUGAR CERTO E 2 TEM MAS NO LUGAR ERRADO
function comparar(p1, p2, p3, p4, p5){
  let quase = [];
  acerto = [];
  
  let id1 = rodada.toString() + "letra1";
  if(p1 == pal.charAt(0)){
    document.getElementById(id1).style.backgroundColor = "#3bd165";
    acerto.push(p1);
    document.getElementById(p1.toLowerCase()).style.backgroundColor = "#3bd165";
  }
  else if(!pal.includes(p1)){
    document.getElementById(id1).style.backgroundColor = "#8c8c8c";
    if(window.getComputedStyle(document.getElementById(p1.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
      document.getElementById(p1.toLowerCase()).style.backgroundColor = "#8c8c8c";
  }
  else{
    document.getElementById(id1).style.backgroundColor = "#edd432";
    quase.push(p1);
    if(window.getComputedStyle(document.getElementById(p1.toLowerCase()), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
      document.getElementById(p1.toLowerCase()).style.backgroundColor = "#edd432";
  }

  let id2 = rodada.toString() + "letra2";
  if(p2 == pal.charAt(1) && pal.split(p2).length-1 > ocorrencias (quase, p2)){
    document.getElementById(id2).style.backgroundColor = "#3bd165";
    acerto.push(p2);
    document.getElementById(p2.toLowerCase()).style.backgroundColor = "#3bd165";
  }
  else if(!pal.includes(p2)){
    document.getElementById(id2).style.backgroundColor = "#8c8c8c";
    if(window.getComputedStyle(document.getElementById(p2.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
      document.getElementById(p2.toLowerCase()).style.backgroundColor = "#8c8c8c";
  }
  else{
    if(pal.split(p2).length-1 > ocorrencias(acerto, p2) + ocorrencias (quase, p2)){
      document.getElementById(id2).style.backgroundColor = "#edd432";
      quase.push(p2);
      if(window.getComputedStyle(document.getElementById(p2.toLowerCase()), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
        document.getElementById(p2.toLowerCase()).style.backgroundColor = "#edd432";
    }
    else{
      document.getElementById(id2).style.backgroundColor = "#8c8c8c";
      if(window.getComputedStyle(document.getElementById(p2.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
        document.getElementById(p2.toLowerCase()).style.backgroundColor = "#8c8c8c";
    }
  }

  let id3 = rodada.toString() + "letra3";
  if(p3 == pal.charAt(2) && pal.split(p3).length-1 > ocorrencias (quase, p3)){
    document.getElementById(id3).style.backgroundColor = "#3bd165";
    acerto.push(p3);
    document.getElementById(p3.toLowerCase()).style.backgroundColor = "#3bd165";
  }
  else if(!pal.includes(p3)){
    document.getElementById(id3).style.backgroundColor = "#8c8c8c";
    if(window.getComputedStyle(document.getElementById(p3.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
      document.getElementById(p3.toLowerCase()).style.backgroundColor = "#8c8c8c";
  }
  else{
    if(pal.split(p3).length-1 > ocorrencias(acerto, p3) + ocorrencias (quase, p3)){
      document.getElementById(id3).style.backgroundColor = "#edd432";
      quase.push(p3);
      if(window.getComputedStyle(document.getElementById(p3.toLowerCase()), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
        document.getElementById(p3.toLowerCase()).style.backgroundColor = "#edd432";
    }
    else{
      document.getElementById(id3).style.backgroundColor = "#8c8c8c";
      if(window.getComputedStyle(document.getElementById(p3.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
        document.getElementById(p3.toLowerCase()).style.backgroundColor = "#8c8c8c";
    }
  }

  let id4 = rodada.toString() + "letra4";
  if(p4 == pal.charAt(3) && pal.split(p4).length-1 > ocorrencias (quase, p4)){
    document.getElementById(id4).style.backgroundColor = "#3bd165";
    acerto.push(p4);
    document.getElementById(p4.toLowerCase()).style.backgroundColor = "#3bd165";
  }
  else if(!pal.includes(p4)){
    document.getElementById(id4).style.backgroundColor = "#8c8c8c";
    if(window.getComputedStyle(document.getElementById(p4.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
      document.getElementById(p4.toLowerCase()).style.backgroundColor = "#8c8c8c";
  }
  else{
    if(pal.split(p4).length-1 > ocorrencias(acerto, p4) + ocorrencias (quase, p4)){
      document.getElementById(id4).style.backgroundColor = "#edd432";
      quase.push(p4);
      if(window.getComputedStyle(document.getElementById(p4.toLowerCase()), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
        document.getElementById(p4.toLowerCase()).style.backgroundColor = "#edd432";
    }
    else{
      document.getElementById(id4).style.backgroundColor = "#8c8c8c";
      if(window.getComputedStyle(document.getElementById(p4.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
        document.getElementById(p4.toLowerCase()).style.backgroundColor = "#8c8c8c";
    }
  }

  let id5 = rodada.toString() + "letra5";
  if(p5 == pal.charAt(4) && pal.split(p5).length-1 > ocorrencias (quase, p5)){
    document.getElementById(id5).style.backgroundColor = "#3bd165";
    acerto.push(p5);
    document.getElementById(p5.toLowerCase()).style.backgroundColor = "#3bd165";
  }
  else if(!pal.includes(p5)){
    document.getElementById(id5).style.backgroundColor = "#8c8c8c";
    if(window.getComputedStyle(document.getElementById(p5.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
      document.getElementById(p5.toLowerCase()).style.backgroundColor = "#8c8c8c";
  }
  else{
    if(pal.split(p5).length-1 > ocorrencias(acerto, p5) + ocorrencias (quase, p5)){
      document.getElementById(id5).style.backgroundColor = "#edd432";
      quase.push(p5);
      if(window.getComputedStyle(document.getElementById(p5.toLowerCase()), null).getPropertyValue('background-color') != "rgb(59, 209, 101)")
        document.getElementById(p5.toLowerCase()).style.backgroundColor = "#edd432";
    }
    else{
      document.getElementById(id5).style.backgroundColor = "#8c8c8c";
      if(window.getComputedStyle(document.getElementById(p5.toLowerCase()), null).getPropertyValue('background-color') == "rgb(214, 214, 214)")
        document.getElementById(p5.toLowerCase()).style.backgroundColor = "#8c8c8c";
    }
  }

  // CLIENTE
  mudaRodada(++rodada);
}

// SERVIDOR
function ocorrencias(array, value) {
    return array.filter((v) => (v === value)).length;
}

function mudaRodada(rod){
  let ant = rod - 1;
  
  // PEGAR PALAVRA DO SERV

  if(acerto.length == 5){
    let str = "Parabéns!! A palavra era: " + pal.toUpperCase() + "<br>Você levou " + ant;
    if(ant == 1)
      str += " rodada";
    else
      str += " rodadas";
    document.getElementById("mensagem").innerHTML = str;

    for(let i = 1; i < 6; i++){
      let id = ant + "letra" + i;
      document.getElementById(id).readOnly = true;
    }
    return;
  }
  
  if(rod == 7){
    let str = "A palavra era: " + pal.toUpperCase();
    document.getElementById("mensagem").innerHTML = str;

    for(let i = 1; i < 6; i++){
      let id = "6letra" + i;
      document.getElementById(id).readOnly = false;
    }
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