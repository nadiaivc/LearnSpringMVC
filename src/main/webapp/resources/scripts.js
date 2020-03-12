var canvas;
var ctx;
var myColor;

document.getElementById('color').oninput = function(){
    myColor = this.value;
}
function onload() {
    canvas = document.getElementById('c1');
    ctx = canvas.getContext('2d');
    myColor = 'red';
    ctx.fillStyle = "white";
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousemove', sPos);
    canvas.addEventListener('mouseenter', sPos);
    ctx.fillRect(0, 0, 800, 500);
    download = document.getElementById('download');
}


function circle() {
    canvas.onmousemove = function(event){
        canvas.onmousedown = function(event){
            ctx.beginPath();
            var x = event.offsetX;
            var y = event.offsetY;
            ctx.arc(x,y, 50, 0, 2*Math.PI, true);
            ctx.closePath();

            //ctx.fillRect(x-5, y-5, 10, 10);
            ctx.strokeStyle = myColor;
            ctx.stroke();
        }

        canvas.onmouseup = function(){
            canvas.onmousemove = null;
        }
    }
};
