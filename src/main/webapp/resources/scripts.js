var canvas;
var ctx;
var myColor;
var circle_id, triangle_id;//константный индикатор конкретного объекта (на случай если удаляем, меняем имя, что-то должно бытьп остоянным)
var count_triangle, triangle_obj=[];
var count_circle, circle_obj=[];
var figure = 0;
var selected = false;
var name_now;
var length_name;
var resize;//circle or triangle

var mouse = {
    x:0,
    y:0,
    down:false
};

class Figure {
    constructor(name, x, y) {
        this.x = x;
        this.y = y;
        this.color = 'red';
        this.name = name;
        this.name_length = length_name;
    }
}

class Circle extends Figure{
    constructor(name, x, y, radius){
        super(name, x, y);
        this.child = [];
        this.radius = radius;
        this.id = circle_id;
        circle_id++;
    }

    isCursorInFigure() {
        return Math.pow(mouse.y - this.y, 2) + Math.pow( mouse.x - this.x, 2) <= Math.pow(this.radius,2);
    }
    isBigger(){
        return Math.pow(mouse.y - this.y, 2) + Math.pow( mouse.x - this.x, 2) <= Math.pow(this.radius + 5,2)&&
            Math.pow(mouse.y - this.y, 2) + Math.pow( mouse.x - this.x, 2) >= Math.pow(this.radius - 4,2);
    }
    isSmaller(){
        return Math.pow(mouse.y - this.y, 2) + Math.pow( mouse.x - this.x, 2) <= Math.pow(this.radius - 5,2);
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius, 0, 2*Math.PI, true);
        ctx.closePath();
        document.getElementById('color').oninput = function(){
            myColor = this.value;
        }
        ctx.strokeStyle = myColor;
        ctx.stroke();

        ctx.fillStyle = "#FFF";
        ctx.font = "italic 14pt Arial";
        ctx.fillText(this.name, this.x - this.radius/2, this.y);
    }
}

function sign(p2, p3) {
    return (mouse.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (mouse.y - p3.y);
}

class Triangle extends Figure{
    constructor(name, x, y, size){
        super(name, x, y);
        this.size = size;//катет
        this.id = triangle_id;
        triangle_id++;
    }

    isCursorInFigure(v1, v2, v3) {
        var
            b1 = sign(v1, v2) < 0,
            b2 = sign(v2, v3) < 0,
            b3 = sign(v3, v1) < 0;

        return ((b1 == b2) && (b2 == b3));
    }

    whichPoint(){
        if (Math.pow(mouse.y - this.y, 2) + Math.pow( mouse.x - this.x, 2) <= Math.pow(10,2))
            return 1;
        if (Math.pow(mouse.y - (this.y + this.size), 2) + Math.pow( mouse.x - this.x, 2) <= Math.pow(10,2))
            return 2;
        if (Math.pow(mouse.y - this.y, 2) + Math.pow( mouse.x - this.x - this.size, 2) <= Math.pow(10,2))
            return 3;
        else if (Math.pow(mouse.y - (this.y + this.size/3), 2) + Math.pow( mouse.x - this.x - this.size/3, 2) <= Math.pow(this.size/3,2))
            return 4;
        else return 0;
    }


    draw(){
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(this.x+this.size,this.y);
            ctx.lineTo(this.x,this.y+this.size);
            ctx.closePath();
            document.getElementById('color').oninput = function(){
                myColor = this.value;
            }
            ctx.fillStyle = myColor;
            ctx.fill();
            ctx.fillStyle = "#FFF";
            ctx.font = "italic 14pt Arial";
            ctx.fillText(this.name, this.x + this.size/5, this.y + this.size/2);


    }
}

function onload() {
    circle_id = 0;
    triangle_id = 0;
    count_triangle=0;
    count_circle=0;
    canvas = document.getElementById('c1');
    ctx = canvas.getContext('2d');
    myColor = 'red';


    canvas.onmousemove = function(event){
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;

        if (selected) {
            if (figure==4){
                if (resize==0){
                    if(selected.isBigger()){
                        selected.radius+=5;
                    }
                    if(selected.isSmaller()){
                        selected.radius-=5;
                    }
                }
                else {
                   var point = selected.whichPoint();
                   if (point!=0) {
                       if (point == 4) {
                           selected.size -= 5;
                       }
                       else
                           selected.size += 5;
                   }
                }
            }
            else{
                selected.x += event.movementX;
                selected.y += event.movementY;
                for(var move_child = 0; move_child < selected.child.length; move_child++){
                {
                    var id_child = selected.child[move_child];
                }
                    for(var search = 0; search<count_triangle; search++){
                        if (triangle_obj[search].id == id_child) {
                            triangle_obj[search].x += event.movementX;
                            triangle_obj[search].y += event.movementY;
                        }
                    }
                }
            }


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            triangle_obj.forEach(n => n.draw());
            circle_obj.forEach(n => n.draw());
        }
    };
    canvas.onmousedown = function(event){//выбираем фигуру
        mouse.down = true;
        switch(figure){
            case 1:
                var have_circle = false;
                var n;
                circle_obj.forEach(n => {
                    if (n.isCursorInFigure()) {
                        have_circle = true;
                        n.child.push(triangle_id);
                    }
                })
                if (have_circle){ //рисуем треугольник только в области круга
                    triangle_obj[count_triangle] = new Triangle(name_now,mouse.x, mouse.y,50);
                    triangle_obj[count_triangle].draw();
                    count_triangle++;
                }
                break;
            case 2:
                circle_obj[count_circle] = new Circle(name_now,mouse.x,mouse.y,50);
                circle_obj[count_circle].draw();
                count_circle++;
                break;
            case 3://не создаем новые фигуры, просто можно двигать существующие
                if (!selected) {
                    /*triangle_obj.forEach(n => {
                        if (n.isCursorInFigure({x: n.x, y: n.y}, {x: n.x + n.size, y: n.y}, {x: n.x, y: n.y + n.size})) {
                            selected = n
                        }
                    })*/
                    circle_obj.forEach(n => {
                        if (n.isCursorInFigure()) {
                            selected = n
                        }
                    })
                }
                break;
            case 4:
                if (!selected){
                    triangle_obj.forEach(n => {
                        if (n.isCursorInFigure({x: n.x, y: n.y}, {x: n.x + n.size, y: n.y}, {x: n.x, y: n.y + n.size})) {
                            selected = n;
                            resize = 1;
                        }
                    })
                    if (!selected){
                        circle_obj.forEach(n => {
                            if (n.isCursorInFigure()) {
                                selected = n;
                                resize = 0;
                            }
                        })
                    }

                }
        }
    };
    canvas.onmouseup = function(event){
        mouse.down = false;
        selected = null;
    };
}


function figure_name() {
    name_now = document.getElementById('inp1').value
    length_name = ctx.measureText(name_now).width;
};

function triangle_new() {
    figure = 1;
};

function circle_new() {
    figure = 2;
};
function size() {
    figure = 4;
};
function move() {
    figure = 3;
};