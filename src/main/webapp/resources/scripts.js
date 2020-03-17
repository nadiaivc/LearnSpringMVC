var canvas;
var ctx;
var myColor;
var circle_id, triangle_id;//константный индикатор конкретного объекта (на случай если удаляем, меняем имя, что-то должно бытьп остоянным)
var count_triangle, triangle_obj=[];
var count_circle, circle_obj=[];
var figure = 0;
var selected = false;

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

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius, 0, 2*Math.PI, true);
        ctx.closePath();
        document.getElementById('color').oninput = function(){
            myColor = this.value;
        }
        ctx.strokeStyle = myColor;
        ctx.stroke();
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
                    triangle_obj[count_triangle] = new Triangle(count_triangle,mouse.x, mouse.y,50);
                    triangle_obj[count_triangle].draw();
                    count_triangle++;
                }
                break;
            case 2:
                circle_obj[count_circle] = new Circle(count_circle,mouse.x,mouse.y,50);
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
        }
    };
    canvas.onmouseup = function(event){
        mouse.down = false;
        selected = null;
    };
}

function triangle_new() {
    figure = 1;
};

function circle_new() {
    figure = 2;
};

function move() {
    figure = 3;
};