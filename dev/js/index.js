//CONSTANTS
var width = 400;
var height = 400;
var colorPal={
  privateEyes : '#EBE7C5',
  greenTea : '#9AA68B',
  crowned : '#737278',
  asphaltReflection : '#2C2830',
  valentineWine: '#692E50',
//http://colorschemedesigner.com/#4j62hj3..v5w00K-Vh2U8Ig3FwZp4BpZCa-LNKcC--LoZa-LpwGC-qyiGErw0S-sxQ-y
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
  grayLiteBG: '#BFBFBF',
};
var topNumber=3;
var animDur=800;
var animLag=20;

// main module variable
var threes={};

//game variable setup
var gameOver=false;
var isScoringCompleted=false; //at the very end of the game, when the score tallying is all done

var lastdx,
    lastdy,
    lastx,
    lasty  ;
var idCtr;
//initial board setup
var pieceData; //= [];
var nextPieceValue;//=Math.floor((Math.random()*3)+1); //[1,3]


//INITIAL SVG SETUP, DONE ONCE
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
///////////Message SVG

d3.select(".messageSvg").
  attr("width", width/2).
  attr("height", height/4).
  style({
   //"background-color": colorPal.pinkLitBG,
    "margin": 10,
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
  //New Game
  newGameSetup:function(){
    //make sure the main piece layer is empty
    $(".mainPieceLayer").empty();
    $(".messageSvg").empty();
    
    gameOver=false;
    isScoringCompleted=false; //at the very end of the game, when the score tallying is all done

    lastdx=-1;
    lastdy=-1;
    lastx=-1;
    lasty=-1;
    idCtr=0;
    //initial board setup
    pieceData = [];    
    for(var i =0; i<3;i++){
      for(var j=0; j<3;j++){
        threes.utils.addRandomPiece(i+1);
      }
    }
    //initialize next piece
    nextPieceValue=Math.floor((Math.random()*3)+1);

    threes.utils.updateAndAddPieces();
    threes.utils.updatePreviewImage();
    threes.metaGameManager.initGameBonus();

  },
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
        "class":"pieceContainerG",
        "transform": function(d){
          return "translate("+ enterXFunct(d) +","+enterYFunct(d)+")" ;} 
      });
    //APEND the second icon
    g.append("text") //set initial icon values
      .attr({
        "class":"secondIcon",
        "font-family": "FontAwesome",
        "font-size" : "80px",
        "x" : 15,
        "y" : 0,
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":    colorPal.purpleLite ,
        "stroke": "none"
      })
      .style({
        "filter" :"url(#dropShadowPurpleFilter)" ,
      })
      .text(function(d){ return d.value==2 ?"\uf182" :""; });
    //APPEND <TEXT>.pieceValue and <TEXT>.pieceIcon to new <G>'s
    g.append("text") //set initial icon values
      .attr({
        "class":"pieceIcon",
        "font-family": "FontAwesome",
        "font-size" : "80px",
        "x" : function(d){ return d.value==2 ? -15 : 0 ; }, 
        "y" : 0,
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":  function(d){ return d.value==1 ?  colorPal.purpleLite : (  d.value==2 ?  colorPal.tealLite : colorPal.pinkLite ) ;},
        "stroke": "none"
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
        "fill": colorPal.offWhite,
        "font-family": "Lobster,cursive",
        "font-size": "34pt",//maxFontPoint+"pt",
        "text-anchor": 'middle',
        'vertical-align': 'text-bottom'
      })
      .text(function(d){return d.value >=3 ? valueFxn( d.value-2) : "" ;});//function(d){return d.value >=4 ?  Math.pow(2,d.value-3) : "" ;});
    
    
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
       .text(function(d){return d.value >=3 ? valueFxn( d.value-2) : "" ;})//.text(function(d){return d.value >=3 ? Math.pow(2,d.value-3) : "";}) //the string of text that will be displayed, also used above
      .duration(animDur/2);
     pieceG_Data //2nd ICON, part 1 apply immediately
      .select('.pieceIcon')
      .attr({
        "fill":  function(d){ return d.value==1 ?  colorPal.purpleLite : (  d.value==2 ?  colorPal.tealLite : colorPal.pinkLite ) ;},
        "x":function(d){ return d.value==2 ? -15 : 0 ; },
      });
    pieceG_Data //2nd ICON, part 2 apply over time
      .select('.pieceIcon')
      .transition()
      .style({
        "filter" : function(d){ return d.value==1 ? "url(#dropShadowPurpleFilter)" : (  d.value==2 ?  "url(#dropShadowTealFilter)" : "url(#dropShadowPinkFilter)" ) ;},
      })
      .text(function(d){ return d.value==1 ?"\uf182" : (  d.value==2 ?  "\uf183" : "\uf004"); })
      .duration(animDur);
    pieceG_Data //hide the secondary icon
      .select('.secondIcon')
      .transition()
      .text(function(d){ return d.value==2 ?"\uf182" :""; })
      .duration(animDur);
    pieceG_Data.transition() //3rd, use transform to move the whole <g>  </g>
      .ease("bounce")
      .attr({
        "transform": function(d){ return "translate("+  (0.5+d.x)*width/4 +","+ (0.5+d.y)*height/4 +")" ;} 
      })
      .duration(animDur) ;
    
    //////////////!!!!REMOVE:  remove and animate exiting icons
    pieceG_Data.exit()
      .selectAll('text') 
      .transition()
      .attr({
        "font-size": "0px",
        "dy" :"0em",

      })
      .duration(animDur/3).remove();
//    pieceG_Data.exit()
//      .select('.pieceIcon, .secondIcon') 
//      .transition()
//      .attr({
//        "font-size": "0px",
//        "dy" :"0em",
//
//      })
//      .duration(animDur/3).remove();
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
        "x" : function(d){return d.x;},
        "y" : function(d){return d.y;},
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
        "xy": function(d){ return d.x+","+d.y;},
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
      .selectAll("text");
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
        .text(function(d){ return nextPieceValue==1 ?"\uf182" : ( nextPieceValue==2 ?  "\uf183" : "\uf004" ); })
        .transition()
        .ease("bounce")
        .attr({
          "x" : function(d){ return nextPieceValue==2 ? width*3/32 : width/8;},
          "y" : height/8,
        })
        .duration(animDur);
      //2nd icon!!
      previewGroup
        .append("text")
        .attr({
           "class":"previewIconTwo",
          "font-family": "FontAwesome",
          "font-size" : "80px",
          "x" : width/8,
          "y" : -height/8,
          "dy" :".33em",
          "text-anchor": "middle",
          "fill":  colorPal.purpleLite ,
        })
        .text(function(d){ return nextPieceValue==2 ?  "\uf182" : "" ; })
        .transition()
        .ease("bounce")
        .attr({
          "x" : width*5/32,
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
        .text(function(d){return nextPieceValue >=3 ? valueFxn( nextPieceValue-2) : "" ;})
        //.text(function(d){return nextPieceValue >=3 ?  Math.pow(2,nextPieceValue-3) : "" ;})
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
//    //console.log(maxVal);
    var bins = maxVal;  //ie, if the maxVal is 4, there will be 4 bins total, one  1, 2, 4, and 4
//    //console.log(_.range(bins,0,-1));
    var binDistribution = _.chain(_.range(bins,0,-1))  //ie [4,3,2,1]
      .map(function(num,index){return Math.pow(2,num-1);})
      .value();//ie, [8,4,2,1]
    var totalSlots = Math.pow(2,bins)-1 ;//ie 2^4-1 = 15
    var winningSlot = Math.floor(Math.random()*totalSlots);// ie a number in the range [0,15-1]
    retval= _.reduce(binDistribution, function(memo,item){
      memo.sum+=item;
      if(memo.sum-1<winningSlot)
        memo.index++;
//      //console.log(JSON.stringify(memo));
      return memo;
    },{sum:0,index:0})
    .index; 
//    //console.log("Bin dist:",binDistribution,"total Slots:",totalSlots,"win slot:",winningSlot,"  ", retval);
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
      ////console.log(pieceData);
      var onesTally = _.reduce( pieceData,function(memo,piece){return piece.value===1? memo+1 : memo; },0);
      var twosTally = _.reduce( pieceData,function(memo,piece){return  piece.value===2? memo+1 : memo; },0);
      dT = onesTally-twosTally; //the difference
      nextPieceValue = Math.random() *2-1+0.25*dT > 0 ? 2 : 1; //stack the deck toward the less prominent sex
      ////console.log(onesTally,twosTally,dT, 0.25*dT);
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
        d3.select(".mainSVG")
        .append("g")
        .append("text")   //add new elements   vvvvvVVV
         .attr({
          "class":"gameOverText",
          "x" : 200,//function(d){return (0.5+d.x)*width/4;} ,
          "y" : 200,//function(d){return (0.5+d.y)*height/4 +height/25;} ,
          "fill": colorPal.yellow,
          "stroke" : colorPal.grayDark,
          "stroke-width" : 3,
          "font-family": "Lobster,cursive",
          "font-size": "10px",
          "text-anchor": 'middle',
          //"dy" :".33em",
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
        hurtSound.play();
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
        /*//console.log("move me");
        //console.log(pieceToMove);*/
        if(pieceToMove){
          pieceToMove.x+=dx;
          pieceToMove.y+=dy;
        }
      }
    });
    
    if(piecesToRemove.length>0)
      coinSound.play();
    else 
      blipSound.play();
  
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
    var newHeartValues=_.map(piecesToRemove, function(item){return {
      value : item.value<3?  3: item.value+1,
      x: item.x,
      y: item.y
    };});/*The <3 accounts for women ==1, men ==2, but both upgrade to 3*/
    threes.metaGameManager.checkIfBonusPointsGoalsMet(newHeartValues);

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
    threes.metaGameManager.getNextMultiplierLoc();
    threes.metaGameManager.updateMultiplier();

    threes.metaGameManager.sequenceBonusesAchievedLengths=[];
    threes.metaGameManager.activeSequences=[];
    //threes.metaGameManager.initNextLevelBonuses();
    //threes.metaGameManager.updateBonusPoints();
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
  /////////////////
  //update multiplier display
  updateMultiplier:function(){
    var ml=threes.metaGameManager.multiplierLoc;
    d3.selectAll(".backgroundRect")
    .transition()
    .delay(animDur)
    .attr({
      "stroke":colorPal.purple,
      "stroke-width":function(d){return (d.x== ml.x && d.y==ml.y) ? 4 : 0;},
      "filter" : function(d){ return (d.x== ml.x && d.y==ml.y) ? "" : "url(#innerShadowFilter)";},
    })
    .duration(0); 
      
  },
  ///////////////
  //update bonuses
  checkIfBonusPointsGoalsMet:function(newHeartsValues){ //array of new hearts values
    var justNewValues=_.map(newHeartsValues, function(item){return item.value;});
    //sort and filter the new Hearts value for uniques
    var uniqueSortedNewHearts = _.chain(justNewValues)
      .sortBy(function(heartVal){return heartVal;})
      .uniq(true) //true to indicate that array is already sorted
      .value();
    //console.log("+ ");
    //console.log("unique", JSON.stringify(uniqueSortedNewHearts));
              
    //get the meta variable
    //threes.metaGameManager.sequenceBonusesAchievedLengths;
    if(uniqueSortedNewHearts.length>0){
      var expectedNextValueInActiveSequences=_.map( threes.metaGameManager.activeSequences, function(sequenceData){
        return _.last(sequenceData.sequence)+1;
      });
      //console.log("expectedNext: ",JSON.stringify(expectedNextValueInActiveSequences));
      //find the new sequences and wrap them as one element long arrays
      //console.log("???Next: ",JSON.stringify(_.difference(uniqueSortedNewHearts,expectedNextValueInActiveSequences)));
      var newSequencesData=_.chain(uniqueSortedNewHearts)
        .difference(expectedNextValueInActiveSequences)//excluded expected next values of active sequence
        .map(function(val){
          return {
            id : threes.metaGameManager.seqID++,
            sequence : [val],
            active: true,
            multiplier :1,
          };
        })
        .value();
      //console.log("newSequence: ",JSON.stringify(newSequencesData));
      //threes.metaGameManager.activeSequences=newSequencesData;
      threes.metaGameManager.activeSequences=_.map( threes.metaGameManager.activeSequences, function(sequenceData){
        if( sequenceData.active ){//only update active sequences
          var nextVal = _.last(sequenceData.sequence)+1;
          sequenceData.active= _.contains(uniqueSortedNewHearts,nextVal);
          if( sequenceData.active ){ //is the sequence still active?
            //console.log(sequenceData.sequence);
            //console.log(nextVal);
            sequenceData.sequence=sequenceData.sequence.concat(nextVal);//if so push the next value
            //console.log(sequenceData.sequence);
          }
        }
        return sequenceData;
      });
      //console.log("old sequences: ", JSON.stringify(threes.metaGameManager.activeSequences));
      var terminatedSequences= _.filter(threes.metaGameManager.activeSequences, function(sequenceData){return !sequenceData.active;});
      var bonusesToGive= _.reduce(terminatedSequences,function(memo,sequenceObj){
        if(sequenceObj.sequence.length >=3){
          memo.push({
            multiplier: sequenceObj.multiplier,
            points: scoreFxn(sequenceObj.sequence.length),//Math.pow(2, sequenceObj.sequence.length-1 ),
          });
        }  
        return memo;
      },[]);
      if(bonusesToGive.length>0)
        threes.metaGameManager.gameBonuses.concat(bonusesToGive);
      //console.log("filtered sequences: ", JSON.stringify(threes.metaGameManager.activeSequences));
      //console.log("terminated sequences: ", JSON.stringify(terminatedSequences));
      //console.log("bonuses: ", JSON.stringify(bonusesToGive) );
      //show the new bonus points
      //threes.metaGameManager.showBonusEarned(bonusesToGive);
      
      threes.metaGameManager.gameBonuses=threes.metaGameManager.gameBonuses.concat(bonusesToGive);
      threes.metaGameManager.bounceBonusGoals(bonusesToGive);
      
      threes.metaGameManager.activeSequences=_.chain(threes.metaGameManager.activeSequences)
        .union(newSequencesData)//add the
        .filter(function(sequenceData){return sequenceData.active;})
        .value();
     
      //CHECK TO SEE IN NEW HEART WAS MADE IN A MUTLIPLIER SQUARE
      var shouldChangeMultiplierLocation=false;
      _.each(newHeartsValues,function(newHeartObject){
        var sequenceUpdatedWMultiplier=_.find(threes.metaGameManager.activeSequences,function(sequenceObject){
           //console.log("last:",_.last(sequenceObject.sequence),newHeartObject.value);
          return _.last(sequenceObject.sequence)===newHeartObject.value;
        });
         //console.log("?");
        //console.log(sequenceUpdatedWMultiplier);
        if(newHeartObject.x=== threes.metaGameManager.multiplierLoc.x  && newHeartObject.y=== threes.metaGameManager.multiplierLoc.y ){
          sequenceUpdatedWMultiplier.multiplier+=1;
          shouldChangeMultiplierLocation=true;
        }
      });
      if(shouldChangeMultiplierLocation){
        threes.metaGameManager.getNextMultiplierLoc();
        threes.metaGameManager.updateMultiplier();
      }
      //console.log("multiplied sequences: ", JSON.stringify(threes.metaGameManager.activeSequences));
      //update sequence appearance
      threes.metaGameManager.updateBonusSequences();
    }
  },

  //display active bonuses  
  updateBonusSequences:function(){
    //BIND THE DATA
    var sequenceG = d3.select(".pointBonusG")
      .selectAll(".sequenceG")
      .data(_.first(threes.metaGameManager.activeSequences,2),function(d){return d.id;}); //bind the data to at most the first two active sequences
    ////////////SEQUENCE LEVEL ADD/UPDATE/DELETE ACTIONS AND TRANSITIONS
    //ADD A NEW SEQUENCE
    sequenceG.enter()
      .append("g")
      .attr({  //NOTE!  Position of both the circle and text is set by its parent <g> group
        "class":"sequenceG",
        "transform": function(d,i){ return "translate("+ width/16 +","+(height/3.5)+")" ;} ,
      })
      .append("text")
      .attr({
        "class" : "multiplierVal",
        "font-family" : "Lobster,cursive",
        "font-size" : "0px",
        "dy" :".32em",
        "text-anchor": "middle",
        "fill":   colorPal.purple,
//        opacity:0
      })
      .text(function(d){return d.multiplier+"x";});
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
    sequenceG
      .select(".multiplierVal")
      .transition()
      .ease("elastic")
      .attr({
        "font-size" : function(d){return d.multiplier>1?"15px":"0px";},
        "dy" :".33em",
      })
      .text(function(d){return d.multiplier+"X";})
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
    //console.log("Num data", threes.metaGameManager.activeSequences.length);
    
    
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
        "fill":  function(d,i){return i==d.length-1 ?  colorPal.purpleLite: colorPal.pink;} ,
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
      .text(function(d,i){ return valueFxn(d.val-2);})
      //.text(function(d,i){ return Math.pow(2,d.val-3);})
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
      .text(  '\uf00c');
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
        "font-size" : function(d,i){return i==d.length-1? "0px": "30px";},
        "dy" :".36em",
      })
      .delay(animDur);          
     
  },
  bounceBonusGoals:function(bonusesEarned, shouldIncrimentFinalScore){
    if(shouldIncrimentFinalScore){
      setTimeout(function(){isScoringCompleted=true; },animDur*bonusesEarned.length);
    }
    bonusesEarned=_.sortBy(bonusesEarned,function(bonus){return bonus.points*bonus.multiplier;});
    d3.select(".metaGameSVG")
      .selectAll(".bonusAlertText")
      .data(bonusesEarned)
      .enter()
      .append("text")
      .attr({
        "class" : "bonusAlertText",
        "font-family" : "Lobster,cursive",
        "font-size" : "50px",
        "dy" :".32em",
        "text-anchor": "middle",
        "fill":   colorPal.purpleLite,
        "stroke": colorPal.purple,
        "stroke-width":2,
        "x":width/2,
        "y":height*3/8,
      })
      .text( function(d){
        var retString = d.multiplier>1 ? (d.multiplier+" x ") : "+";
        return retString.concat(d.points);
      })
      .transition()
      .delay(function(d,i){
        var delayTime =animDur*i;
        if(shouldIncrimentFinalScore){
          setTimeout(function(){
              threes.metaGameManager.incrimentFinalScore(d.multiplier*d.points);
              coinSound.play();
          }, delayTime+0.5*animDur);
        }
        return delayTime;
      })
      .duration(animDur*3/4)
      .attr({
        "y":height/8,
      })
      .transition()
      //.ease("bounce")
      .attr({
        "y":height*3/8,
      })
      .duration(animDur*3/4)
      .remove();
  },
  ////////////////////////
  //final score functions
  tallyFinalScore:function(){
    //remove the GameOver text
    d3.select(".gameOverText")
      .transition()
      .ease("out")
      .attr({
        "x":1.5*width,
        //"dy": ".32em"
        //"font-size":"0px", 
      })
      .duration(animDur)
      .remove();
    
    //initialize the final score
    threes.metaGameManager.finalScore=0;
    threes.metaGameManager.updateFinalScore();
    
    //sort the pieces by value and remove the dudes and gals
    var sortedPieceData= _.chain(pieceData)
      .sortBy(function(piece){return piece.value;})
      //.filter(function(piece){return piece.value>2;})
      .value(); 
    ////console.log("sorted pieces: ",JSON.stringify(sortedFilteredPieceData));
    //Animate scoring on the board
    var pieceG_Data=d3.select(".mainPieceLayer")
      .selectAll(".pieceContainerG") //gen an array of all circle element, possibly []
      .data(sortedPieceData,function(d) { return d.id; }); //bind data to elements
    //Gray out the non-scoring pieces
    pieceG_Data 
      //.select('.pieceIcon')
      .selectAll('.pieceIcon , .secondIcon')
      .transition()
      .delay(function(d,i){return animDur/3*i;})
      .attr({
        "fill":  function(d){ return d.value<=2 ?  colorPal.grayLiteBG : colorPal.pinkLite  ;},
      })
      .duration(animDur);
    //animate the pieces on the board
    pieceG_Data 
      .select(".pieceValue")
      .attr({
          "stroke-width" : 0,
      })
      .transition()
      .delay(function(d,i){
        var delayTime =animDur/3*i;
        setTimeout(function(){
          if(d.value>=3){
            threes.metaGameManager.incrimentFinalScore(scoreFxn(d.value-2));//Math.pow(2,d.value-3));
            coinSound.play(); 
          }
          else{
            hurtSound.play();
          }
        }, delayTime);
        return delayTime;})
      .text( function(d,i){return d.value>2? scoreFxn(d.value-2):"";})
      .ease("elastic")
      .attr({
        "fill": colorPal.yellow,
          "stroke" : colorPal.grayDark,
          "stroke-width" : 3,
          "font-size": "60px",
          "dy":".35em",
      })
      .duration(animDur);

      
              
    //animate the bonuse scores
    setTimeout(function(){ //wait until the board animations are done
      threes.metaGameManager.bounceBonusGoals(threes.metaGameManager.gameBonuses,true);
    }, 16*animDur/3);
               
  },
  incrimentFinalScore:function(incrimentValue){
    threes.metaGameManager.finalScore+=incrimentValue;
    threes.metaGameManager.updateFinalScore();
  },
  updateFinalScore:function(){
    var scoreData = [threes.metaGameManager.finalScore];
    d3.select(".messageSvg")
        .selectAll(".finalScoreText")
        .data(scoreData)
        .text(function(d){return d;}) //update!!!!
        .enter()             //enter!!!!!
        .append("g")
        .append("text")   //add new elements   vvvvvVVV
        .attr({
          "class":"finalScoreText",
          "x" : width/4,//function(d){return (0.5+d.x)*width/4;} ,
          "y" : height*3/16,//function(d){return (0.5+d.y)*height/4 +height/25;} ,
          "fill": colorPal.yellow,
          "stroke" : colorPal.grayDark,
          "stroke-width" : 3,
          "font-family": "Lobster,cursive",
          "font-size": "1px",
          "text-anchor": 'middle',
          //"dy" :".33em",
          'vertical-align': 'text-bottom',
          opacity : 0,
        })
        .text(function(d){return d;})
        .transition()
        .ease("elastic")
        .attr({
          "font-size": "70px",
          opacity : 1,
        })
        .duration(3*animDur) ;

  },
};



$("a").click(function(){
  coinSound.play();
});


//SETUP
threes.utils.drawBackgroundGrid();
//this is now called by the onclick of the main meny play button
$('#startGameButton').click(function(){
  threes.utils.newGameSetup();  
});


//capture keypresses
var keypressSleep=false;
function putKeysToSleep(){
  if(!keypressSleep){
    keypressSleep=true;
    setTimeout(function(){keypressSleep=false;},animDur );
  }
}
$(document).ready(function () {
  
  $( ".mainContent" ).on( "swipeleft", swipeleftHandler );
  $( ".mainContent" ).on( "swiperight", swiperightHandler );
  $( ".mainContent" ).on( "swipeup", swipeupHandler );
  $( ".mainContent" ).on( "swipedown", swipedownHandler );
  function swipeleftHandler( event ){
    handleInput("left");
  }
  function swiperightHandler( event ){
    handleInput("right");
  }
  function swipeupHandler( event ){
    handleInput("up");
  }
  function swipedownHandler( event ){
    handleInput("down");
  }
  
  
    $(document).keydown(
      function (event) {
           switch (event.which){
              case  65://left
              case  37:
                handleInput("left");
                break;
              case  68://right
              case  39:
                handleInput("right");
                break;
              case  87://up
              case  38:
                handleInput("up");
                break;
              case  83://down
              case  40:
                handleInput("down");
                break;
            }
        }
    );
  function handleInput(eventType){
    if(isScoringCompleted){
          //Do some cleanup!!!!
      //show high scores
      var thisGameScore ={name:"bob",score:threes.metaGameManager.finalScore}; 
      if(highScoreManager.utils.checkIfHighScore(thisGameScore))
        highScoreManager.utils.goToHighScoreEntryPage();
      else{
        highScoreManager.utils.goToHighScoresPage();
      }
    }
    else if(!gameOver && !keypressSleep){
      if(threes.utils.isAnyMovePossible()){//cannot add pieces === game over
        switch (eventType){
          case  "left":
            if(threes.utils.canMoveInDir(-1,0) ){
              //blipSound.play();
              threes.utils.smartMove(-1,0);
              putKeysToSleep();
            }
            else
              hurtSound.play();
            break;
          case  "right":
            if(threes.utils.canMoveInDir(1,0) ){
              //blipSound.play();
              threes.utils.smartMove(1,0);
              putKeysToSleep();
            }
            else
              hurtSound.play();
            break;
          case  "up":
            if(threes.utils.canMoveInDir(0,-1)  ){
              //blipSound.play();
              threes.utils.smartMove(0,-1);
              putKeysToSleep();
            }
            else
              hurtSound.play();
            break;
          case  "down":
            if(threes.utils.canMoveInDir(0,1) ){
              //blipSound.play();
              threes.utils.smartMove(0,1);
              putKeysToSleep();
            }
            else
              hurtSound.play();
            break;
        }
      }
    }
    else{
      if(gameOver && !keypressSleep){
        threes.metaGameManager.tallyFinalScore(); 
      }
    }
  }
});

function valueFxn(val){ // 1->3, 2->6
  console.log('value',val);
  return 3*Math.pow(2,val-1); 
}

function scoreFxn(val){ //3^n 1->3 , 2->9
  return Math.pow(3,val);
}

