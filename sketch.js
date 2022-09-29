const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var solo;
var fruta, corda;
var conexao_fruta_corda;
var botao;

var cenarioIMG, frutaIMG, coelhoIMG, coelho;

var piscando, triste, comendo;

var blower;

var backgroundsound, cordarompendosound, comendosound, balaosound, tristesound; 

var mute_btn;

function preload() {

    cenarioIMG = loadImage("background.png");
    frutaIMG = loadImage("melon.png");
    coelhoIMG = loadImage("Rabbit-01.png");

    piscando = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
    comendo = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
    triste = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png" );
   
    backgroundsound = loadSound("sound1.mp3");
    tristesound = loadSound("sad.wav");
    cordarompendosound = loadSound("rope_cut.mp3");
    comendosound = loadSound("eating_sound.mp3");
    balaosound = loadSound("air.wav");


    piscando.playing = true;
    comendo.playing = true;
    triste.playing = true;

    piscando.looping = true;
    comendo.looping = false;
    triste.looping = false;


}


function setup() {
    createCanvas(500, 700);
    frameRate(80);

    backgroundsound.play();
    backgroundsound.setVolume(0.5);

    botao = createImg("cut_btn.png");
    botao.position(220, 25);
    botao.size(50, 50);
    botao.mouseClicked(soltar);
    
    mute_btn = createImg("mute.png");
    mute_btn.position(420, 20);
    mute_btn.size(50, 50);
    mute_btn.mouseClicked(mute);

    blower = createImg("balloon.png");
    blower.position(10, 250);
    blower.size(150, 100);
    blower.mouseClicked(airBlow);

    engine = Engine.create();
    world = engine.world;
    solo = new Ground(200, 690, 600, 20);

    corda = new Rope(7, { x: 245, y: 30 });
    fruta = Bodies.circle(300, 300, 20);
    Composite.add(corda.body, fruta);

    con_fruta_corda = new Link(corda, fruta);

    
    piscando.frameDelay = 20;
    comendo.frameDelay = 20;
    triste.frameDelay = 20;


    coelho = createSprite(245, 650, 50, 50);
    coelho.addImage(coelhoIMG);
 
    coelho.addAnimation("comendo", comendo);
    coelho.addAnimation("piscando", piscando);
    coelho.addAnimation("triste", triste);

    coelho.changeAnimation("piscando")

    coelho.scale = 0.15

    rectMode(CENTER);
    ellipseMode(RADIUS);

    textSize(50)


}

function draw() {
    image(cenarioIMG, 0, 0, width, height);
    corda.show();
    imageMode(CENTER);
    coelho.x = 250

    Engine.update(engine);
    solo.show();

    if (fruta !== null) {
        image(frutaIMG, fruta.position.x, fruta.position.y, 60, 60);
    }

    if(colidiu(fruta, coelho)){
        coelho.changeAnimation("comendo");
        comendosound.play();
    }


    if(colidiu(fruta, solo.body)){
        coelho.changeAnimation("triste");
        backgroundsound.stop();
        tristesound.play();
        
    }
  

    drawSprites();

}

function soltar() {
    cordarompendosound.play();
    corda.break();
    con_fruta_corda.detach();
    con_fruta_corda = null;

}

function colidiu(corpo, sprite){

    if(corpo  !== null){
        var d = 0;
        var distancia = dist(fruta.position.x, fruta.position.y, sprite.position.x, sprite.position.y);
            if (distancia <= 80){
                World.remove(world,fruta);
                fruta = null;
                return true
            }else{
                return false

            }
            
            
    }
}

function airBlow(){
Matter.Body.applyForce(fruta, {x:0, y:0},{x:0.01, y:0} )
balaosound.play()



}

function mute(){
if (backgroundsound.isPlaying()) {
    backgroundsound.stop();
} else {
    backgroundsound.play();
}    


}

