(function ($) {
	var
		BORDER_THIN                = 1,
		BORDER_MEDIUM              = 2,
		BORDER_DASHED              = 3,
		BORDER_HAIR                = 4,
		BORDER_THICK               = 5,
		BORDER_DOUBLE              = 6,
		BORDER_DOTTED              = 7,
		BORDER_MEDIUM_DASHED       = 8,
		BORDER_DASH_DOT            = 9,
		BORDER_MEDIUM_DASH_DOT     = 10,
		BORDER_DASH_DOT_DOT        = 11,
		BORDER_MEDIUM_DASH_DOT_DOT = 12,
		BORDER_SLANTED_DASH_DOT    = 13;
	
	var context;
	function fillStyle(fill) {
		if (fill.fore) {
			context.fillStyle = fill.fore;
			context.fillRect(fill.p[0], fill.p[1], fill.p[2], fill.p[3]);
		}
	}
	function drawLine(line) {
		var kind = line.kind ? line.kind : 1;
		var w = 1;
		if (kind == BORDER_MEDIUM || 
		    kind == BORDER_MEDIUM_DASHED || 
		    kind == BORDER_MEDIUM_DASH_DOT ||
		    kind == BORDER_MEDIUM_DASH_DOT_DOT) 
		{
			w = 2;
		} else if (kind == BORDER_THICK) {
			w = 3;
		}
		context.lineWidth = w;
		if (line.color) {
			context.strokeStyle = line.color;
		} else {
			context.strokeStyle = "#000000";
		}
		if (kind == BORDER_DOUBLE) {
			var horizontal = line.p[1] == line.p[3];
			context.beginPath();
			if (horizontal) {
				context.moveTo(line.p[0], line.p[1] - 1);
				context.lineTo(line.p[2], line.p[3] - 1);
				context.moveTo(line.p[0], line.p[1] + 2);
				context.lineTo(line.p[2], line.p[3] + 2);
			} else {
				context.moveTo(line.p[0] - 1, line.p[1]);
				context.lineTo(line.p[2] - 1, line.p[3]);
				context.moveTo(line.p[0] + 2, line.p[1]);
				context.lineTo(line.p[2] + 2, line.p[3]);
			}
			context.stroke();
			context.closePath();
		} else if (kind == BORDER_DASHED ||
		           kind == BORDER_HAIR ||
		           kind == BORDER_DOTTED ||
		           kind == BORDER_MEDIUM_DASHED)
		{
			var bw, sw;
			switch (kind) {
				case BORDER_DASHED:
					bw = 4; sw = 2;
					break;
				case BORDER_HAIR:
					bw = 2; sw = 2;
					break;
				case BORDER_DOTTED:
					bw = 1; sw = 1;
					break;
				case BORDER_MEDIUM_DASHED:
					bw = 8; sw = 3;
					break;
			}
			
			var bar = true;
			var horizontal = line.p[1] == line.p[3];
			context.beginPath();
			context.moveTo(line.p[0], line.p[1]);
			if (horizontal) {
				var y = line.p[1];
				var cx = line.p[0];
				var ex = line.p[2];
				while (cx < ex) {
					var nx = bar ? bw : sw;
					if (nx > ex) {
						nx = ex;
					}
					cx += nx;
					if (bar) {
						context.lineTo(cx, y);
					} else {
						context.moveTo(cx, y);
					}
					bar = !bar;
				}
			} else {
				var x = line.p[0];
				var cy = line.p[1];
				var ey = line.p[3];
				while (cy < ey) {
					var ny = bar ? bw : sw;
					if (ny > ey) {
						ny = ey;
					}
					cy += ny;
					if (bar) {
						context.lineTo(x, cy);
					} else {
						context.moveTo(x, cy);
					}
					bar = !bar;
				}
			}
			context.stroke();
			context.closePath();
		} else {
			context.beginPath();
			context.moveTo(line.p[0], line.p[1]);
			context.lineTo(line.p[2], line.p[3]);
			context.stroke();
			context.closePath();
		}
	}
	$.fn.excelToCanvas = function(data, convertImg) {
		var holder, canvas;
		if (this[0].tagName == "canvas") {
			canvas = this;
			holder = canvas.parent();
		} else {
			holder = this;
			canvas = holder.find("canvas");
			if (canvas.length == 0) {
				canvas = $("<canvas style='position:absolute;left:0;top:0;z-index:0'></canavas>").appendTo(holder);
			}
		}
		if (typeof FlashCanvas !== "undefined") {
			FlashCanvas.initElement(canvas[0]);
		}
		
		canvas.attr("width", data.width).attr("height", data.height);
		context = canvas[0].getContext("2d");
		context.fillStyle = "white";
		context.fillRect(0, 0, data.width, data.height);
		
		if (data.fills) {
			for (var i=0; i<data.fills.length; i++) {
				var fill = data.fills[i];
				fillStyle(fill);
			}
		}
		if (data.lines) {
			for (var i=0; i<data.lines.length; i++) {
				var line = data.lines[i];
				drawLine(line);
			}
		}
		
		if (data.strs) {
			for (var i=0; i<data.strs.length; i++) {
				var str = data.strs[i];
				var span = $("<span id='" + str.id + "' style='" + str.style + "'></span>");
				if (str.link) {
					var link = $("<a target='_blank'></a>");
					link.append(str.text);
					link.attr("href", str.link);
					span.append(link);
				} else {
					span.append(str.text);
				}
				var align = str.align;
				if (align) {
					span.addClass("cell-a" + align[0]);
					span.addClass("cell-v" + align[1]);
					if (align[1] == "c" || align[1] == "j") {
						var n = str.text.split("<br>").length;
						if (n > 1) {
							span.css("margin-top", "-" + (n / 2) + "em");
						}
					}
				}
				if (str.rawdata) {
					span.attr("data-raw", str.rawdata);
				}
				var div = $("<div class='cell'></div>").append(span);
				div.css({
					"left" : str.p[0],
					"top" : str.p[1],
					"width" : str.p[2],
					"height" : str.p[3]
				});
				if (str.comment && $.fn.tooltip) {
					context.strokeStyle = "red";
					context.fillStyle = "red";
					
					context.beginPath();
					context.moveTo(str.p[0] + str.commentWidth - 4,  str.p[1]);
					context.lineTo(str.p[0] + str.commentWidth, str.p[1]);
					context.lineTo(str.p[0] + str.commentWidth, str.p[1] + 4);
					context.lineTo(str.p[0] + str.commentWidth - 4, str.p[1]);
					context.stroke();
					context.fill();
					context.closePath();
					div.tooltip({
						"title" : str.comment
					});
					div.data("tooltip").tip().find(".tooltip-inner").css({
						"font-size" : "12px",
						"text-align" : "left"
					});
				}
				holder.append(div);
			}
		}
		
		if (data.pictures) {
			for (var i=0; i<data.pictures.length; i++) {
				var pic = data.pictures[i];
				var img = $("<img class='excel-img'/>");
				img.attr("src", pic.uri);
				img.css({
					"left" : pic.p[0],
					"top" : pic.p[1],
					"width" : pic.p[2],
					"height" : pic.p[3]
				});
				holder.append(img);
			}
		}
		if (data.charts && typeof(Flotr) === "object") {
			for (var i=0; i<data.charts.length; i++) {
				var chart = data.charts[i];
				var chartDiv = $("<div class='excel-chart'></div>");
				chartDiv.css({
					"left" : chart.p[0],
					"top" : chart.p[1],
					"width" : chart.p[2],
					"height" : chart.p[3]
				});
				holder.append(chartDiv);
				chartDiv.excelToChart(chart.chart);
				chartDiv.css("position", "absolute");
			}
		}
		if (convertImg && typeof FlashCanvas === "undefined") {
			var img = $("<img/>");
			img.css({
				"position" : "absolute",
				"left" : 0,
				"top" : 0,
				"z-index" : 0,
				"width" : canvas.attr("width"),
				"height" : canvas.attr("height")
			});
			img.attr("src", canvas[0].toDataURL());
			holder.append(img);
			canvas.remove();
		}
		return this;
	}
	$.fn.excelToChart = function(chart) {
		function buildChartOption() {
			var type = chart.type;
			var option = chart.option;
			var base = {}
			switch (type) {
				case "PIE":
					base = {
						"HtmlText" : false,
						"grid" : {
							"verticalLines" : false,
							"horizontalLines" : false
						},
						"xaxis" : { 
							"showLabels" : false 
						},
						"yaxis" : {
							"showLabels" : false 
						},
						"pie" : {
							"show" : true, 
							"fill" : true,
							"fillColor": null,
							"fillOpacity": 0.5,
							"explode" : 0,
							"startAngle" : 0.75
						},
						"legend" : {
							position : "se",
							backgroundColor : "#D2E8FF"
						}
					};
					break;
				case "BAR":
					var horizontal = option.bars.horizontal;
					base = {
						"HtmlText" : false,
						"bars" : {
							"show" : true,
							"horizontal" : false,
							"shadowSize" : 0,
							"barWidth" : 0.5
						},
						"xaxis" : {
							"min" : 0
						},
						"yaxis" : {
							"min" : 0
						},
						"grid" : {
							"verticalLines" : horizontal,
							"horizontalLines" : !horizontal
						},
						"legend" : {
							position : horizontal ? "se" : "nw",
							backgroundColor : "#D2E8FF"
						}
					};
					break;
				case "LINE":
					base = {
						"HtmlText" : false,
						"xaxis" : {
							"min" : 0,
							"max" : chart.labels.length + 1
						},
						"yaxis" : {
							"min" : 0
						},
						"legend" : {
							position : "nw",
							backgroundColor : "#D2E8FF"
						}
					};
					break;
				case "RADAR":
					base = {
						"HtmlText" : false,
						"radar" : {
							"show" : true,
							"fill" : false
						},
						"grid" : {
							"circular" : true,
							"minorHorizontalLines" : true,
							"tickColor" : "#999999"
						},
						"xaxis" : {
						},
						"yaxis" : {
							"min" : 0,
							"minorTickFreq" : 2
						},
						"legend" : {
							position : "nw",
							backgroundColor : "#D2E8FF"
						}
					};
					break;
				case "BUBBLE":
					base = {
						"HtmlText" : false,
						"bubbles" : {
							"show" : true
						},
						"xaxis" : {
							"min" : 0
						},
						"yaxis" : {
							"min" : 0
						},
						"legend" : {
							position : "nw",
							backgroundColor : "#D2E8FF"
						}
					};
					break;
			}
			if (chart.labels && chart.labels.length) {
				var ticks = [];
				var len = chart.data.length + 1;
				for (var i=0; i<chart.labels.length; i++) {
					var n = i+1;
					if (type == "BAR" && option.bars.stacked == false) {
						n = (i * len) + (len / 2);
					}
					var tick = [n, chart.labels[i]];
					ticks.push(tick);
				}
				if (horizontal) {
					base.yaxis.ticks = ticks;
				} else {
					base.xaxis.ticks = ticks;
				}
			}
			return $.extend(true, base, option);
		}
		var chartData = chart.data;
		var chartOption = buildChartOption(chart);
		Flotr.draw($(this)[0], chartData, chartOption);
	}
})(jQuery);