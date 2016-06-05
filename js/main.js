$(function () {
    //http://akiyukipc.com/web/584/#1canvasHTML
    sizing();
    var _touch = ('ontouchstart' in document) ? 'touchstart' : 'click';
    $(window).resize(function() {});
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var mouseX1,mouseX,mouseY,mouseY1;

    var brushType = "line";
    var draw = false;
    
    var $stampSize = $("#stamp-size");
    var $lineSize = $("#line-size");
    var canvas_line = document.getElementById("canvas-line");
    var ctx_line = canvas_line.getContext("2d");
    var canvas_straight_line = document.getElementById("canvas-straight-line");
    var ctx_straight_line = canvas_straight_line.getContext("2d");
    var stampsize=96;
    var $stamp = $("#twitterStamp");
    var text = {text:"text",color:"#000000",size:12};
    var line = {size:6,color:"#000000"};
    var $btnUndo = $("#btnUndo");
    var $canvas_size = $(".canvas-size");
    var $canvas_width = $("#canvas-width");
    var $canvas_height = $("#canvas-height");
    var undoImage = {
        img :[],
        save : function(){
            this.img.push(ctx.getImageData(0, 0,canvas.width,canvas.height));
            if(this.img.length > 20){
                this.img.shift();
            }
            this.check();
        },
        undo : function(){
            var img = this.img.pop()
            ctx.putImageData(img,0,0);
            this.mouse.img = img;
            this.check();
        },
        mouse:{
            save:function(){
                this.img = ctx.getImageData(0, 0,1920,1920);
            },
            undo:function(){
                if(this.img != null){
                    ctx.putImageData(this.img,0,0);
                }
            },
            img: null
        },
        check: function(){
            $btnUndo.prop("disabled",this.img.length>0?false:true);
        }
    };
    undoImage.check();
    undoImage.mouse.save();
    

    
    //mouse 
    canvas.addEventListener("mousemove",function(e) {
        var rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if(draw === true) {
            if(brushType=="line" || brushType == "straight-line"){
                ctx.beginPath();
                ctx.lineWidth = line.size;
                ctx.strokeStyle = line.color;
                ctx.moveTo(mouseX1,mouseY1);
                ctx.lineTo(mouseX,mouseY);
                ctx.lineCap = "round";
                if(brushType=="line"){
                    ctx.stroke();
                    mouseX1 = mouseX;
                    mouseY1 = mouseY;
                }else{
                    undoImage.mouse.undo();
                    ctx.stroke();
                }
            }
            
        }else if(draw == false){
                undoImage.mouse.undo();
                if(brushType == "stamp"){
                    var img = new Image();
                    img.src = $stamp.attr("src");
                    ctx.drawImage(img,mouseX,mouseY,stampsize,stampsize/img.width*img.height);
                }else if(brushType == "text"){
                    ctx.font = text.size ;
                    ctx.fillStyle = text.color;
                    ctx.fillText(text.text,mouseX,mouseY);
                }else if(brushType == "line" || brushType == "straight-line"){
                    ctx.beginPath();
                    ctx.fillStyle = line.color;
                    ctx.arc(mouseX, mouseY, line.size/2, 0, Math.PI*2, false);
                    ctx.fill();
                }
        }
    });
    canvas.addEventListener("mousedown",function(e) {
        draw = true;
        mouseX1 = mouseX;
        mouseY1 = mouseY;
        undoImage.mouse.undo();
        undoImage.save();
        if(brushType=="line" || brushType=="straight-line"){
            ctx.beginPath();
            ctx.fillStyle = line.color;
            ctx.arc(mouseX, mouseY, line.size/2, 0, Math.PI*2, false);
            ctx.fill();
        }
    });
    canvas.addEventListener("mouseup", function(e){
        draw = false;

        var rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        if(brushType == "stamp"){
            var img = new Image();
            img.src = $stamp.attr("src");
            ctx.drawImage(img,mouseX,mouseY,stampsize,stampsize/img.width*img.height);
        }else if(brushType == "text"){
            ctx.font = text.size ;
            ctx.fillStyle = text.color;
            ctx.fillText(text.text,mouseX,mouseY);
        }else if(brushType == "straight-line"){
            undoImage.mouse.undo();
            ctx.beginPath();
            ctx.lineWidth = line.size;
            ctx.strokeStyle = line.color;
            ctx.moveTo(mouseX1,mouseY1);
            ctx.lineTo(mouseX,mouseY);
            ctx.lineCap = "round";
            ctx.stroke();
        }
        undoImage.mouse.save();
    });
    
    //touch
    var finger=new Array;
	for(var i=0;i<10;i++){
		finger[i]={
			x:0,y:0,x1:0,y1:0,
			color:"rgb(0,0,0)"
		};
	}

	//タッチした瞬間座標を取得
	canvas.addEventListener("touchstart",function(e){
		e.preventDefault();
		var rect = e.target.getBoundingClientRect();

		undoImage = ctx.getImageData(0, 0,canvas.width,canvas.height);
		for(var i=0;i<finger.length;i++){
			finger[i].x1 = e.touches[i].clientX-rect.left;
			finger[i].y1 = e.touches[i].clientY-rect.top;
            if(brushType == "stamp"){
                var img = new Image();
                img.src = $stamp.attr("src");
                ctx.drawImage(img,finger[i].x1,finger[i].y1,stampsize,stampsize/img.width*img.height);
            }else if(brushType == "text"){
                ctx.font = text.size ;
                ctx.fillStyle = text.color;
                ctx.fillText(text.text,finger[i].x1,finger[i].y1);
            }
		}
	});

	//タッチして動き出したら描画
	canvas.addEventListener("touchmove",function(e){
		e.preventDefault();
		var rect = e.target.getBoundingClientRect();
		for(var i=0;i<finger.length;i++){
			finger[i].x = e.touches[i].clientX-rect.left;
			finger[i].y = e.touches[i].clientY-rect.top;
            if(brushType=="line"){
                ctx.beginPath();
                ctx.moveTo(finger[i].x1,finger[i].y1);
                ctx.lineTo(finger[i].x,finger[i].y);
                ctx.lineWidth = line.size;
                ctx.strokeStyle = line.color;
                ctx.lineCap="round";
                ctx.stroke();
            }
			finger[i].x1=finger[i].x;
			finger[i].y1=finger[i].y;
			
		}
        
	});
    
    $("#btnUndo").on(_touch,function(e){
        undoImage.undo();
    });
    
    
    
    
    
    $("#twitterGet").on(_touch,function(e){
        var url = "cd.php?tw=" + $("#twitterID").val();
        $stamp.attr("src",url);
    });
    var stampRangeChangeHandler = function(){
        stampsize = $stampSize.val();
        $stamp.width(stampsize);
        $stamp.height(stampsize);
    };
    stampRangeChangeHandler();
    $stampSize.on("input",stampRangeChangeHandler);
    $stampSize.change(stampRangeChangeHandler);
    
    
    var lineRangeChangeHandler = function(){
        line.size = $lineSize.val();
        
        ctx_line.clearRect(0,0,64,64);
        ctx_line.beginPath();
        ctx_line.strokeStyle = line.color;
        ctx_line.lineWidth = line.size;

        ctx_line.arc(20, 32, 12, 0, Math.PI, false);
        ctx_line.stroke();
        ctx_line.beginPath();
        ctx_line.lineCap="round";
        ctx_line.arc(48, 32, 16, Math.PI, 1.5*Math.PI, false);
        ctx_line.stroke();
        
        ctx_straight_line.clearRect(0,0,64,64);
        ctx_straight_line.lineWidth = line.size;
        ctx_straight_line.strokeStyle = line.color;
        ctx_straight_line.lineCap="round";
        ctx_straight_line.beginPath();
        ctx_straight_line.moveTo(16,32);
        ctx_straight_line.lineTo(48,16);
        ctx_straight_line.stroke();
        ctx_straight_line.moveTo(48,16);
        ctx_straight_line.lineTo(48,48);
        ctx_straight_line.stroke();
    };
    lineRangeChangeHandler();
    $lineSize.on("input",lineRangeChangeHandler);
    $lineSize.change(lineRangeChangeHandler);
    $("#line-color").change(function(e){
        line.color = "#"+e.target.value;
        lineRangeChangeHandler();
    });

    $text = $("#text");
    $textSize = $("#text-size");
    $textColor = $("#text-color");
    $textPreview = $("#text-preview")
    var textChangeHandler = function(){
        text.text = $text.val();
        text.size = $textSize.val()+ "pt 'cursive'";
        text.color = "#"+$textColor.val();
        $textPreview.css("font",text.size);
        $textPreview.text(text.text);
        $textPreview.css("color",text.color);
    }
    $textSize.change(textChangeHandler);
    $textColor.change(textChangeHandler);
    $text.change(textChangeHandler);
    $text.on("keyup",textChangeHandler);
    textChangeHandler();
    
    
  $("#uploadImg").change(function(evt) {
    var file = this.files[0];
    if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;
    var image = new Image();
    var reader = new FileReader();
    reader.onload = function(evt) {
      image.onload = function() {
        //ctx.drawImage(image, 0, 0);
        $stamp.attr("src",image.src);
        $stampSize[0].value = image.width;
        stampsize = image.width;
      }
      image.src = evt.target.result;
    }
    reader.readAsDataURL(file);
  });
    
    
    
    $("#download").on(_touch,function(ev){
//http://qiita.com/0829/items/a8c98c8f53b2e821ac94
//http://jsdo.it/Yukisuke/c1VD
        undoImage.mouse.undo();
        var base64 = canvas.toDataURL('image/png');
        var bin = atob(base64.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
       var blob = new Blob([buffer.buffer], {
            type: "image/png"
        });
        
        var url = (window.URL || window.webkitURL);
        var data = url.createObjectURL(blob);
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        a.href = data;
        a.download = "download.png";   
        a.dispatchEvent(e);

    });
    var $reset_transparent = $("#reset-transparent")
    $reset_transparent.change(function(e){
        if($(this).prop("checked")){
            $("#reset-color").prop("disabled",true);
        }else{
            $("#reset-color").prop("disabled",false);
        }
    });
    $("#btnReset").on(_touch,function(e){
        ctx.clearRect(0,0,1920,1920);
        if(!($reset_transparent.prop("checked"))){
            ctx.fillStyle = "#" + $("#reset-color").val();
            ctx.fillRect(0,0,1920,1920);
        }
        
        undoImage.save();
        undoImage.mouse.save();
    });
    
    var canvasSizeChangeHandler = function(){
        var w = $canvas_width.val();
        var h = $canvas_height.val();
        $(canvas).attr({height:h});
	    $(canvas).attr({width:w});
        undoImage.mouse.undo();
    }
    $canvas_size.change(canvasSizeChangeHandler);
    
    $(".brushBtn").on(_touch,function(e){

        brushType = this.getAttribute("brush");
    });
    
    
/*
 * Keyboard Shortcut
 */
    $(document).on("keydown",canvas,function(e){
        if(e.ctrlKey) {
            if(e.keyCode == 90){
                undoImage.undo();
            }
        }
    });

    
    
    
    function sizing(){
        var h = $("#canvas-wrapper").height()*4;
        var w = $("#canvas-wrapper").width()-4;
        var ch = document.getElementById("canvas-height");
        var cw = document.getElementById("canvas-width");
        ch.value = h;
        cw.value = w;
        $("#canvas").attr({height:h});
        $("#canvas").attr({width:w});
    }

});

