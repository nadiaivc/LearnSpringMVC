<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Welcome</title>
    <link rel="stylesheet" href="${contextPath}/resources/css/style.css">
    <script src="${contextPath}/resources/js/jquery.js" type="text/javascript"> </script>
    <script src="${contextPath}/resources/js/scripts.js" type="text/javascript"> </script>

</head>
<body onload="onload()">
<div id="toolbar">
    <canvas id="c1" width="800" height="500"></canvas>
    <input type="color" id="color">
    <button class="button" onclick="circle_new()" value="Circle">Circle</button>
    <button class="button" onclick="triangle_new()" value="Triangle">Three</button>
    <button class="button" onclick="move()" value="Move">Move</button>
    <button class="button" onclick="size()" value="Size">Size</button>
    <button class="button" onclick="add_line()" value="Size">Add line</button>
    <p>
        Введите имя: <input type="text" id="inp1">
        <button onclick="figure_name()">OK</button>
    </p>
</div>
</body>
</html>
