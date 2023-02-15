var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var coinDisplay = document.getElementById("coinDisplay");
var scoreDisplay = document.getElementById("scoreDisplay");

var itemsDiv = document.getElementById("items");
var shopDiv = document.getElementById("shop");

var COLS = 20;
var ROWS = 18;
var BLOCKSIZE = 20;

var snakeColor = items[0].snake;
var appleColor = items[0].apple;
var backColor = items[0].backColor;
var bordColor = items[0].backBorder;
var textColor = items[0].text;

var shopList;
var itemDivList = [];

ctx.canvas.width = COLS * BLOCKSIZE;
ctx.canvas.height = ROWS * BLOCKSIZE;
ctx.scale(BLOCKSIZE, BLOCKSIZE);

class Block{
    x;
    y;
    color;

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.color = snakeColor;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 1, 1);
    }
    apple(){
        this.color = appleColor;
    }
}

class Snake{
    x;
    y;
    tails;
    direction;
    apple;

    constructor(){
        this.x = 10;
        this.y = 9;
        this.init()
    }
    init(){
        this.tails = [];
        this.tails.push(new Block(this.x, this.y));
        this.tails.push(new Block(this.x, this.y));
        this.tails.push(new Block(this.x, this.y));
        this.direction = [1, 0];
        this.apple = randomApple();
    }

    draw(){
        for(var i = 0; i<this.tails.length; i++){
            this.tails[i].draw();
        }
        this.apple.draw();
    }
    move(){
        this.x = this.x + this.direction[0];
        this.y = this.y + this.direction[1];
        if(this.validHead()){
            if(!this.gotApple()){
               this.tails.pop(); 
            }
            
            this.tails.unshift(new Block(this.x, this.y));
            return true;
        }else{
            for(var i = 0; i < this.tails.length; i++){
                this.tails[i].color = 'grey'
                
            }
            snake.draw();
            return false;
        }
        
    }
    changeDirection(dx, dy){
        var newx = this.x + dx;
        var newy = this.y + dy;
        for(var i = 0; i < this.tails.length; i++){
            if(this.tails[i].x == newx && this.tails[i].y == newy){
                //conflict
                return;
            }
        }
        this.direction = [dx, dy];
    }
    validHead(){
        if(this.x < 0 || this.x >= COLS){
            return false;
        }
        if(this.y < 0 || this.y >= ROWS){
            return false;
        }

        for(var i = 0; i < this.tails.length; i++){
            if(this.tails[i].x == this.x && this.tails[i].y == this.y){
                //conflict
                return false;
            }
        }
        return true;
    }

    gotApple(){
        if(this.x == this.apple.x && this.y == this.apple.y){
            score++;
            coin++;
            localStorage.setItem("snakeCoin", coin);
            this.apple = randomApple();
            return true;
        }else{
            return false;
        }
    }

}

function randomApple(){
    var ranX = Math.floor(Math.random() * COLS);
    var ranY = Math.floor(Math.random() * ROWS);
    var app = new Block(ranX, ranY);
    app.apple();
    return app;
}



var snake;
var score;
var coin = localStorage.getItem("snakeCoin");
if(!coin){
    coin = 0;
}
function gameStart(){
    snake = new Snake();
    score = 0;
    shopDiv.classList.add("hidden");
    setTimeout(() => {
        animate();
    }, 1000);
    

}
function gameOver(){
    shopDiv.classList.remove("hidden");
}
var requestId;
var time = {start: 0, elapsed: 0, level: 150};
function animate(now = 0){
    time.elapsed = now - time.start;
    if(time.elapsed > time.level){
        time.start = now;
        if(!snake.move()){
            setTimeout(() => {
                gameOver();
            }, 1000);
            
            return;
        }
        
    }
    scoreDisplay.innerHTML = score;
    coinDisplay.innerHTML = coin;
    ctx.clearRect(0, 0, COLS, ROWS);
    snake.draw();
    requestId = requestAnimationFrame(animate);
}

//change direction
window.addEventListener('keydown', (event) =>{
    if(event.keyCode == 37){//left
        snake.changeDirection(-1, 0);
    }
    if(event.keyCode == 38){//up
        snake.changeDirection(0, -1);
    }
    if(event.keyCode == 39){//right
        snake.changeDirection(1, 0);
    }
    if(event.keyCode == 40){//down
        snake.changeDirection(0, 1);
    }
});




function createItem(num){
    const itemDiv = document.createElement("div");
    const snakeDiv = document.createElement("div");
    const appleDiv = document.createElement("div");
    const priceDiv = document.createElement("div");
    itemDiv.classList = "item";
    snakeDiv.classList = "snake";
    appleDiv.classList = "apple";
    priceDiv.classList = "price";
    itemDiv.appendChild(snakeDiv);
    itemDiv.appendChild(appleDiv);
    itemDiv.appendChild(priceDiv);
    itemsDiv.appendChild(itemDiv);

    if(shopList[i] == false){
        priceDiv.innerHTML = items[num].price + "C";
    }
    
    snakeDiv.style.backgroundColor = items[num].snake;
    appleDiv.style.backgroundColor = items[num].apple;
    itemDiv.style.background = items[num].backColor;
    itemDiv.style.borderColor = items[num].backBorder;
    priceDiv.style.color = items[num].text;

    itemDivList.push(itemDiv);
    itemDiv.addEventListener("mousedown", ()=>{
        //buy or select
        const n = num
        if(shopList[n] == false && coin >= items[num].price){
            coin-=items[num].price;
            shopList[num] = true;
            priceDiv.innerHTML = " ";
            coinDisplay.innerHTML = coin;
            saveStore();
            localStorage.setItem("snakeCoin", coin);
        }
        if(shopList[n] == true){
            colorUpdate(n);
        }
        
    });
}

function saveStore(){
    localStorage.setItem("snakeShopArr", JSON.stringify(shopList));

}
function loadStore(){
    shopList = JSON.parse(localStorage.getItem("snakeShopArr"));
    if(!shopList){
        shopList = [true, false, false, false, false, false];
    }
}

function colorUpdate(num){
    snakeColor = items[num].snake;
    appleColor = items[num].apple;
    backColor = items[num].backColor;
    bordColor = items[num].backBorder;
    textColor = items[num].text;

    canvas.style.background = backColor;
    canvas.style.borderColor = bordColor;
    scoreDisplay.style.color = textColor;
}

loadStore();
for(var i = 0; i < items.length; i++){
    createItem(i);
}
coinDisplay.innerHTML = coin;