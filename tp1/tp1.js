let estados = [];
const ESTADOS = ['andar', 'acelerar', 'salto'];
const FRAMES_POR_ESTADO = [5, 6, 9];
const ESCALA_KIRBY = 2;
const VELOCIDAD_KIRBY = 6;
const INCREMENTO = 0.05;
const DURACION_SALTO = 60;

let termino = false;
let estado_actual;
let x_objetivo;
let y_objetivo;
let kirby_x;
let kirby_y;
let contador_salto = 0;

const ESCALA_NUBE = 0.75
let nubes_sprites;
let nubes_x = [0, 800];
let nubes_y = [150, 400];
let velocidad_nubes = 2;

let fondo;
let fondo_x = 0;

let cur_id = 0;
let pos_x = [100, 250, 400, 520, 650, 760];
let pos_y = [90, 170, 300, 400, 290, 200];

let brillos_frames;
let brillo_x;
let brillo_y;
let velocidad_brillo = 3;
let margen_brillo = 300;
const ESCALA_BRILLO = 2.5;

let puede_hacer_click = false;
let ESCALA_BOTON = 2;
let boton_x = 400;
let boton_y = 300;
let boton_ancho;
let boton_alto;


function cargarSprites(nombre, cantidad){
  let frames = [];
  for (let i = 0; i < cantidad; i++) {
    frames.push(loadImage('data/images/' + nombre + '_' + (i+1) + '.png'));
  }
  return frames;
}

function preload() {
  fondo = loadImage('data/images/fondo.png');
  
  boton_sprite = loadImage('data/images/start.png');
  boton_ancho = boton_sprite.width;
  boton_alto = boton_sprite.height;
  
  for (let i = 0; i<ESTADOS.length; i++){
    estados.push(cargarSprites(ESTADOS[i], FRAMES_POR_ESTADO[i]));
  }
  
  brillos_frames = cargarSprites('brillito', 3);
  nubes_sprites = cargarSprites('nube', 2);
}

function resetear_variables(){
  cur_id = 0;
  brillo_x = width+margen_brillo;
  brillo_y = pos_y[cur_id+1];
  velocidad_brillo = 3;
  
  velocidad_nubes = 2;
  
  x_objetivo = pos_x[cur_id];
  y_objetivo = pos_y[cur_id];
  
  estado_actual = 0;
  contador_salto = 0;
  kirby_x = -50;
  kirby_y = 300;
  
  termino = false;
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  resetear_variables();
}

function cambiar_objetivo(){
  let dist = random(20, 35);
  x_objetivo = pos_x[cur_id]+random(-dist, dist);
  y_objetivo = pos_y[cur_id]+random(-dist, dist);
}

function esta_cerca(){
  let margen = 0.5;
  let diferencia = kirby_x-x_objetivo;
  if(diferencia<0) diferencia = -diferencia;
  
  if(diferencia <= margen) return true;
  else return false;
}

function dibujar_nubes(){
  for(let i = 0; i<nubes_sprites.length; i++){
    let nube_ancho = nubes_sprites[i].width*ESCALA_NUBE;
    let nube_alto = nubes_sprites[i].height*ESCALA_NUBE;
    
    nubes_x[i] -= velocidad_nubes;
    if(nubes_x[i] < -nube_ancho/2) nubes_x[i] = 1200; //se fue de la pantalla
    image(nubes_sprites[i], nubes_x[i], nubes_y[i], nube_ancho, nube_alto);
  }
}

function elegir_frame(frames, velocidad_animacion) {
  let indice = floor(frameCount/velocidad_animacion)%frames.length;
  return frames[indice];
}

function dibujar_sprite_animado(frames, x, y, escala, velocidad) {
  let frame = elegir_frame(frames, velocidad);
  image(frame, x, y, frame.width*escala, frame.height*escala);
}

function draw() {
  image(fondo, width/2, height/2);
  
  dibujar_nubes();

  kirby_x = lerp(kirby_x, x_objetivo, INCREMENTO);
  kirby_y = lerp(kirby_y, y_objetivo, INCREMENTO);
  dibujar_sprite_animado(estados[estado_actual], kirby_x, kirby_y, ESCALA_KIRBY, VELOCIDAD_KIRBY);

  if(termino === true){
    velocidad_nubes = lerp(velocidad_nubes, 2, 0.01);
    estado_actual = 1;
    x_objetivo = width+150;
    y_objetivo = 0;
    image(boton_sprite, boton_x, boton_y, boton_sprite.width*ESCALA_BOTON, boton_sprite.height*ESCALA_BOTON);
  }
  else{
    velocidad_brillo -= 0.001;
    if(velocidad_brillo<0) velocidad_brillo = 0;
    if(brillo_x > pos_x[cur_id]) brillo_x -= velocidad_brillo;
    else estado_actual = 1;
    
    dibujar_sprite_animado(brillos_frames, brillo_x, brillo_y, ESCALA_BRILLO, 6);
    
    if(estado_actual === 2){
      contador_salto++;
      if(contador_salto >= DURACION_SALTO){
        contador_salto = 0;
        estado_actual = 0;
      }
    }
    else if(estado_actual === 1){
      x_objetivo = brillo_x;
      y_objetivo = brillo_y;

      if(esta_cerca()){
        estado_actual = 2;
        cur_id++;
  
        if(cur_id+1 === pos_x.length) termino = true; //ya pase por todas las coordenadas
        else{
          brillo_x = width+margen_brillo;
          brillo_y = pos_y[cur_id+1];
          velocidad_brillo = 3;
          velocidad_nubes += 1.5;
          cambiar_objetivo();
        }
      }
    }
    else{
      if(esta_cerca()) cambiar_objetivo();
    }
  }
}

function mousePressed() {
  if(termino === true){
    let boton_ancho = (boton_sprite.width+50/2);
    let boton_alto = (boton_sprite.height+50/2);
    if(mouseX >= boton_x-boton_ancho && mouseX <= boton_x+boton_ancho && mouseY >= boton_y-boton_alto && mouseY <= boton_y+boton_alto){
      print("click");
      resetear_variables();
    }
  }
}
