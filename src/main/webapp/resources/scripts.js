var canvas;
var ctx;
var myColor;
var i, three_obj=[];
var j, circle_obj=[];
var selected = false;
var figure = 0;

var mouse = {
    x:0,
    y:0,
    down:false
};

function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.color = myColor;
    this.draw();
}

function Triangle(x, y) {
    this.x = x;
    this.y = y;
    this.color = myColor;
    this.draw();
}

Triangle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x,this.y-30);
    ctx.lineTo(this.x+30,this.y-30);
    ctx.closePath();
    document.getElementById('color').oninput = function(){
        myColor = this.value;
    }
    ctx.fillStyle = myColor;
    ctx.fill();
}

Circle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x,this.y, 50, 0, 2*Math.PI, true);
    ctx.closePath();
    document.getElementById('color').oninput = function(){
        myColor = this.value;
    }
    ctx.strokeStyle = myColor;
    ctx.stroke();
}

function onload() {
    i=0;
    j=0;
    canvas = document.getElementById('c1');
    ctx = canvas.getContext('2d');
    myColor = 'red';
    canvas.onmousemove = function(event){
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    };
    canvas.onmousedown = function(event){//выбираем фигуру
        mouse.down = true;
        switch(figure){
            case 1:
                three_obj[i] = new Triangle(mouse.x, mouse.y);
                i++;
                break;
            case 2:
                circle_obj[j] = new Circle(mouse.x,mouse.y);
                j++;
                break;
        }
    };
    canvas.onmouseup = function(event){
        mouse.down = false;
    };
}

function triangle_new() {
    figure = 1;
};

function circle_new() {
    figure = 2;
};
