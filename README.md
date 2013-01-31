Excel2Canvas
-----------------
-----------------

Overview
--------
Excel2Canvas is a library for display an Excel file on the web browser.

Its source codes consists of two parts.

1. **Java.** It is used to convert Excel file to JSON.
2. **JavaScript.** It is used to draw Excel like view on the web browser.

Usage
-----
At first, read a excel file and convert it to JSON string.

    ExcelToCanvasBuilder builder = new ExcelToCanvasBuilder();
    builder.setIncludeComment(true);//If need display comments.
    builder.setIncludeChart(true);//If need display charts.(Flotr2 is required.)
    String json = builder.build(new File("Book1.xlsx"), "Sheet1");
    
Next, embed JSON string to HTML, and apply jQuery plugin method to a div element that holding a canvas element.

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    
    <link rel="stylesheet" type="text/css" media="screen,print" href="jquery.excel2canvas.css" />
    <script type="text/javascript" language="javascript"  src="flotr2.js"></script>
    <script type="text/javascript" language="javascript"  src="jquery.excel2canvas.js"></script>

    <script>
    $(function() {
    	var data = ${excel.raw()};//Get the JSON string.(Template engine syntax.)
    	$("#canvasHolder").excelToCanvas(data).css("width", $("#canvas").width());
    });
    </script>
    
    ...
    
    <div id="canvasHolder">
    	<canvas id="canvas"></canvas>
    </div>

Supported Excel features
------------------------
* Background color
    * Simple color is supported.
    * Pattern and graduation are not.
* Lines
    * Simple line, Double line, and Dash line are supported.
    * Not supported lines are drawn as simple line.
* Pictures
    * png and jpeg are supported.
    * All of decorations are not supported.(e.g. border, rotation)
* String
    * Font : Depends on browser.
    * Format ： Except localized format.(Starts with "*")
    * Horizontal alignment： Left, Right, Center
    * Vertica alignmentl：Top, Bottom, Middle
    * HyperLink : Support.
    * Merged cell : Support.
    * Rich string: Not support.
* Comment
    * Support.
* Formula
    * Depends on [Apache POI](http://poi.apache.org/)
* Chart
    * Partial support.
    * xlsx only
    * Support bar chart, pie chart, and line chart.
    * Properties are not considered.(e.g. Colors, marks of line chart, position of legend)
    
Dependencies
------------
The java library is highly dependent on [Apache POI](http://poi.apache.org/)

The javascript library is a [jQuery](http://jquery.com/) plugin

If you want to display chart, you must include [Flotr2](http://humblesoftware.com/flotr2/)

Samles
------
[ExcelNote](https://excelnote.herokuapp.com/) is an application that uses this library.
If the Excel file is attached in Evernote, it allows you to display and edit it on the web browser.

And if that note is shared with the world, it is published to everyone.

Followings are some of its samples.(Japanese only)

- [Time schedule](http://excelnote.herokuapp.com/share/note/s91/90ae165a-18b7-4879-a667-6ad15bbcd57b/5e1a3c243456d0e3daf8bd42005a22e0?theme=humanity)
- [The result of a baseball game](http://excelnote.herokuapp.com/share/note/s91/e94bd16f-465a-4a24-b71e-dff906cf3395/67079ce23db9c8af6df06b33d12c8e70?theme=sunny)
- [Purchase order](https://excelnote.herokuapp.com/share/excel/s91/09880d80-43bd-4728-9f8f-300b84a3a32c/151561d3185ea4c1dc7fa3ab3f2db653?sheet=%E7%99%BA%E6%B3%A8%E6%9B%B8&theme=redmond)
  It is able to print as is from web browser.
  