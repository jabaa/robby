(function(){
    "use strict";
    var canvas;
    var context;
    var container;
    var containerSize;
    var contextSize;
    var width = 300;
    var height = 300;
    var blockSize;
    var position;
    var direction;
    var buttons;
    var button1;
    var button2;
    var timeout;
    var timeoutStep = 100;
    var timeoutList = [];
    var editor;
    var codeMirror;
    var codeMirrorJshint;
    var map;

    function createId(){
        var ID = "Robby";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ ) {
            ID += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        while(document.getElementById(ID) !== null){
            ID += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return ID;
    }

    function clearBoard(){
        context.fillStyle = "white";
        context.color = "black";
        context.fillRect(0, 0 , contextSize.width, contextSize.height)
    }

    function drawBorder(){
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(0,contextSize.height);
        context.lineTo(contextSize.width, contextSize.height);
        context.lineTo(contextSize.width, 0);
        context.lineTo(0, 0);
        context.stroke();
    }

    function drawField(){
        for(var i = 0; i < map.size[0]; i++){
            context.beginPath();
            context.lineWidth = 1;
            context.moveTo(i * blockSize[1],0);
            context.lineTo(i * blockSize[1],contextSize.height);
            context.stroke();
        }
        for(i = 0; i < map.size[1]; i++){
            context.beginPath();
            context.lineWidth = 1;
            context.moveTo(0, i * blockSize[0]);
            context.lineTo(contextSize.width, i * blockSize[0]);
            context.stroke();
        }
        for(var i = 0; i < map.size[0]; i++){
            for(var j = 0; j < map.size[1]; j++){
                switch(map.field[i][j]){
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                }
            }
        }
    }

    function drawRobby(){
        context.beginPath();
        context.fillStyle = "#66FFFF";
        context.moveTo((position[0] + 0.5) * blockSize[1] + (-0.4) * blockSize[1], (position[1] + 0.5) * blockSize[0] + (-0.4) * blockSize[0]);
        context.lineTo((position[0] + 0.5) * blockSize[1] + 0.4 * blockSize[1], (position[1] + 0.5) * blockSize[0] + (-0.4) * blockSize[0]);
        context.lineTo((position[0] + 0.5) * blockSize[1] + 0.4 * blockSize[1], (position[1] + 0.5) * blockSize[0] + 0.4 * blockSize[0]);
        context.lineTo((position[0] + 0.5) * blockSize[1] + (-0.4) * blockSize[1], (position[1] + 0.5) * blockSize[0] + 0.4 * blockSize[0]);
        context.lineTo((position[0] + 0.5) * blockSize[1] + (-0.4) * blockSize[1], (position[1] + 0.5) * blockSize[0] + (-0.4) * blockSize[0]);
        context.stroke();
        context.fill();
        context.beginPath();
        context.fillStyle = "yellow";
        context.moveTo((position[0] + 0.5) * blockSize[1] + (-0.4 * (direction[0] + direction[1])) * blockSize[1], (position[1] + 0.5) * blockSize[0] + (-0.4 * (direction[0] + direction[1])) * blockSize[0]);
        context.lineTo((position[0] + 0.5) * blockSize[1] + (0.4 * direction[0]) * blockSize[1], (position[1] + 0.5) * blockSize[0] + (0.4 * direction[1]) * blockSize[0]);
        context.lineTo((position[0] + 0.5) * blockSize[1] + (-0.4 * (direction[0] - direction[1])) * blockSize[1], (position[1] + 0.5) * blockSize[0] + (0.4 * (direction[0] - direction[1])) * blockSize[0]);
        context.stroke();
        context.fill();
    }

    function drawBoard(){
        clearBoard();
        drawBorder();
        drawField();
        drawRobby();
    }

    function initBoard(){
        position = map.position;
        direction = map.direction;
        resize();
    }

    function jshint(code){
        if(JSHINT(code)){
            return "No errors";
        }else{
            var message = "";
            for (var i = 0; i < JSHINT.errors.length; i++) {
                var err = JSHINT.errors[i];
                if(err !== null){
                    message += "Line " + err.line + ", column " + err.character + ":\n\t " + err.reason  + "\n";
                }
            };
            return message.substring(0,message.length - 2);
        }
    }

    function resize(){
        containerSize = {width: container.clientWidth, height: container.clientHeight};
        canvas.width = Math.floor((containerSize.height - buttons.clientHeight) / 2);
        canvas.height = Math.floor((containerSize.height - buttons.clientHeight) / 2);
        canvas.style.width = Math.floor((containerSize.height - buttons.clientHeight) / 2) + "px";
        canvas.style.height = Math.floor((containerSize.height - buttons.clientHeight) / 2) + "px";
        contextSize = {height: Math.floor(context.canvas.clientHeight), width: Math.floor(context.canvas.clientWidth)};
        button1.style.width = width/2 + "px";
        button2.style.width = width/2 + "px";
        editor.style.height = (containerSize.height - buttons.clientHeight) / 2 + "px";
        editor.children[0].style.height = ((containerSize.height - buttons.clientHeight) / 2) + "px";
        codeMirror.refresh();
        editor.children[1].style.height = ((containerSize.height - buttons.clientHeight) / 2) + "px";
        blockSize = [contextSize.height/map.size[0], contextSize.width/map.size[1]];
        drawBoard();
    }

    function init(containerId){
        container = document.getElementById(containerId);
        container.innerHTML = "<div><canvas></canvas></div><div><input type='button' value='Run'><input type='button' value='Stop'></div><div></div>";
        container.style.height = "100vh";
        window.onresize = resize;
        containerSize = {width: container.clientWidth, height: container.clientHeight};
        canvas = container.children[0].children[0];
        canvas.style.display = "block";
        canvas.style.margin = "auto";
        context = canvas.getContext("2d");
        buttons = container.children[1];
        buttons.style.textAlign = "center";
        button1 = buttons.children[0];
        button1.onclick = function(){
            button2.onclick();
            for(var i = 0; i < timeoutList.length; i++){
                clearTimeout(timeoutList[i]);
            }
            timeout = timeoutStep;
            timeoutList = [];
            eval(codeMirror.doc.getValue());
        };
        button2 = buttons.children[1];
        button2.onclick = function(){
            for(var i = 0; i < timeoutList.length; i++){
                clearTimeout(timeoutList[i]);
            }
            initBoard();
        };
        editor = container.children[2];
        codeMirror = CodeMirror(editor, {
            value: "var step = function(steps, times){\n\tfor(var k = 0; k < times; k++){\n\t\tfor(var i = 0; i < steps; i++){\n\t\t\trobby.step();\n\t\t}\n\t\trobby.turnLeft();\n\t}\n};\n\nstep(4,2);\nstep(8,3);\nstep(4,2);\nrobby.turnLeft();",
            mode: "javascript",
            lineNumbers: true,
            indentUnit: 4
        });
        codeMirror.on("change", function(){;
                codeMirrorJshint.doc.setValue(jshint(codeMirror.doc.getValue()));
        });
        codeMirrorJshint = CodeMirror(editor, {
            value: jshint(codeMirror.doc.getValue()),
            readOnly: "nocursor"
        });
        editor.children[0].style.float = "left";
        editor.children[0].style.width = "66.66666667%";
        editor.children[0].style.boxSizing = "border-box";
        codeMirror.refresh();
        editor.children[1].style.width = "33.33333333%";
        editor.children[1].style.boxSizing = "border-box";
        map = maps[0];
        initBoard();
    }

    function Robby(containerId){
        this.step = function(){
            timeoutList.push(setTimeout(function(){
                position[0] += direction[0];
                position[1] += direction[1];
                drawBoard();
            },timeout));
            timeout += timeoutStep;
        };
        this.turnLeft = function(){
            timeoutList.push(setTimeout(function(){
                var temp = direction[1];
                direction[1] = -direction[0];
                direction[0] = temp;
                drawBoard();
            },timeout));
            timeout += timeoutStep;
        };
        this.turnRight = function(){
            timeoutList.push(setTimeout(function(){
                var temp = direction[1];
                direction[1] = direction[0];
                direction[0] = -temp;
                drawBoard();
            },timeout));
            timeout += timeoutStep;
        };
        init(containerId);
        return this;
    }

    window["Robby"] = Robby || {};

    var maps = [
    {
        name: "Spielplatz",
        position: [4,4],
        direction: [1,0],
        size: [9,9],
        field: [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ]
    },
    {
        name: "Exit",
        position: [4,4],
        direction: [1,0],
        size: [9,9],
        field: [
            [0,0,0,0,0,0,0,0,2],
            [0,1,1,1,1,1,1,1,1],
            [0,1,0,0,0,0,0,0,0],
            [0,1,0,1,1,1,1,1,0],
            [0,1,0,1,0,0,0,0,0],
            [0,1,0,1,1,1,1,1,1],
            [0,1,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0]
        ]
    }
]
}());
