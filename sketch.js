//Set initial camera values
let x_cam = 0;
let y_cam = 0;
let z_cam = 500;

let cam_mov = 0;
let x_cam_mov = 0;
let y_cam_mov = 0;

//Set the initial mode with boolean switches
let sw0 = true;
let sw1 = false;
let sw2 = false;
let sw3 = false;

let sw_cam = false;
let sw_cam_tutorial = true;

//Set variables
let move_x = 0;
let move_y = 0;

let rot_x = 0;
const rot_y = 45;
let rot_z = 0;

let size = 150;

let col_a = 'white';
let col_b = 'black';
let col_c = 'red';
let col_bckg = col_b;
let col_stroke = col_a;

//controls the rotation degrees after which the movement mode gets switched to the next
let rot_sw = 360;

//controls both rotation and translation speed, acting as a multiplier for frameCount
const move_speed = 1;

//random tutorial text
const text_options = ['Click to gain a new perspective on life', 'Click and learn to see a deeper reality', 'Click to acquire a more profound vision of life', 'Click and see the world from a new point of view', 'Click to see things in a new way'];
let tutorial_text;

function preload(){
  font = loadFont('SpaceMono-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth,windowHeight,WEBGL);
  angleMode(DEGREES);
  frameRate(120);

  cam = createCamera();
  ortho();

  textFont(font);
  textSize(width/60);
  textAlign(CENTER);

  tutorial_text = random(text_options);

  /*debug*/ //normalMaterial()
  noFill();

  //controls in which box the sphere appears
  sphere_x = int(random(4,10));
  sphere_y = int(random(1,5));
}

function draw() {
  background(col_bckg);
  cam.setPosition(x_cam,y_cam,z_cam);

  //tutorial text
  push();
  if (sw_cam_tutorial == true){
    fill(col_stroke);
    noStroke();
    translate(0,height/3,-600)
    text(tutorial_text,0,0);
  } pop();

  //change box stroke weight based on cam mode
  if (sw_cam == true){strokeWeight(3);}
  else if (sw_cam == false){strokeWeight(5);}

  //mode switcher
  //switches between the 4 movement modes
  if (frameCount*move_speed%rot_sw == 0){
    if (sw0 == true){sw0 =! sw0; sw1 =! sw1}
    else if (sw1 == true){sw1 =! sw1; sw2 =! sw2}
    else if (sw2 == true){sw2 =! sw2; sw3 =! sw3}
    else if (sw3 == true){sw3 =! sw3; sw0 =! sw0}
    //color switch
    if (col_bckg === col_b){ //switches to white back and black box (modes 1 and 3)
      col_bckg = col_a;
      col_stroke = col_b;
    }
    else{ //switches to black back and white box (modes 0 and 2)
      col_bckg = col_b;
      col_stroke = col_a;
    }
  }

  //mode movement
  //manipulates the variables for both rotation and translation for each of the 4 modes
  if (sw0 == true){
    move_x -= move_speed;
    move_y += move_speed;

    rot_x = 0;
    rot_z -= move_speed;
  }
  else if (sw1 == true){
    move_x += move_speed;
    move_y += move_speed;

    rot_x -= move_speed;
    rot_z = 0;
  }
  else if (sw2 == true){
    move_x += move_speed;
    move_y -= move_speed;

    rot_x = 0;
    rot_z += move_speed;
  }
  else if (sw3 == true){
    move_x -= move_speed;
    move_y -= move_speed;

    rot_x += move_speed;
    rot_z = 0;
  }

  //box gen red
  //generates all the red boxes
  push();
  translate(-move_x,-move_y,0);
  for(let x = -width-75; x < width*1.5; x += 2*size){
    for(let y = -height-25; y < height*1.5; y += 2*size){
      push();
          stroke(col_c);
          translate(x,y,-500); //red boxes are generated in the back for parallax
          rotateY(-rot_y);
          if(sw0 == true || sw2 == true){rotateZ(rot_z);}
          else if(sw1 == true || sw3 == true){rotateX(rot_x);}
            box(size);
      pop();
    }
  } pop();

  //box gen w/b
  //generates all the white and black boxes + the sphere
  push();
  translate(move_x,move_y,0);
  //sphere
  push();
      translate(-width-50+2*size*sphere_x,-height+2*size*sphere_y,0);
      if(sw0 == true || sw2 == true){rotateZ(rot_z);}
      else if(sw1 == true || sw3 == true){rotateX(rot_x);}
      rotateY(frameCount);
      normalMaterial(); //sphere uses debug material
      stroke(col_stroke);
        if (sw_cam == true){strokeWeight(0.5);}
        else if (sw_cam == false){strokeWeight(1);}
      sphere(noise((frameCount)/30)*20+size/6,10,10);
  pop();
  //box
  for(let x = -width-50; x < width; x += 2*size){
    for(let y = -height; y < height; y += 2*size){
      push();
          stroke(col_stroke);
          translate(x,y,0);
          rotateY(rot_y);
          if(sw0 == true || sw2 == true){rotateZ(rot_z);}
          else if(sw1 == true || sw3 == true){rotateX(rot_x);}
            box(size);
      pop();
    }
  } pop();
}

//switch cam mode on click
function mouseClicked(){
  if (sw_cam == true){ortho(); sw_cam =! sw_cam; z_cam = 500;}
  else if (sw_cam == false){perspective(); sw_cam =! sw_cam; z_cam = 1350; sw_cam_tutorial = false;}
}

//window resizing
function windowResized(){
  //had to switch automatically to perspective cam as ortho causes errors with canvas resizing
  perspective();
  sw_cam = true;
  sw_cam_tutorial = false;
  z_cam = 1350;
  resizeCanvas(windowWidth,windowHeight);
}

//move camera view for parallax effect
function mouseMoved(){
  //change how much view can move based on cam mode
  if (sw_cam == true){cam_mov = 0.06}
  else if (sw_cam == false){cam_mov = 0.02}
  x_cam_mov = mouseX*cam_mov;
  y_cam_mov = mouseY*cam_mov;
  cam.lookAt(x_cam_mov,y_cam_mov,0)
}
