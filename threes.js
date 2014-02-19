var gameOver=false;
var width = 400;
var height = 400;
var colorPal={
  privateEyes : '#EBE7C5',
  greenTea : '#9AA68B',
  crowned : '#737278',
  asphaltReflection : '#2C2830',
  valentineWine: '#692E50',
//hhttp://colorschemedesigner.com/#4j62hj3..v5w00K-Vh2U8Ig3FwZp4BpZCa-LNKcC--LoZa-LpwGC-qyiGErDG-jsxQ-y
  offWhite: '#FBF9ED',
  yellowLiteBG : '#FAF0B6',
  yellow : '#FDDB0E',
  tealLite:'#7CB9D7',
  teal : '#4C8EAF',
  pinkLitBG : '#FDBEE2',
  pinkLite : '#E981BC',
  pink : '#D4569D',
  purple : '#8869D1',
  purpleLite : '#BBA3F2',
  offBlack : '#30176A',
  grayDark : '#40403E',
  grayLite : '#5D5C56',
};
var topNumber=3;
var animDur=800;
var animLag=20;

var threes={};
var lastdx,
    lastdy,
    lastx,
    lasty;

var nextPieceValue=Math.floor((Math.random()*3)+1); //[1,3]

/////SETUP SVGs: INSERT SOME SVG ELEMENTS INTO THE DOM USING D3
///////////PREVIEW SVG
var previewGroup = d3.select(".previewGroup");
d3.select(".previewSvg").
  attr("width", height/4).
  attr("height", width/4).
  style({
     "background-color": colorPal.pinkLitBG,
     "border-color": colorPal.pinkLitBG,//grayLite,
     "border-style": "solid",
     "border-radius": 10,
     "border-width": 6,
     "box-shadow": "0px 6px " + colorPal.pinkLite,
    "margin": 10
  });///
//////////MAIN GAME AREA SVG
var svg = d3.select(".mainSVG")
  .attr({
    "width": height,
    "height": width
  })
  .style({
     "background-color": colorPal.pinkLitBG,
     "border-color": colorPal.pinkLitBG,
     "border-style": "solid",
     "border-radius": 10,
     "border-width": 10,
     "box-shadow": "0px 6px " + colorPal.pinkLite,
    "margin": 10
  })
  .append("g") //setup groups, will act as layers
  .attr({
    "class":"mainBackgroundLayer" })
  .style({
    "margin": 0 });
  d3.select(".mainSVG")
  .append("g")
  .attr({
    "class":"mainPieceLayer" })
  .style({
    "margin": 0 });
///////////META GAME SVG
d3.select(".metaGameSVG")
  .attr({
    "width": height,
    "height": width/4
  })
  .style({
     "background-color": colorPal.pinkLitBG,
     "border-color": colorPal.pinkLitBG,
     "border-style": "solid",
     "border-radius": 10,
     "border-width": 10,
     "box-shadow": "0px 6px " + colorPal.pinkLite,
    "margin": 10
  });

/////////////!!!!!!!!!!!!!!!!!!! Main util functions for this program
threes.utils={
  // This is heart of the d3 methods
  // the data (pieceData) is bound to the svg children in this method
  // new svg children are created and destroyed as needed
  // existing svg children are updated
  updateAndAddPieces: function(dx,dy){
    var maxFontPoint =35;
    var enterXFunct=function(d){
      if (dx=== -1)
        return (1.5+d.x)*width/4;
      else if (dx=== 1)
        return (-0.5+d.x)*width/4;
      else
        return (0.5+d.x)*width/4;
    };
    var enterYFunct=function(d){
      if (dy=== -1)
        return (1.5+d.y)*height/4;
      else if (dy=== 1)
        return (-0.5+d.y)*height/4;
      else
        return (0.5+d.y)*height/4;
    };
    var enterYFunctText=function(d){
       return enterYFunct(d)+height/25;
    };
    ///////D3!! BIND DATA TO <G>
    var pieceG_Data=d3.select(".mainPieceLayer")
      .selectAll("g") //gen an array of all circle element, possibly []
      .data(pieceData,function(d) { return d.id; }); //bind data to elements
    
    ///////!!ADD <G>'s:
    var g =  pieceG_Data.enter()
      .append("g")
      .attr({  //NOTE!  Position of both the circle and text is set by its parent <g> group
        "transform": function(d){ return "translate("+ enterXFunct(d) +","+enterYFunct(d)+")" ;} 
      });
    //APPEND <TEXT>.pieceValue and <TEXT>.pieceIcon to new <G>'s
    g.append("text") //set initial icon values
      .attr({
        "class":"pieceIcon",
        "font-family": "FontAwesome",
        "font-size" : "80px",
        "x" : 0,
        "y" : 0,
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":  function(d){ return d.value==1 ?  colorPal.purpleLite : (  d.value==2 ?  colorPal.tealLite : colorPal.pinkLite ) ;},
      })
      .style({
        "filter" : function(d){ return d.value==1 ? "url(#dropShadowPurpleFilter)" : (  d.value==2 ?  "url(#dropShadowTealFilter)" : "url(#dropShadowPinkFilter)" ) ;},
      })
      .text(function(d){ return d.value==1 ?"\uf182" : (  d.value==2 ?  "\uf183" : "\uf004" ); });
    g.append("text")   //set intial text values
       .attr({
        "class":"pieceValue",
        "x" : 0,
        "y" : 0,
        "dy" :".3em",
        "fill": colorPal.brown,
        "font-family": "Lobster,cursive",
        "font-size": "34pt",//maxFontPoint+"pt",
        "text-anchor": 'middle',
        'vertical-align': 'text-bottom'
      })
      .text(function(d){return d.value >=4 ?  Math.pow(2,d.value-3) : "" ;});
    
    ////////////////!!!!UPDATE: applies transitions to both the newly added and old/updated circles  
    pieceG_Data // 1st VALUE
      .select('.pieceValue')  //the update
      .transition()  //??transitions here cause em not to be changed, ??cancelled by parent or sibling transition?
      .attr({
        "fill": function(d){return d.value>=4 ? colorPal.offWhite : colorPal.offWhite; },
        "dy" :".3em",
        "font-size": function(d){ //calculate the font size base on the string of text that will be displayd
           var displayedTextVal = d.value >=3 ? Math.pow(2,d.value-3) : "a"; //?RETURN A FIXES A BUG WHERE THE FORM EM GES INGNORED?
           return displayedTextVal === "" ? maxFontPoint: getFontPoint(String(displayedTextVal), "Lobster", 40, maxFontPoint )+"pt" ;
        },
      })
      .text(function(d){return d.value >=3 ? Math.pow(2,d.value-3) : "";}) //the string of text that will be displayed, also used above
      .duration(animDur/2);
     pieceG_Data //2nd ICON, part 1 apply immediately
      .select('.pieceIcon')
      .attr({
        "fill":  function(d){ return d.value==1 ?  colorPal.purpleLite : (  d.value==2 ?  colorPal.tealLite : colorPal.pinkLite ) ;},
      });
    pieceG_Data //2nd ICON, part 2 apply over time
      .select('.pieceIcon')
      .transition()
      .style({
        "filter" : function(d){ return d.value==1 ? "url(#dropShadowPurpleFilter)" : (  d.value==2 ?  "url(#dropShadowTealFilter)" : "url(#dropShadowPinkFilter)" ) ;},
      })
      .text(function(d){ return d.value==1 ?"\uf182" : (  d.value==2 ?  "\uf183" : "\uf004"); })
      .duration(animDur);

    pieceG_Data.transition() //3rd, use transform to move the whole <g>  </g>
      .ease("bounce")
      .attr({
        "transform": function(d){ return "translate("+  (0.5+d.x)*width/4 +","+ (0.5+d.y)*height/4 +")" ;} 
      })
      .duration(animDur) ;
    
    //////////////!!!!REMOVE:  remove and animate exiting circles
    pieceG_Data.exit()
      .select('.pieceValue') 
      .transition()
      .attr({
        "font-size": "0px",
        "dy" :"0em",

      })
      .duration(animDur/3).remove();
    pieceG_Data.exit()
      .select('.pieceIcon') 
      .transition()
      .attr({
        "font-size": "0px",
        "dy" :"0em",

      })
      .duration(animDur/3).remove();
    pieceG_Data.exit().transition().duration(animDur/3).remove(); //remove the G elements

  },
  //////////////////////////////////////////////////////////
  //draw the background for both the preview and main svg
  drawBackgroundGrid: function(){
    //preview image
    previewGroup 
      .append("rect")
      .attr({
        "x" : width/80,
        "y" : height/80,
        "rx" : width/40,
        "ry" : height/40,
        "width" : width/4-width/40,
        "height" : height/4-height/40,
        "fill" : colorPal.offWhite,
        "stroke-width":3,
        "stroke": colorPal.purple,
        //"filter" : "url(#innerShadowFilter)"
      });
    ////////meta game panel svg
    var row = d3.range(1);//<-- change the range to get multiple panels
    d3.select(".metagameSVG").selectAll("rect")
      .data(row)
      .enter()
      .append("rect")
      .attr({
        "x" : function(d){ return width/80+d*width/row.length ; } ,
        "y" : function(d){ return height/80 ; } ,
        "rx" : width/40,
        "ry" : height/40,
        "width" : width/row.length-width/40,
        "height" : height/4-height/40,
        "fill" : colorPal.offWhite,
        "filter" : "url(#innerShadowFilter)"
      });
    var metaTitle = [
      {
        title: "Bonus Points",
        fontSize:"20pt",
        color: colorPal.teal,
        y:height*1/12,
        x:width/2
      },
      {
        title: "Longest Current Streak!",
        fontSize:"12pt",
        color: colorPal.purpleLite,
        y:height*2.6/12,
        x:width*3/4,
      },
    
    ];
    d3.select(".metagameSVG")
      .selectAll("text")
      .data(metaTitle)
      .enter()
      .append("text")
      .attr({
        "x" : function(d){return d.x},
        "y" : function(d){return d.y},
        "text-anchor": 'middle',
        'vertical-align': 'text-bottom',         
        "fill": function(d){return d.color;},
        "font-family": "Lobster,cursive",
        "font-size":function(d){return d.fontSize;},
      }).
      text(function(d){return d.title;});
    
    
    //main svg
    var grid = d3.range(16);
    var indices=_.map(grid,function(val){
      return {x: Math.floor(val/4), y: val%4};
    });
    d3.select(".mainBackgroundLayer").selectAll("rect")
      .data(indices)
      .enter()
      .append("rect")
      .attr({
        "class" : "backgroundRect",
        "x" : function(d){ return width/80+d.x*width/4 ; } ,
        "y" : function(d){ return height/80+d.y*height/4 ; } ,
        "i" : function(d){ return d.x;},
        "j" : function(d){ return d.y;},
        "rx" : width/40,
        "ry" : height/40,
        "width" : width/4-width/40,
        "height" : height/4-height/40,
        "fill" : colorPal.offWhite,
        "filter" : "url(#innerShadowFilter)"
      });
      
  },
  //////////////////////////////////////////////////////////
  // show the next preview piece
  updatePreviewImage:function(){
        
    //the Icon
    var oldIcon= previewGroup
      .select(".previewIcon");
    if(oldIcon){//remove the old preview icon
      oldIcon
      .transition()
      .ease("bounce")
      .attr({
        "x" : width/8,
        "y" : height*3/8,
      })
      .duration(animDur)
      .remove();
    }
    if(nextPieceValue>0){
      previewGroup
        .append("text")
        .attr({
           "class":"previewIcon",
          "font-family": "FontAwesome",
          "font-size" : "80px",
          "x" : width/8,
          "y" : -height/8,
          "dy" :".33em",
          "text-anchor": "middle",
          "fill":  function(d){ return nextPieceValue==1 ?  colorPal.purpleLite : (  nextPieceValue==2 ?  colorPal.tealLite : colorPal.pinkLite ) ;},
        })
        .style({
          
        })
        .text(function(d){ return nextPieceValue==1 ?"\uf182" : ( nextPieceValue==2 ?  "\uf183" : "\uf004" ); })
        .transition()
        .ease("bounce")
        .attr({
          "x" : width/8,
          "y" : height/8,
        })
        .duration(animDur);
    }
    //the value text/////
    var oldText= previewGroup
      .select(".previewValue");
    if(oldText)
      oldText
      .transition()
      .ease("bounce")
      .attr({
        "x" : width/8,
        "y" : height*3/8,
      })
      .duration(animDur)
      .remove();
    if(nextPieceValue>0){
      previewGroup
        .append("text")
        .text(function(d){return nextPieceValue >=3 ?  Math.pow(2,nextPieceValue-3) : "" ;})
        .attr({
          "class" :"previewValue",
          "x" : width/8,
          "y" : -height/8,
          "text-anchor": 'middle',
          'vertical-align': 'text-bottom',         
          "dy" :".3em",
          "fill": colorPal.offWhite,
          "font-family": "Lobster,cursive",
          "font-size":"34pt",
//          "font-size": function(d){ //calculate the font size base on the string of text that will be displayd
//             var displayedTextVal = nextPieceValue >=3 ? Math.pow(2,nextPieceValue-3) : "a"; //?RETURN A FIXES A BUG WHERE THE FORM EM GES INGNORED?
//             return displayedTextVal === "" ? maxFontPoint: getFontPoint(String(displayedTextVal), "Lobster", 40, 34 )+"pt" ;
//          },

        })
        .transition()
        .ease("bounce")
        .attr({
          "x" : width/8,
          "y" : height/8,
        })
        .duration(animDur+animLag);
    }
  },
  //////////////////////////////////////////////////////////
  // Add a new piece to the board
  addPiece: function(dx,dy){
    var newX,
      newY;
    var firstAttempt=true;
    do{
      if(firstAttempt && lastdx===dx && lastdy==dy){
        newX=lastx;
        newY=lasty;
        firstAttempt=false;
      }else{
        var freeCoord=Math.floor(Math.random()*4);
        if(dx===-1) { newX=3;  newY=freeCoord;}
        else if(dx===1) { newX=0;  newY=freeCoord;}
        else if(dy===-1) { newY=3;  newX=freeCoord;}
        else if(dy===1) { newY=0;  newX=freeCoord;}
      }
    }while(_.find(pieceData,function(item){
      return (item.x===newX && item.y===newY);
    }) );
    //add the new piece
    pieceData.push({
      x:newX,
      y:newY,
      value:nextPieceValue,
      id:idCtr++
    });
    //check to see if game is over
    threes.utils.isAnyMovePossible();
    //save this  move direction and new piece position
    lastdx=dx; lastdy=dy; lastx=newX; lasty=newY;
  },
  ////////////////////////////////////////////
  //// Get a random value in a gemotric distribution (probabilities = 8,4,2,1 )
  getRandomInGeometricDistribution:function(maxVal){  //maxVal >=1, ie maxVal =4 can return  1, 2, 3 or 4. Relative chances or each value are 8, 4 , 2 and 1x, respectivels  
//    console.log(maxVal);
    var bins = maxVal;  //ie, if the maxVal is 4, there will be 4 bins total, one  1, 2, 4, and 4
//    console.log(_.range(bins,0,-1));
    var binDistribution = _.chain(_.range(bins,0,-1))  //ie [4,3,2,1]
      .map(function(num,index){return Math.pow(2,num-1);})
      .value();//ie, [8,4,2,1]
    var totalSlots = Math.pow(2,bins)-1 ;//ie 2^4-1 = 15
    var winningSlot = Math.floor(Math.random()*totalSlots);// ie a number in the range [0,15-1]
    retval= _.reduce(binDistribution, function(memo,item){
      memo.sum+=item;
      if(memo.sum-1<winningSlot)
        memo.index++;
//      console.log(JSON.stringify(memo));
      return memo;
    },{sum:0,index:0})
    .index; 
//    console.log("Bin dist:",binDistribution,"total Slots:",totalSlots,"win slot:",winningSlot,"  ", retval);
    return retval;
  },
  //////////////////////////////////////////////////////////
  // calculate the value of the next piece, will be shown in the preview svg
  genNextPieceValue : function(){
    nextPieceValue =  Math.floor( Math.random()*3)+1; //inclusive 1 to 3
    if (nextPieceValue ===3){
      if( topNumber >=6 ){ //the highest number tile
        nextPieceValue=3+threes.utils.getRandomInGeometricDistribution(topNumber-4);
      }
      
    }
    else{ //don't allow too many of one type to build up
      //count up all the ones and the two on the board
      //console.log(pieceData);
      var onesTally = _.reduce( pieceData,function(memo,piece){return piece.value===1? memo+1 : memo; },0);
      var twosTally = _.reduce( pieceData,function(memo,piece){return  piece.value===2? memo+1 : memo; },0);
      dT = onesTally-twosTally; //the difference
      nextPieceValue = Math.random() *2-1+0.25*dT > 0 ? 2 : 1; //stack the deck toward the less prominent sex
      //console.log(onesTally,twosTally,dT, 0.25*dT);
    }
  },
  ///////////////////////////////////////////////////////////
  // add random random pieces, only used for initialization the starting pieces now
  addRandomPiece: function(newVal){
    newVal= newVal || Math.floor( (Math.random()*3)+1);//[1,3]
    //add a new piece
    var newX,
      newY;
    do{
      newX=Math.floor(Math.random()*4);
      newY=Math.floor(Math.random()*4);
    }while(_.find(pieceData,function(item){
      return (item.x===newX && item.y===newY);
    }) );
    pieceData.push({
      x:newX,
      y:newY,
      value:newVal,
      id:idCtr++
    });
    //check to see if game is over
    threes.utils.isAnyMovePossible();
  },
  //////////////////////////////////////////////////////////
  //check to see if there are any possible moves, if not the game is over
  isAnyMovePossible:function(){
    //are any moves possible?
    var gameOn= !!threes.utils.canMoveInDir(0,1) ||
      !!threes.utils.canMoveInDir(0,-1) ||
      !!threes.utils.canMoveInDir(1,0) ||
      !!threes.utils.canMoveInDir(-1,0);
    //if not, declare the game over and animate a gameover text
    if(!gameOn){
      gameOver=true;
      setTimeout(function(){
        console.log("GAME OVER");
        d3.select(".mainSVG")
        .append("g")
        .append("text")   //add new elements   vvvvvVVV
         .attr({
          "x" : 200,//function(d){return (0.5+d.x)*width/4;} ,
          "y" : 200,//function(d){return (0.5+d.y)*height/4 +height/25;} ,
          "fill": colorPal.yellow,
          "stroke" : colorPal.grayDark,
          "stroke-width" : 3,
          "font-family": "Lobster,cursive",
          "font-size": "10px",
          "text-anchor": 'middle',
          "dy" :".33em",
          'vertical-align': 'text-bottom',
          opacity : 0,
        })
        .text("Game Over")
        .transition()
        .ease("elastic")
        .attr({
          "font-size": "70px",
          opacity : 1,
        })
        .duration(3*animDur) ;
      },animDur);//wait until after the new pieces are added
    }
    return gameOn;
  },
  //////////////////////////////////////////////////////////
  // is a move in the given direction possible?
  canMoveInDir:function(dx,dy){
    var moveArray=threes.utils.moveInDirArray(dx,dy);
    var itemThatCanMove=_.find(moveArray,function(item){
      return item.canMove===true;
    });
    return !!itemThatCanMove;
  },
  //////////////////////////////////////////////////////////
  // helper function which returns an array of all the pieces.  Pieces have field .canMove which will be true/false if they can/not move
  moveInDirArray:function(dx,dy,piecesToRemove){ //3rd arguement is optional, should be an empty array.  Pieces to delete will be added to this array.
    var canMoveArray = [];
    //sort the data.  The sorted data will be sorted either left to right, top to bot, bot top or R to L dependeing on dx and dy
    var sortedData=_.sortBy(pieceData,function(piece){
      return -piece.x*dx-piece.y*dy;
    });
    _.forEach(sortedData, function(piece){
      var moveVal= {x:piece.x, y:piece.y, value:piece.value, id:piece.id};
      if( !inRange( {x:piece.x+dx, y:piece.y+dy} ) ){ //next to a wall, cannot move
        moveVal.canMove=false;
      }
      else{
        var adjacentPiece = _.find(canMoveArray,function(mVal){
          return( mVal.x===(piece.x+dx) && mVal.y===(piece.y+dy));} );

        if ( !adjacentPiece ){ //no piece next to you, move into open spot
          moveVal.canMove=true;
        }
        else{
           if( adjacentPiece.canMove )//there is an adjacent piece, but it will move out of the way
             moveVal.canMove=true;
           else{ //there is an adjacent piece, check to see if the two pieces combine
             if(adjacentPiece.value+piece.value===3){ //combine a 1 and 2 to get 3
               if(piecesToRemove){ //should be declared in scope where util.canMoveInDir is called
                 piecesToRemove.push(adjacentPiece);
                 piece.value=3;
               }
               moveVal.canMove=true;
             }
             else if(adjacentPiece.value===piece.value && piece.value>=3){ //combine two 3's or 6's or ...
                if(piecesToRemove){
                 piecesToRemove.push(adjacentPiece);
                 piece.value++;
                 if(piece.value>topNumber)
                   topNumber=piece.value;
               }
               moveVal.canMove=true;
             }
             else // no move avaialable
               moveVal.canMove=false;
           }
        }
      }
      canMoveArray.push(moveVal);
    });
    return canMoveArray;

    //util function
    function inRange(coord){
      if(coord.x<0) return false;
      if(coord.y<0) return false;
      if(coord.x>3) return false;
      if(coord.y>3) return false;
      return true;
    }
  },
  //////////////////////////////////////////////////////////
  // Performs a move action in the given direction.
  smartMove: function(dx,dy){
    var topValAtStartOfMove=topNumber;
    var piecesToRemove=[];
    var canMoveArray =threes.utils.moveInDirArray(dx,dy,piecesToRemove);
    //update piece data
    _.forEach(canMoveArray,function(piece){
      if(piece.canMove){
        var pieceToMove = _.find(pieceData ,function(mVal){
           return( mVal.x===piece.x && mVal.y===piece.y);} );
        /*console.log("move me");
        console.log(pieceToMove);*/
        if(pieceToMove){
          pieceToMove.x+=dx;
          pieceToMove.y+=dy;
        }
      }
    });

    //delete merged pieces
    pieceData=_.filter(pieceData,function(piece){
      var onRemList = _.find(piecesToRemove,function(remPiece){
        return remPiece.id===piece.id;
      });
      if( !onRemList)
        return true;
      return false;
    });
    //add a new piece
    threes.utils.addPiece(dx,dy);
    //update with the adds and deletes
    threes.utils.updateAndAddPieces(dx,dy);
    threes.utils.genNextPieceValue();
    threes.utils. updatePreviewImage();
    //update the bonuses
    var newHeartValues=_.map(piecesToRemove, function(item){return item.value<3?  3: item.value+1;});/*The <3 accounts for women ==1, men ==2, but both upgrade to 3*/
    threes.metaGameManager.checkIfBonusPointsGoalsMet(newHeartValues,topValAtStartOfMove<topNumber);

  },
  //NO LONGER USED
  /////////////////////
  moveAll: function(dx,dy){
    _.forEach(pieceData, function(piece){
      piece.x+=dx;
      piece.y+=dy;
    });
    threes.utils.addPiece(dx,dy);
    threes.utils.updateAndAddPieces();
  }
};

///////////////////////////////////
////META./////////////////////////////
/////////////////////////////////////
threes.metaGameManager={
  initGameBonus: function(){
    d3.select(".metaGameSVG").append('g').attr({"class":"pointBonusG"});
    threes.metaGameManager.seqID=0;
    threes.metaGameManager.gameBonuses=[];
    threes.metaGameManager.multiplierLoc={x:-1,y:-1};
    threes.metaGameManager.initNextLevelBonuses();
    //threes.metaGameManager.updateBonusPoints();
  },
  initNextLevelBonuses: function(){
    var currentLevelBonuses = {};
    //running sequence bonus
    threes.metaGameManager.sequenceBonusesAchievedLengths=[];
    threes.metaGameManager.activeSequences=[];
    //setup points bonus
    currentLevelBonuses.bonusPointsAchieved=0;
    currentLevelBonuses.bonusGoal= threes.metaGameManager.getNextPointsBonusGoal(currentLevelBonuses);
    threes.metaGameManager.gameBonuses.push(currentLevelBonuses);
    //setup multiplier
    currentLevelBonuses.multiplierAchieved=1;
    currentLevelBonuses.multiplierGoal= threes.metaGameManager.getNextMultiplierGoal(currentLevelBonuses);
    threes.metaGameManager.getNextMultiplierLoc();
    threes.metaGameManager.updateMultiplier();
  },
  getNextMultiplierLoc:function(){
    var newI, newJ, curLoc=threes.metaGameManager.multiplierLoc;
    do{
      newI=Math.floor(Math.random()*4);
      newJ=Math.floor(Math.random()*4);
    }while(newI==curLoc.x && newJ==curLoc.y);
    threes.metaGameManager.multiplierLoc={x:newI,y:newJ};
  },
  getNextPointsBonusGoal:function(currentBonuses){
    currentBonuses.bonusSubgoalsDone=0;
    var numberOfSteps = (topNumber-1 < 3+ currentBonuses.bonusPointsAchieved )? topNumber-1 : 3+ currentBonuses.bonusPointsAchieved ;
    return _.range(1,numberOfSteps+1);
//    var retval =_.map(_.range(3),function(){  
//      return 1+threes.utils.getRandomInGeometricDistribution(topNumber-2);
//    });
//    return retval;
  },
  getNextMultiplierGoal:function(currentBonuses){
    
  },
  /////////////////
  //update multiplier display
  updateMultiplier:function(){
    var ml=threes.metaGameManager.multiplierLoc;
    d3.selectAll(".backgroundRect")
    .attr({
      "stroke":colorPal.purple,
      "stroke-width":function(d){return (d.x== ml.x && d.y==ml.y) ? 4 : 0;},
      "filter" : function(d){ return (d.x== ml.x && d.y==ml.y) ? "" : "url(#innerShadowFilter)";},
    }); 
      
  },
  ///////////////
  //check to see if the level was passed, if all the subgoals were passed and/or if a single subgoal was passed and update/animate accordingly
  checkIfBonusPointsGoalsMet:function(newHeartsValues, didPassLevel){ //array of new hearts values
    //sort and filter the new Hearts value for uniques
    var uniqueSortedNewHearts = _.chain(newHeartsValues)
      .sortBy(function(heartVal){return heartVal;})
      .uniq(true) //true to indicate that array is already sorted
      .value();
    console.log("+ ");
    console.log("unique", JSON.stringify(uniqueSortedNewHearts));
              
    //get the meta variable
    //threes.metaGameManager.sequenceBonusesAchievedLengths;
    if(uniqueSortedNewHearts.length>0){
      var expectedNextValueInActiveSequences=_.map( threes.metaGameManager.activeSequences, function(sequenceData){
        return _.last(sequenceData.sequence)+1;
      });
      console.log("expectedNext: ",JSON.stringify(expectedNextValueInActiveSequences));
      //find the new sequences and wrap them as one element long arrays
      console.log("???Next: ",JSON.stringify(_.difference(uniqueSortedNewHearts,expectedNextValueInActiveSequences)));
      var newSequencesData=_.chain(uniqueSortedNewHearts)
        .difference(expectedNextValueInActiveSequences)//excluded expected next values of active sequence
        .map(function(val){
          return {
            id : threes.metaGameManager.seqID++,
            sequence : [val],
            active: true,
          };
        })
        .value();
      console.log("newSequence: ",JSON.stringify(newSequencesData));
      //threes.metaGameManager.activeSequences=newSequencesData;
      threes.metaGameManager.activeSequences=_.map( threes.metaGameManager.activeSequences, function(sequenceData){
        if( sequenceData.active ){//only update active sequences
          var nextVal = _.last(sequenceData.sequence)+1;
          sequenceData.active= _.contains(uniqueSortedNewHearts,nextVal);
          if( sequenceData.active ){ //is the sequence still active?
            console.log(sequenceData.sequence);
            console.log(nextVal);
            sequenceData.sequence=sequenceData.sequence.concat(nextVal);//if so push the next value
            console.log(sequenceData.sequence);
          }
        }
        return sequenceData;
      });
      console.log("old sequences: ", JSON.stringify(threes.metaGameManager.activeSequences));
      //threes.metaGameManager.activeSequences=threes.metaGameManager.activeSequences.concat(newSequencesData);
      threes.metaGameManager.activeSequences=_.chain(threes.metaGameManager.activeSequences)
        .union(newSequencesData)//add the
        .filter(function(sequenceData){return sequenceData.active;})
        .value();
      console.log("filtered sequences: ", JSON.stringify(threes.metaGameManager.activeSequences));
      
      threes.metaGameManager.updateBonusSequences();
    }

 
//    //get the meta variable
//    var thisLevelBonuses = _.last(threes.metaGameManager.gameBonuses);
//    var currentPBGoals= thisLevelBonuses.bonusGoal;
//    //check to see a subgoal or all subgoals were met
//    var didPassNextSubgoal = _.contains(newHeartsValues,2+currentPBGoals[ thisLevelBonuses.bonusSubgoalsDone] );
//    if(didPassNextSubgoal)
//      thisLevelBonuses.bonusSubgoalsDone++;
//    var didPassAllSubgoals = thisLevelBonuses.bonusSubgoalsDone >= currentPBGoals.length;
//    //DECISION TREE
//    //make appropriate action based on if passing level, passing subgoal, andor passing all subgoals
//    
//    
//    if(didPassLevel || didPassAllSubgoals)
//      threes.metaGameManager.bounceBonusGoals(); //on a delay
//    if( didPassAllSubgoals ){ // check to see if you've met all the current subgoals
//      thisLevelBonuses.bonusPointsAchieved++;   
//      threes.metaGameManager.showBonusEarned();
//      threes.metaGameManager.updateBonusesCompleted();//show that all the goals were completed
//      setTimeout(function(){
//        if(didPassLevel){
//          threes.metaGameManager.initNextLevelBonuses();
//          threes.metaGameManager.updateBonusPoints();
//        }
//        else{
//          thisLevelBonuses.bonusGoal=threes.metaGameManager.getNextPointsBonusGoal(thisLevelBonuses);
//          threes.metaGameManager.updateBonusPoints();
//        }
//      },animDur);
//    }
//    else if(didPassNextSubgoal){
//      threes.metaGameManager.updateBonusPoints();
//    }
//    if(!didPassAllSubgoals && didPassLevel){
//      threes.metaGameManager.updateBonusPoints(); 
//      setTimeout(function(){
//        threes.metaGameManager.initNextLevelBonuses();
//        threes.metaGameManager.updateBonusPoints();
//       },animDur);
//    }
//    if(!didPassNextSubgoal && newHeartsValues.length>0){
//      thisLevelBonuses.bonusSubgoalsDone=0;
//      threes.metaGameManager.updateBonusPoints();
//    }

  },
  //update the bonus and multiply display
  updateMetaGameSVG:function(){
    threes.metaGameManager.updateBonusPoints();
  },
  
  updateBonusSequences:function(){
    
    //BIND THE DATA
    var sequenceG = d3.select(".pointBonusG")
      .selectAll(".sequenceG")
      .data(_.first(threes.metaGameManager.activeSequences,3),function(d){return d.id;}); //bind the data to at most the first three active sequences
    
    ////////////SEQUENCE LEVEL ADD/UPDATE/DELETE ACTIONS AND TRANSITIONS
    //ADD A NEW SEQUENCE
    sequenceG.enter()
      .append("g")
      .attr({  //NOTE!  Position of both the circle and text is set by its parent <g> group
        "class":"sequenceG",
        "transform": function(d,i){ return "translate("+ width/16 +","+(height/3.5)+")" ;} ,
      });
      
    //UPDATE LOCATION OF THE SEQUENCE
    sequenceG
      .transition()
      .ease("bounce")
      .attr({  //NOTE!  Position of both the circle and text is set by its parent <g> group
        "class":"sequenceG",
        "transform": function(d,i){ return "translate("+ width/16 +","+(height*(2.2+i)/16 )+")" ;} ,
        //"data":function(d){return JSON.stringify(d);},
      })
      .duration(animDur);
    
    //DELETE A SEQUENCE
    sequenceG.exit()
      .transition()
      .ease("out")
      .attr({  //NOTE!  Position of both the circle and text is set by its parent <g> group
        "transform": function(d,i){ return "translate("+ width/16 +","+(height/2 )+")" ;} ,
      })
      .duration(animDur)
      .remove();
    console.log("Num data", threes.metaGameManager.activeSequences.length);
    
    
     ////////////**SUB**SEQUENCE LEVEL ADD/UPDATE/DELETE ACTIONS AND TRANSITIONS
    // BIND GOALS WITHIN A SEQUENCE
    var goalG= sequenceG
      .selectAll(".goalG")
      .data( function(d) {
        var augmentedSequence = d.sequence.concat([_.last(d.sequence)+1]);//add the next goal to the end of the sequence
        return _.map(augmentedSequence,function(val, ind){return {val:val, length: augmentedSequence.length};});//map goals to objects, include the array length 
      });
    
    //ADD G
    var goalG_subG = goalG.enter()
      .append("g")
      .attr({  //NOTE!  Position of both the circle and text is set by its parent <g> group
        "class":"goalG",
        "transform": function(d,i){ return "translate("+ (width/16+i*width/14) +","+0+")" ;} ,
      });
    //add hearts
    goalG_subG
      .append("text")
      .attr({
        "class":"goalIcon",
        "font-family": "FontAwesome",
        "font-size" : function(d,i){return i===0 ? "20px":"1px";},
        "dy" :".32em",
        "text-anchor": "middle",
        "fill":  function(d,i){console.log("?");return i==d.length-1 ?  colorPal.purpleLite: colorPal.pink;} ,
      })
      .text( "\uf004" );
//      .transition()
//      .attr({
//        "font-size" : "20px",
//        "dy" :".33em", 
//       
//      })
//      .duration(animDur);
    //update  hearts
    goalG
      .select(".goalIcon")
      .transition()
      .attr({
        "fill":  function(d,i){return i==d.length-1 ?  colorPal.purpleLite: colorPal.pink;} ,
        "font-size" : "20px",
        "dy" :".33em",
      })
      .delay(animDur);
//    
    //value
    goalG_subG
      .append("text")
      .attr({
        "class" : "goalVal",
        "font-family" : "Lobster,cursive",
        "font-size" : function(d,i){return i===0 ? "12px":"1px";},
        "dy" :".32em",
        "text-anchor": "middle",
        "fill":   colorPal.offWhite,
//        opacity:0
      })
      .text(function(d,i){console.log(d); return Math.pow(2,d.val-3);})
      .transition()
      .attr({
        "font-size" : "12px",
        "dy" :".33em"
      })
      .duration(animDur);
    
    //checks
    goalG_subG
      .append("text")
      .attr({
        "class" : "goalCheck",
        "font-family" : "FontAwesome",
        "font-size" : "0px",
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":   colorPal.purpleLite,
        "stroke-width":2,
        "stroke": colorPal.purple,
      })
      .text(  '\uf00c')
//      .transition()
//      .delay(animDur)
//      .ease("elastic")
//      .attr({
//        "font-size" : "30px",
//        "dy" :".36em",
//      })
//      .duration(animDur);
        //update  hearts
    goalG
      .select(".goalCheck")
      .transition()
      .attr({
        "font-size" : function(d,i){return i==d.length-1? "0px": "30px"},
        "dy" :".36em",
      })
      .delay(animDur);          
     
  },
  
  updateBonusPoints:function(){//update the display of the bonus points goal
    var thisLevelBonuses = _.last(threes.metaGameManager.gameBonuses);
    var currentPBGoals= thisLevelBonuses.bonusGoal;
    d3.select(".pointBonusG")
      .selectAll("g")
      .remove();

    var goalGroupData = d3.select(".pointBonusG")
      .selectAll("g")
      .data(currentPBGoals );
    goalGroupData
      .select(".goalVal")
      .text(function(d){return d;});
    var goalGroupDataEnter=goalGroupData.enter()
      .append("g")
      .attr({
        "transform": function(d,i){ return "translate("+ (width/4 +30*(i-(currentPBGoals.length-1)/2.0) ) +","+height*5/32 +")" ;} 
      });
    //hearts
    goalGroupDataEnter.append("text") //set initial icon values
      .attr({
        "class":"goalIcon",
        "font-family": "FontAwesome",
        "font-size" : "20px",

        "dy" :".33em",
        "text-anchor": "middle",
        "fill":  function(d,i){return i<=thisLevelBonuses.bonusSubgoalsDone ? colorPal.pink: colorPal.purpleLite;} ,
      })
      .text( "\uf004" );
    //numbers
    goalGroupDataEnter
      .append("text")
      .attr({
        "class" : "goalVal",
        "font-family" : "Lobster,cursive",
        "font-size" : "12px",
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":   colorPal.offWhite,
//        opacity:0
      })
//      .transition()
      .attr({
        opacity:1
      })
//      .duration(animDur)
      .text(function(d){return Math.pow(2,d-1);});
    //checks
    goalGroupDataEnter
      .append("text")
      .attr({
        "class" : "goalCheck",
        "font-family" : "FontAwesome",
        "font-size" : "0px",
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":   colorPal.purpleLite,
        "stroke-width":2,
        "stroke": colorPal.purple,
      })
      .text(function(d,i){return i<thisLevelBonuses.bonusSubgoalsDone ? '\uf00c': "";})
      .transition()
      .ease("elastic")
      .attr({
        "font-size" : "30px",
        "dy" :".36em",
      })
      .duration(animDur);
  },
  
  updateBonusesCompleted:function(){
    var thisLevelBonuses = _.last(threes.metaGameManager.gameBonuses);
    var currentPBGoals= thisLevelBonuses.bonusGoal;

    var goalGroupData = d3.select(".pointBonusG")
      .selectAll("g")
      .data(currentPBGoals );
    goalGroupData
      .select(".goalIcon")
      .attr({
        "fill":  colorPal.pink ,
      });

    //checks
    goalGroupData
      .select(".goalCheck")
      .attr({
        "font-size" : "5px",
        "dy" :".33em",
      })
      .transition()
      .ease("elastic")
      .attr({
        "font-size" : "30px",
        "dy" :".36em",
      })
      .duration(animDur)
      .text('\uf00c');
    //threes.metaGameManager.bounceBonusGoals();
  },
  showBonusEarned:function(){
    var thisLevelBonuses = _.last(threes.metaGameManager.gameBonuses);
    d3.select(".metaGameSVG").append("text")
     .attr({
      "font-family" : "Lobster,cursive",
      "font-size" : "50px",
      "dy" :".32em",
      "text-anchor": "middle",
      "fill":   colorPal.purpleLite,
      "stroke": colorPal.purple,
      "stroke-width":2,
      "x":width/4,
      "y":height*3/8,
    })
    .text("+"+Math.pow(2,thisLevelBonuses.bonusSubgoalsDone-1))
    .transition()
    .duration(animDur*3/4)
    .attr({
      "x":width/4,
      "y":height/8,
      "dy" :".33em",
    })
    .transition()
    //.ease("bounce")
    .attr({
      "x":width/4,
      "y":height*3/8,
    })
    .duration(animDur*3/4)
    .remove();
  },
  bounceBonusGoals:function(){
     //bounce everything up and down 
    d3.select(".pointBonusG")
      .attr({
        transition:"translate(0,"+0+")",
      })
      .transition()
      .delay(animDur/2)
      .ease("bounce")
      .attr({
        transform:"translate(0,"+height/4+")",
      })
      .duration(animDur/2)
      .transition()
      .attr({
        transform:"translate(0,"+0+")",
      })
      .duration(animDur/2);
  }
};






//SETUP
threes.utils.drawBackgroundGrid();

var idCtr=0;
var pieceData = [];
/*var pieceData = [
  {x:2,y:3, value:2, id:idCtr++},
  {x:3,y:0, value:1,  id:idCtr++},
  {x:1,y:2, value:3, id:idCtr++},
  {x:1,y:3, value:3, id:idCtr++}
];*/
for(var i =0; i<3;i++){
  for(var j=0; j<3;j++){
    threes.utils.addRandomPiece(i+1);
  }
}
threes.utils.updateAndAddPieces();
threes.utils.updatePreviewImage();
threes.metaGameManager.initGameBonus();
//capture keypresses
var keypressSleep=false;
function putKeysToSleep(){
  if(!keypressSleep){
    keypressSleep=true;
    setTimeout(function(){keypressSleep=false;},animDur );
  }
}
$(document).ready(function () {
    $(document).keydown(
      function (event) {
        if(!gameOver && !keypressSleep){
          if(threes.utils.isAnyMovePossible()){//cannot add pieces === game over
            switch (event.which){
              case  65://left
              case  37:
                if(threes.utils.canMoveInDir(-1,0) ){
                  threes.utils.smartMove(-1,0);
                  putKeysToSleep();
                }
                break;
              case  68://right
              case  39:
                if(threes.utils.canMoveInDir(1,0) ){
                  threes.utils.smartMove(1,0);
                  putKeysToSleep();
                }
                break;
              case  87://up
              case  38:
                if(threes.utils.canMoveInDir(0,-1)  ){
                  threes.utils.smartMove(0,-1);
                  putKeysToSleep();
                }
                break;
              case  83://down
              case  40:
                if(threes.utils.canMoveInDir(0,1) ){
                  threes.utils.smartMove(0,1);
                  putKeysToSleep();
                }
                break;
            }
          }
        }
    });
});


