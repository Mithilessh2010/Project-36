//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogImg, happyDogImg;
var fedTime, lastFed, foodObj;
var feed, addFood;

function preload() {
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(900, 500);

  database = firebase.database();

  dog = createSprite(600, 250, 50, 50);
  dog.addImage(dogImg);
  dog.scale = 0.4;

  feedButton = createButton("Feed Dog");
  feedButton.mousePressed(feedDog);
  feedButton.position(400, 180);

  addButton = createButton("Add Food");
  addButton.position(500, 180);
  addButton.mousePressed(addFood);

  foodObj = new Food();


  foodStock = database.ref("Food")
  foodStock.on("value", readStock);



}


function draw() {
  background(46, 139, 87)


  foodObj.display();
  drawSprites();
  //add styles here
  textSize(20);
  fill("black");
  text("Food Left : " + foodS, 190, 100);


  fill(255, 255, 254);
  textSize(15)
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })
  if (lastFed >= 12) {
    text("Last Fed: " + lastFed % 12 + " PM", 50, 50);
  } else if (lastFed === 0) {
    text("Last Fed: 12AM", 50, 50);
  } else {
    text("Last Fed: " + lastFed + "AM", 50, 50);
  }

}
function readStock(data) {
  foodS = data.val();
}

//defining writeStock(x)
function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })
}

function feedDog() {

  dog.addImage(happyDogImg);

  if (foodS <= 0) {
    foodS = 0;
  } else {
    foodS = foodS - 1;
  }

  foodObj.updateFoodStock(foodS);

  database.ref('/').update({
    FeedTime: hour(),
    Food: foodS
  })
}

function addFood() {

  foodS = foodS + 1;
  foodObj.updateFoodStock(foodS);
  database.ref('/').update({
    Food: foodS
  });

}

