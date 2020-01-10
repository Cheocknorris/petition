console.log("check");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// console.log(ctx);
var x;
var y;
var mouseDown = false;

canvas.addEventListener("mousemove", function(event) {
    // var x = event.pageX;
    // var y = event.pageY;
    console.log("mouse moving");
    // console.log("Event: ", event);
    // console.log(event);
    // console.log("pageX: ", x);
    // console.log("pageY: ", y);
    // console.log("offsetX: ", event.offsetX);
    // console.log("offsetY: ", event.offsetY);
    if (mouseDown == true) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2px";
        x = event.offsetX;
        y = event.offsetY;
        console.log("x: ", x);
        console.log("y: ", y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    canvas.addEventListener("mousedown", function() {
        console.log("mousedown happened");
        mouseDown = true;
    });
    canvas.addEventListener("mouseup", function() {
        console.log("mouse happened");
        mouseDown = false;
        ctx.beginPath();
    });
    var canvasUrl = canvas.toDataURL();
    console.log("CanvasUrl: ", canvasUrl);
});
