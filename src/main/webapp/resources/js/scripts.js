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
var c1;
var CHANGE=5;
var first_for_line;
var second_for_line;
var count_for_line = 0;


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
        this.big_name = false;//для hover у длинных имен
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

    DoBigger(){
        this.radius += CHANGE;
        for (var move_child = 0; move_child < this.child.length; move_child++) {
            {
                var id_child = this.child[move_child];
            }
            for (var search = 0; search < count_triangle; search++) {
                if (triangle_obj[search].id == id_child) {
                    triangle_obj[search].x += CHANGE/2;
                    triangle_obj[search].y += CHANGE/2;
                }
            }
        }

    }

    DoSmaller(){
        this.radius -= CHANGE;
        for (var move_child = 0; move_child < this.child.length; move_child++) {
            {
                var id_child = this.child[move_child];
            }
            for (var search = 0; search < count_triangle; search++) {
                if (triangle_obj[search].id == id_child) {
                    triangle_obj[search].x -= CHANGE/2;
                    triangle_obj[search].y -= CHANGE/2;
                }
            }
        }
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
        ctx.font = "italic 12pt Arial";
        if (this.name_length > this.radius*2)
            this.big_name = true;
        else{
        ctx.fillText(this.name, this.x - this.radius, this.y);
        }
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
        this.lines = [];
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
            for (var move_line = 0; move_line < this.lines.length; move_line++)
            {
                for (var search = 0; search < count_triangle; search++) {//подумать, что сделать с поиском, если номера будут идти нестандартно (тип 1,5,100..)(рассмотреть последствия удаления объектов)
                    if (triangle_obj[search].id == this.lines[move_line]) {
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(triangle_obj[search].x, triangle_obj[search].y);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }

            }

            ctx.fillStyle = "#FFF";
            ctx.font = "italic 12pt Arial";
            if (this.name_length > this.size - 5)
            this.big_name = true;
            else {
                ctx.fillText(this.name, this.x + this.size / 5, this.y + this.size / 2);
            }

    }
}

function onload() {
    circle_id = 0;
    triangle_id = 0;
    count_triangle = 0;
    count_circle = 0;
    canvas = document.getElementById('c1');
    ctx = canvas.getContext('2d');
    myColor = 'red';
    c1 = document.querySelector("canvas");

    canvas.onmousemove = function (event) {
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
        if (selected) {
            if (figure == 4) {//resize
                if (resize == 0) {//circle
                    if (selected.isBigger()) {
                        selected.DoBigger();

                    }
                    if (selected.isSmaller()) {
                        selected.DoSmaller();
                    }
                } else {//triangle
                    var point = selected.whichPoint();
                    if (point != 0) {//курсор в какой-то из точек
                        if (point == 4) {//внутри треугольника, но не около точек
                            selected.size -= CHANGE;
                        } else
                            selected.size += CHANGE;
                    }
                }
            } else {   //move

                selected.x += event.movementX;
                selected.y += event.movementY;
                for (var move_child = 0; move_child < selected.child.length; move_child++) {
                    {
                        var id_child = selected.child[move_child];
                    }
                    for (var search = 0; search < count_triangle; search++) {
                        if (triangle_obj[search].id == id_child) {
                            triangle_obj[search].x += event.movementX;
                            triangle_obj[search].y += event.movementY;
                        }
                    }
                }
            }

            reload();
        }

        circle_obj.forEach(n => {//hover для длинных имен
            if (n.big_name == true) {
                if (n.isCursorInFigure()) {
                    ctx.fillText(n.name, n.x - n.radius, n.y);
                } else {
                    reload();
                    }
                }
            })
        triangle_obj.forEach(n => {//hover для длинных имен
            if (n.big_name == true) {
                if (n.isCursorInFigure({x: n.x, y: n.y}, {x: n.x + n.size, y: n.y}, {x: n.x, y: n.y + n.size})) {
                    ctx.fillText(n.name, n.x + n.size / 5, n.y + n.size / 2);
                } else {
                    reload();
                }
            }
        })
    };

    function reload(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circle_obj.forEach(n => n.draw());
        triangle_obj.forEach(n => n.draw());
    }

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
            case 4://увеличить/уменьшить
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
                break;
            case 5://нарисовать линию между 2мя треугольниками
                if (!selected){
                    triangle_obj.forEach(n => {
                        if (n.isCursorInFigure({x: n.x, y: n.y}, {x: n.x + n.size, y: n.y}, {x: n.x, y: n.y + n.size})) {
                            if (count_for_line == 0){
                                first_for_line = n;
                                count_for_line++;
                            }
                            else if (count_for_line == 1){
                                second_for_line = n;
                                first_for_line.lines.push(second_for_line.id);
                                second_for_line.lines.push(first_for_line.id);
                                count_for_line = 0;
                                reload();
                            }
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
function move() {
    figure = 3;
};
function size() {
    figure = 4;
};
function add_line() {
    figure = 5;
};