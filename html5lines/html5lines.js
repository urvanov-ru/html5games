"use strict";
(function () {
    document.addEventListener("DOMContentLoaded", html5linesInit);


    function Point(x, y) {
        this.x = x;
        this.y = y;
    }



    function LinesEngine(w, h, ballsType) {
        /**
         * Minimum balls count in line.
         */
        this.lineMinBalls = 5;

        this.nextBalls = [];
        this.emptyPlacesCount = 0;
        this.playerScore = 0;

        this.width = w;
        this.height = h;
        this.ballsTypeCount = ballsType;
        this.balls = new Array(this.width);
        for (var n = 0; n < this.width; n++) {
            this.balls[n] = new Array(this.height);
            for (var m = 0; m < this.height; m++) {
                this.balls[n][m] = -1;
            }
        }
        
        this.nextBalls = new Array(3);
        for (var n = 0; n < 3; n++) {this.nextBalls[n] = 0;}

        
        this.emptyPlacesCount = this.width * this.height;
    }
    LinesEngine.prototype.LINE_TYPE_HORIZONTAL = 0;
    LinesEngine.prototype.LINE_TYPE_VERTICAL = 1;
    LinesEngine.prototype.LINE_TYPE_NORTH_WEST_DIAGONAL = 2;
    LinesEngine.prototype.LINE_TYPE_SOUTH_EAST_DIAGONAL = 3;

    LinesEngine.prototype.generateNextBalls = function () {
        for (var n = 0; n < this.nextBalls.length; n++) {
            this.nextBalls[n] = Math.floor(Math.random() * this.ballsTypeCount);
        }
        return this.nextBalls;
    }


    LinesEngine.prototype.placeNewBalls = function() {
        if (this.emptyPlacesCount <= 0) {
            return null;
        }
        var emptyPlaces = new Array(this.emptyPlacesCount);
        var nCurrent = 0;
        for (var n = 0; n < this.width; n++) {
            for (var m = 0; m < this.height; m++) {
                if (this.balls[n][m] == -1) {
                    emptyPlaces[nCurrent] = new Point(n, m);
                    nCurrent++;
                }
            }
        }
        if (nCurrent != this.emptyPlacesCount) {
            throw new Error("nCurrent!=nEmptyPlacesCount");
        }

        var resultSize = Math.min(this.nextBalls.length, emptyPlaces.length);
        var result = new Array(resultSize);
        var m = 0;
        for (var n = 0; n < resultSize; n++) {
            var rand = Math.floor(Math.random() * this.emptyPlacesCount);
            var point = emptyPlaces[rand];
            var ballType = this.nextBalls[m];
            m++;
            this.balls[point.x][point.y] = ballType;
            this.emptyPlacesCount--;
            result[n] = point;
            // Fixing array.
            for (var k = rand; k < this.emptyPlacesCount; k++) {
                emptyPlaces[k] = emptyPlaces[k + 1];
            }
        }
        return result;
    }

    LinesEngine.prototype.isPlayerLose = function() {
        if (this.emptyPlacesCount == 0) {
            return true;
        }
        return false;
    }

    LinesEngine.prototype.getBalls = function() {
        return this.balls;
    }



    LinesEngine.prototype.checkLineForPosition = function(x, y) {
            var ballType = this.balls[x][y];
            var maxBallsLineType = LinesEngine.prototype.LINE_TYPE_HORIZONTAL;
            var maxBalls = 1;

            var horizontalBalls = -1;

            var curX = x;
            var curY = y;

            while (this.balls[curX][curY] == ballType) {
                horizontalBalls++;
                curX--;
                if (curX < 0)
                    break;
            }

            curX = x;
            while (this.balls[curX][curY] == ballType) {
                horizontalBalls++;
                curX++;
                if (curX >= this.width)
                    break;
            }

            maxBalls = horizontalBalls;

            var verticalBalls = -1;

            curX = x;
            curY = y;

            while (this.balls[curX][curY] == ballType) {
                verticalBalls++;
                curY--;
                if (curY < 0)
                    break;
            }

            curY = y;

            while (this.balls[curX][curY] == ballType) {
                verticalBalls++;
                curY++;
                if (curY >= this.width)
                    break;
            }

            if (verticalBalls > horizontalBalls) {
                maxBallsLineType = LinesEngine.prototype.LINE_TYPE_VERTICAL;
                maxBalls = verticalBalls;
            }

            var northWestDiagonalBalls = -1;

            curX = x;
            curY = y;

            while (this.balls[curX][curY] == ballType) {
                northWestDiagonalBalls++;
                curX--;
                curY--;
                if ((curX < 0) || (curY < 0))
                    break;
            }

            curX = x;
            curY = y;

            while (this.balls[curX][curY] == ballType) {
                northWestDiagonalBalls++;
                curX++;
                curY++;
                if ((curX >= this.width) || (curY >= this.height))
                    break;
            }

            if (northWestDiagonalBalls > maxBalls) {
                maxBallsLineType = LinesEngine.prototype.LINE_TYPE_NORTH_WEST_DIAGONAL;
                maxBalls = northWestDiagonalBalls;
            }

            var southEastDiagonalBalls = -1;

            curX = x;
            curY = y;

            while (this.balls[curX][curY] == ballType) {
                southEastDiagonalBalls++;
                curX++;
                curY--;
                if ((curX >= this.width) || (curY < 0))
                    break;
            }

            curX = x;
            curY = y;

            while (this.balls[curX][curY] == ballType) {
                southEastDiagonalBalls++;
                curX--;
                curY++;
                if ((curX < 0) || (curY >= this.width))
                    break;
            }

            if (southEastDiagonalBalls > maxBalls) {
                maxBallsLineType = LinesEngine.prototype.LINE_TYPE_SOUTH_EAST_DIAGONAL;
                maxBalls = southEastDiagonalBalls;
            }
            if (maxBalls >= this.lineMinBalls) {
                var result = new Array(maxBalls);
                var startSm = 0;
                switch (maxBallsLineType) {
                case LinesEngine.prototype.LINE_TYPE_HORIZONTAL:
                    if (x > 0) {
                        while (this.balls[x - startSm - 1][y] == ballType) {
                            startSm++;
                            if (x - startSm - 1 < 0)
                                break;
                        }
                    }
                    for (var n = 0; n < maxBalls; n++) {
                        result[n] = new Point(x - startSm + n, y);
                    }
                    break;
                case LinesEngine.prototype.LINE_TYPE_VERTICAL:
                    if (y > 0) {
                        while (this.balls[x][y - startSm - 1] == ballType) {
                            startSm++;
                            if (y - startSm - 1 < 0)
                                break;
                        }
                    }
                    for (var n = 0; n < maxBalls; n++) {
                        result[n] = new Point(x, y - startSm + n);
                    }
                    break;
                case LinesEngine.prototype.LINE_TYPE_NORTH_WEST_DIAGONAL:
                    if ((x > 0) && (y > 0)) {
                        while (this.balls[x - startSm - 1][y - startSm - 1] == ballType) {
                            startSm++;
                            if ((x - startSm - 1 < 0)
                                    || (y - startSm - 1 < 0))
                                break;
                        }
                    }
                    for (var n = 0; n < maxBalls; n++) {
                        result[n] = new Point(x - startSm + n, y - startSm
                                + n);
                    }
                    break;
                case LinesEngine.prototype.LINE_TYPE_SOUTH_EAST_DIAGONAL:
                    if ((x > 0) && (y < this.height - 1)) {
                        while (this.balls[x - startSm - 1][y + startSm + 1] == ballType) {
                            startSm++;
                            if ((x - startSm - 1 < 0)
                                    || (y + startSm + 1 >= this.height))
                                break;
                        }
                    }
                    for (var n = 0; n < maxBalls; n++) {
                        result[n] = new Point(x - startSm + n, y + startSm
                                - n);
                    }
                    break;
                }
                for (var n = 0; n < result.length; n++) {
                    this.balls[result[n].x][result[n].y] = -1;
                }
                this.playerScore += result.length;
                this.emptyPlacesCount += result.length;
                return result;
            } else {
                return null;
            }
        }



    LinesEngine.prototype.getPlayerScore = function() {
        return this.playerScore;
    }


    LinesEngine.prototype.setLineMinBalls = function(newLineMinBalls) {
        this.lineMinBalls = newLineMinBalls;
    }

    LinesEngine.prototype.getLineMinBalls = function() {
        return this.lineMinBalls;
    }







    function PathPoint(x,y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }

    PathPoint.prototype.clone = function() {
        return new PathPoint(this.x, this.y, this.state);
    }



    function NoPathError() {
    }
    NoPathError.prototype.__proto__ = Error.prototype;



                        





    function PathFinder () {	
    }


       /**             

         * a - array where 0 - empty cell, 1 snag cell.
         * p_nStartX - start position of unit.
         * p_nStartY - start position of unit.
         * p_nTargetX - end position of unit.
         * p_nTargetY - end position of unit.
         * Returns path.
         * Or NoPathError if there no path.
         */
    PathFinder.prototype.findPath = function(a,
            p_nStartX, p_nStartY,
            p_nTargetX, p_nTargetY) {
        if (a[p_nTargetX][p_nTargetY]==1) {
            throw new NoPathError();
        }
        var lstCurr=[];
        var lstBest =null;
        var nCurrSteps=0;
        var nBestSteps=999999999;
        var curPos=new PathPoint(p_nStartX,p_nStartY,0);
        a[p_nStartX][p_nStartY]=2;
        var bEnd=false;
        lstCurr.push(curPos);
        var xmax=a.length-1;
        var ymax=a[0].length-1;
        var aPriority = new Array(a.length);
        for (var n = 0; n < aPriority.length; n++) {
            aPriority[n] = new Array(a[0].length);
            for (var m = 0; m < aPriority[n].length; m++) {
                aPriority[n][m] = new Array(5);
                for (var k = 0; k < aPriority[n][m].length; k++) aPriority[n][m][k] = 0;
            }
        }
        for (var n=0; n<aPriority.length;n++) {
            for (var m=0; m<aPriority[0].length;m++) {
                var aPriorityCase = new Array(5);
                for (var i = 0; i < aPriorityCase.length; i++) aPriorityCase[i] = 0;
                var nPriorityXDir = sign(p_nTargetX-n);
                var nPriorityYDir = sign(p_nTargetY-m);
                if (nPriorityXDir>0) {
                    aPriorityCase[0] = 1;
                    if (nPriorityYDir>0) {
                        aPriorityCase[1] = 2;
                        aPriorityCase[2] = 3;
                        aPriorityCase[3] = 0;
                    } else {
                        aPriorityCase[1] = 0;
                        aPriorityCase[2] = 3;
                        aPriorityCase[3] = 2;
                    }
                } else if (nPriorityXDir<0) {
                    aPriorityCase[0] = 3;
                    if (nPriorityYDir > 0) {
                        aPriorityCase[1] = 2;
                        aPriorityCase[2] = 1;
                        aPriorityCase[3] = 0;
                    } else {
                        aPriorityCase[1] = 0;
                        aPriorityCase[2] = 1;
                        aPriorityCase[3] = 2;
                    }
                } else {
                    if (nPriorityYDir>0) {
                        aPriorityCase[0] = 2;
                        aPriorityCase[1] = 1;
                        aPriorityCase[2] = 0;
                    } else {
                        aPriorityCase[0] = 0;
                        aPriorityCase[1] = 1;
                        aPriorityCase[2] = 2;
                    }
                    aPriorityCase[3] = 3;
                }
                aPriorityCase[4] =4;
                aPriority[n][m]=aPriorityCase;
            }
        }
        while (!bEnd) {
            var nx=curPos.x;
            var ny=curPos.y;

            if ((nx==p_nTargetX) && (ny==p_nTargetY)) {
                if (nBestSteps>nCurrSteps) {
                    nBestSteps = nCurrSteps;
                    lstBest=[];
                    for (var j = 0; j < lstCurr.length; j++) {
                        var p=lstCurr[j];
                        lstBest.push(p.clone());
                    }
                 }
            }
            if (nCurrSteps>=nBestSteps) {
                curPos.state = 4;
            }
            switch (aPriority[curPos.x][curPos.y][curPos.state]) {
            case 0:
                if (ny==0) {
                    curPos.state++;
                } else {
                    ny--;
                    if (a[nx][ny]==0) {
                        curPos = new PathPoint(nx,ny,0);
                        lstCurr.push(curPos);
                        a[nx][ny]=2;
                        nCurrSteps++;
                    } else {
                        curPos.state++;
                    }
                }
                break;
            case 1:
                if (nx==xmax) {
                    curPos.state++;
                } else {
                    nx++;
                    if (a[nx][ny]==0) {
                    curPos = new PathPoint(nx,ny,0);
                    lstCurr.push(curPos);
                    a[nx][ny]=2;
                    nCurrSteps++;
                } else {
                    curPos.state++;
                }
            }
            break;
            case 2:
                if (ny==ymax) {
                    curPos.state++;
                } else {
                    ny++;
                    if (a[nx][ny]==0) {
                        curPos = new PathPoint(nx,ny,0);
                        lstCurr.push(curPos);
                        a[nx][ny]=2;
                        nCurrSteps++;
                    } else {
                        curPos.state++;
                    }
                }
                break;
            case 3:
                if (nx==0) {
                    curPos.state++;
                } else {
                    nx--;
                    if (a[nx][ny]==0) {
                        curPos = new PathPoint(nx,ny,0);
                        lstCurr.push(curPos);
                        a[nx][ny]=2;
                        nCurrSteps++;
                    } else {
                        curPos.state++;
                    }
                }
                break;
            case 4:
                a[nx][ny]=0;
                for (var n = 0; n < lstCurr.length; n++) {
                    if (lstCurr[n].x == curPos.x && lstCurr[n].y == curPos.y) {
                        lstCurr.splice(n, 1); 
                        break;
                    }
                }
                
                nCurrSteps--;
                var lstCurrIndex = lstCurr.length - 1;
                if (lstCurrIndex >=0 && lstCurrIndex < lstCurr.length) {
                    curPos=lstCurr[lstCurrIndex];
                    curPos.state++;
                } else {
                    if (lstBest == null) throw new NoPathError();
                    return lstBest;
                }
                break;
            }
        }
        return lstBest;
    }


    function Effect(x, y, xspeed, yspeed, move) {
        if (move == undefined) move = true;
        this.x = x;
        this.y = y;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.frame = 0;
        this.needDestroy = false;
        this.move = move;
        this.createdAt = new Date().getTime();
        if (this.xspeed == null || this.yspeed == null) {
            this.xspeed = -20 + Math.floor(Math.random() * 40);
            this.yspeed = -20 + Math.floor(Math.random() * 40);
        }
    }

    Effect.prototype.G = 3;

    Effect.prototype.EFFECT_FRAMES_COUNT = 4;
    Effect.prototype.LIFE_MILLISECONDS = Effect.prototype.EFFECT_FRAMES_COUNT * 250;
    Effect.prototype.step = function() {
        if (this.move) {
            if (this.yspeed == 0) {
                this.yspeed = 0.1;
            }
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.yspeed += Effect.prototype.G;
        }
        if (this.frame < Effect.prototype.EFFECT_FRAMES_COUNT - 1)  {
            this.frame = Math.floor((new Date().getTime() - this.createdAt) / (Effect.prototype.LIFE_MILLISECONDS / Effect.prototype.EFFECT_FRAMES_COUNT));
            if (this.frame >= Effect.prototype.EFFECT_FRAMES_COUNT) this.frame = Effect.prototype.EFFECT_FRAMES_COUNT - 1;
        }
        if ((new Date().getTime() - this.createdAt) > Effect.prototype.LIFE_MILLISECONDS) this.needDestroy = true;
    }


    var BALLS_COUNT = 4;
    var BALL_FRAMES_COUNT = 3;
    var images = new Array(BALLS_COUNT);
    var effectImages = new Array(4);
    var effects = [];


    var MAX_IMAGE_LOAD_COUNTER = 18;
    var imageLoadCounter = 0;
    var SITUATION_INITIALIZATION = 0;
    var SITUATION_GAME = 1;
    var SITUATION_MOVE = 2;
    var SITUATION_LOSE = 3;
    var situation = SITUATION_INITIALIZATION;
    var TILE_WIDTH = 32;
    var TILE_HEIGHT = 32;
    var WIDTH_IN_TILES = 10;
    var HEIGHT_IN_TILES = 10;
    var selectedBallPosition = null;
    var selectedBallPath = null;
    var highScore = 0;
    var nextBalls = [];
    var DEBUG = false;
    var AUDIO_COUNT = 2;
    var AUDIO_CLICK = 0;
    var AUDIO_COLLECT = 1;
    var audio = new Array(AUDIO_COUNT);
    var isAudioOn = true;


    var linesEngine = null;

    function html5linesInit() {

        
        for(var ballIndex = 0; ballIndex < BALLS_COUNT; ballIndex++) {
            var frames = new Array(BALL_FRAMES_COUNT);
            for (var frameIndex = 0; frameIndex < BALL_FRAMES_COUNT; frameIndex++) {
                frames[frameIndex] = new Image();
                var imageSource = "images/ball"+ twoDigits(ballIndex) + "p" + twoDigits(frameIndex)+".png";
                log("imageSource="+imageSource);
                frames[frameIndex].src = imageSource;
                frames[frameIndex].onload = onImageLoad;
            }
            images[ballIndex] = frames;
        }
        
        for (var n = 0; n < Effect.prototype.EFFECT_FRAMES_COUNT; n++) { 
            effectImages[n] = new Image();
            var imageSource = "images/effect/effect"+twoDigits(n)+".png";
            log("imageSource="+imageSource);
            effectImages[n].src = imageSource;
            effectImages[n].onload = onImageLoad;
        }
        audio[AUDIO_CLICK] = new Audio("audio/click.mp3");
        audio[AUDIO_CLICK].loadeddata = onImageLoad;
        audio[AUDIO_COLLECT] = new Audio("audio/collect.mp3");
        audio[AUDIO_COLLECT].loadeddata = onImageLoad;
        //requestAnimationFrame(onPaint);
        var canvas = document.getElementById("html5linesCanvas");
        canvas.addEventListener("mousedown", mouseClick);
        canvas.addEventListener("mousemove", mouseMove);
        setInterval(onTimer, 30);
        highScore = localStorage['dxgames.html5lines.highScore'];
        log('highScore='+highScore);
        if (!highScore) highScore = 0;
        isAudioOn = localStorage['dxgames.html5lines.isAudioOn'] == "false" ? false : true;
        if (isAudioOn == null ) isAudioOn = true;
        newGame();
    }

    function onImageLoad() {
        imageLoadCounter++;
        log("progress:"+imageLoadCounter);
        if (imageLoadCounter == MAX_IMAGE_LOAD_COUNTER) {
            newGame();
        }
    }


    function onTimer() {
        switch (situation) {
        case SITUATION_GAME:
        case SITUATION_MOVE:
            if (linesEngine.isPlayerLose()) {
                situation = SITUATION_LOSE;
                if (linesEngine.getPlayerScore() > highScore) highScore = linesEngine.getPlayerScore();
                localStorage['dxgames.html5lines.highScore'] = highScore;
            }
            for (var n = 0; n < effects.length; n++) {
                effects[n].step();
                if (effects[n].x < -TILE_WIDTH || effects[n].x > WIDTH_IN_TILES * TILE_WIDTH ||
                        effects[n].y < - TILE_HEIGHT || effects[n].y > HEIGHT_IN_TILES * TILE_HEIGHT ||
                        effects[n].needDestroy) {
                    effects.splice(n, 1);
                    n--;
                    continue;
                }
            }
            
            if (selectedBallPath != null) {
                var pos = selectedBallPath.shift();
                if (pos == null) {
                    var result = linesEngine.checkLineForPosition(selectedBallPosition.x, selectedBallPosition.y);
                    if (result) {
                        createDisappearingEffect(result);
                        playAudio(AUDIO_COLLECT);
                    }
                    selectedBallPath = null;
                    selectedBallPosition = null;
                    situation = SITUATION_GAME;
                    
                    var newBalls = linesEngine.placeNewBalls();
                    for (var n = 0; n < newBalls.length; n++) {
                        var result = linesEngine.checkLineForPosition(newBalls[n].x, newBalls[n].y);
                        if (result) {
                            createDisappearingEffect(result);
                            playAudio(AUDIO_COLLECT);
                        }
                    }
                    nextBalls = linesEngine.generateNextBalls();
                } else if (pos.x != selectedBallPosition.x || pos.y != selectedBallPosition.y){
                    var balls = linesEngine.getBalls();
                    balls[pos.x][pos.y] = balls[selectedBallPosition.x][selectedBallPosition.y];
                    balls[selectedBallPosition.x][selectedBallPosition.y] = -1;
                    selectedBallPosition = new Point(pos.x, pos.y);
                    log("selectedBallPosition.x="+selectedBallPosition.x + " y="+selectedBallPosition.y);
                }
            }
            break;
        case SITUATION_LOSE:
            
        break;
        }
        onPaint();
    }

    function createDisappearingEffect(tilePositions) {
        for (var n = 0; n < tilePositions.length; n++) {
            createEffect(tilePositions[n].x, tilePositions[n].y);
        }
    }

    function createEffect(tileX, tileY) {
        effects.push(new Effect(tileX * TILE_WIDTH, tileY * TILE_HEIGHT, -TILE_WIDTH + 2* Math.random() * TILE_WIDTH, -TILE_HEIGHT + 2* Math.random() * TILE_HEIGHT, false));
    }

    function twoDigits(value) {
        var str = "00" + value;
        return str.slice(str.length - 2, str.length);
    }                             

    var paintcounter = 0;
    function onPaint() {
        //log("onPaint"+ ++paintcounter);
        var canvas = document.getElementById("html5linesCanvas");
        var ctx = canvas.getContext("2d");
        switch (situation) {
        case SITUATION_INITIALIZATION :
            ctx.fillStyle="#ffffff";
            ctx.strokeStyle="#000000";
            ctx.fillRect(0,200, 320, 10);
            ctx.fillStyle="#a0a0a0";
            ctx.fillRect(0, 200, 320 / MAX_IMAGE_LOAD_COUNTER * imageLoadCounter, 10);
            break;
        case SITUATION_GAME:
        case SITUATION_MOVE:
        case SITUATION_LOSE:
            ctx.strokeStyle="#000000";
            ctx.fillStyle="#404040";
            ctx.fillRect(0,0, TILE_WIDTH * WIDTH_IN_TILES, TILE_HEIGHT * HEIGHT_IN_TILES );
            
            ctx.fillStyle="#101010";
            ctx.fillRect(0, TILE_HEIGHT * HEIGHT_IN_TILES, TILE_WIDTH * WIDTH_IN_TILES, TILE_HEIGHT * 2);
            
            ctx.fillStyle="#404040";
            var balls = linesEngine.getBalls();
            for (var n = 0; n < balls.length; n++) {
                for (var m = 0; m < balls[n].length; m++) {
                    if (balls[n][m] >=0 ) {
                        var frame = 0;
                        if (selectedBallPosition != null && selectedBallPosition.x == n && selectedBallPosition.y == m) 
                            frame = (Math.round(new Date().getTime() / 150) % 3);
                        
                        ctx.drawImage(images[balls[n][m]][frame], n * TILE_WIDTH, m * TILE_HEIGHT);    
                             
                    }
                    else
                        ctx.fillRect(n * TILE_WIDTH, m * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                }
            }
            for (var n = 0; n < effects.length; n++) {
                ctx.drawImage(effectImages[effects[n].frame], effects[n].x, effects[n].y);
            }
            
            ctx.font="20px Courier New";
            ctx.strokeStyle="#0000ff";
            ctx.fillStyle="#ffff00";
            var scoreString = "00000000" + linesEngine.getPlayerScore();
            scoreString = scoreString.slice(scoreString.length - 8, scoreString.length);
            ctx.fillText("score:  " + scoreString, 0, TILE_HEIGHT * HEIGHT_IN_TILES + TILE_HEIGHT - 3);
            
            var scoreString = "00000000" + highScore;
            scoreString= scoreString.slice(scoreString.length - 8, scoreString.length);
            ctx.fillText("high :  " + scoreString, 0, TILE_HEIGHT * HEIGHT_IN_TILES + TILE_HEIGHT *1.5 - 3);
            

            var audioString = isAudioOn ? "sound on" : "sound off";
            ctx.fillText(audioString, 0, HEIGHT_IN_TILES * TILE_HEIGHT + TILE_HEIGHT * 2 - 3);

            ctx.fillText("next:" , TILE_WIDTH * WIDTH_IN_TILES - ctx.measureText("next:").width , TILE_HEIGHT * HEIGHT_IN_TILES + TILE_HEIGHT);
            for (var n = 0; n < nextBalls.length; n++) {
                ctx.drawImage(images[nextBalls[n]][0], TILE_WIDTH * WIDTH_IN_TILES - TILE_WIDTH * (n + 1), TILE_HEIGHT * HEIGHT_IN_TILES + TILE_HEIGHT);
            }
            if (situation == SITUATION_LOSE) {
                ctx.fillStyle="#404040";
                ctx.fillRect(10, TILE_HEIGHT * (HEIGHT_IN_TILES / 2 - 1), TILE_WIDTH * WIDTH_IN_TILES - 20, TILE_HEIGHT * 2);
                ctx.fillStyle="#ffff00";
                ctx.font="40px Courier New";
                var gameOverString ="GAME OVER";
                ctx.fillText(gameOverString, TILE_WIDTH * (WIDTH_IN_TILES / 2) - ctx.measureText(gameOverString).width / 2, TILE_HEIGHT * (HEIGHT_IN_TILES / 2));
                var yourScore = "score: " + linesEngine.getPlayerScore();
                ctx.fillText(yourScore, TILE_WIDTH * (WIDTH_IN_TILES / 2) - ctx.measureText(yourScore).width / 2, TILE_HEIGHT * (HEIGHT_IN_TILES / 2 + 1));
            }


            break;
        }
        
    }



    // Get X and Y position of the elm (from: vishalsays.wordpress.com)
    function getElementPosition(elm) {
      var x = elm.offsetLeft;        // set x to elm’s offsetLeft
      var y = elm.offsetTop;         // set y to elm’s offsetTop

      elm = elm.offsetParent;    // set elm to its offsetParent

      //use while loop to check if elm is null
      // if not then add current elm’s offsetLeft to x
      //offsetTop to y and set elm to its offsetParent
      while(elm != null) {
        x = parseInt(x) + parseInt(elm.offsetLeft);
        y = parseInt(y) + parseInt(elm.offsetTop);
        elm = elm.offsetParent;
      }

      // returns an object with "xp" (Left), "=yp" (Top) position
      return new Point(x, y);
    }



    function mouseClick(event) {                         
        log("mouseClick. X="+event.pageX + ", Y="+ event.pageY);

        var canvas = document.getElementById("html5linesCanvas");
        var canvasPosition = getElementPosition(canvas);

        var mouseX = event.pageX - canvasPosition.x;
        var mouseY = event.pageY - canvasPosition.y;
        if (mouseY > (HEIGHT_IN_TILES + 1.5) * TILE_HEIGHT ) {
            isAudioOn = !isAudioOn;
            localStorage["dxgames.html5lines.isAudioOn"] = isAudioOn;
        }
        switch (situation) {
        case SITUATION_GAME:
            var tileX = Math.floor(mouseX / TILE_WIDTH);
            var tileY = Math.floor(mouseY / TILE_HEIGHT);
            if (linesEngine.getBalls()[tileX][tileY] != -1) {
                selectedBallPosition = new Point(tileX, tileY);
                playAudio(AUDIO_CLICK);
            } else {
                if (selectedBallPosition != null) {
                    var target = new Point(tileX, tileY);
                    var start = new Point(selectedBallPosition.x, selectedBallPosition.y);
                    var balls = linesEngine.getBalls();
                    var a = new Array(balls.length);
                    for (var n = 0; n < balls.length; n++) {
                        a[n] = new Array(balls[n].length);
                        for (var m = 0; m < balls[n].length; m++) {
                            a[n][m] = balls[n][m] >=0 ? 1 : 0;
                        }
                    }
                    try {
                        selectedBallPath = PathFinder.prototype.findPath(a, start.x, start.y, target.x, target.y);
                    } catch (e) {
                        selectedBallPath = null;
                        if (e.__proto__ != NoPathError.prototype) {
                            throw e;
                        }
                    }
                    if (selectedBallPath != null) situation = SITUATION_MOVE;
                    log(selectedBallPath);
                    playAudio(AUDIO_CLICK);
                }
            }

            break;
        case SITUATION_LOSE:
            newGame();
        break;
        }
    }

    function newGame() {
        linesEngine = new LinesEngine(WIDTH_IN_TILES,HEIGHT_IN_TILES,BALLS_COUNT);
        situation = SITUATION_GAME;
        linesEngine.generateNextBalls();
        linesEngine.placeNewBalls();
        nextBalls = linesEngine.generateNextBalls();
    }

    var lastCreatedEffectTime = 0;

    function mouseMove(event) {
        
    }

    function log(str) {
        if (DEBUG) console.log(str);
    }


    function playAudio(index) {
        if (isAudioOn) {
            try {
                audio[index].pause();
                audio[index].currentTime = 0;
                audio[index].play();
            } catch (e) {
                log(e.stackTrace);
        }
        }
    }


    function sign(val) {
        return val > 0 ? 1 : val == 0 ? 0 : -1;
    }

})();