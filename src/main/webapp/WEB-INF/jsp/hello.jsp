<%--
  Created by IntelliJ IDEA.
  User: Win10
  Date: 10.03.2020
  Time: 23:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Hello</title>
    <link rel="stylesheet" href="resources/style.css">
    <script src="resources/jquery.js" type="text/javascript"> </script>
    <script src="resources/scripts.js" type="text/javascript"> </script>
</head>
<body onload="onload()">
<div id="toolbar">
    <canvas id="c1" width="800" height="500"></canvas>
    <input type="color" id="color">
    <button class="button" onclick="circle_new()" value="Circle">Circle</button>
    <button class="button" onclick="triangle_new()" value="Triangle">Three</button>
    <button class="button" onclick="move()" value="Move">Move</button>
    <button class="button" onclick="size()" value="Size">Size</button>
    <p>
        Введите имя: <input type="text" id="inp1">
        <button onclick="figure_name()">OK</button>
    </p>
<h2>${message}</h2>
</div>

</body>
</html>
