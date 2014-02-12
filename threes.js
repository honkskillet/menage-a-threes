var gameOver=false;
var width = 400;
var height = 400;
var colorPal={
  'privateEyes' : '#EBE7C5',
  'greenTea' : '#9AA68B',
  'crowned' : '#737278',
  'asphaltReflection' : '#2C2830',
  'valentineWine': '#692E50'
}
var topNumber=3;
var animDur=800;
var animLag=20;
var pieces={};
var threes={};
var lastdx,
    lastdy,
    lastx,
    lasty;
var nextPieceValue=Math.floor((Math.random()*3)+1); //[1,3]
var previewSvg = d3.select("body").
  append("svg").
  attr("width", height/4).
  attr("height", width/4).
  style({
     "background-color": colorPal.privateEyes,
     "border-color": colorPal.crowned,
     "border-style": "solid",
     "border-radius": 10,
     "border-width": 6,
     "box-shadow": "0px 6px " + colorPal.valentineWine,
    "margin": 10
  });
var svg = d3.select("body").
  append("svg").
  attr("width", height).
  attr("height", width).
  style({
     "background-color": colorPal.privateEyes,
     "border-color": colorPal.crowned,
     "border-style": "solid",
     "border-radius": 10,
     "border-width": 6,
     "box-shadow": "0px 6px " + colorPal.valentineWine,
    "margin": 10
  });


threes.utils={
  // This is heart of the d3 methods
  // the data (pieceData) is bound to the svg children in this method
  // new svg children are created and destroyed as needed
  // existing svg children are updated
  updateAndAddPieces: function(dx,dy){
    var enterXFunct=function(d){
      if (dx=== -1)
        return (1.5+d.x)*width/4;
      else if (dx=== 1)
        return (-0.5+d.x)*width/4;
      else
        return (0.5+d.x)*width/4;
    }
    var enterYFunct=function(d){
      if (dy=== -1)
        return (1.5+d.y)*height/4;
      else if (dy=== 1)
        return (-0.5+d.y)*height/4;
      else
        return (0.5+d.y)*height/4;
    }
    var enterYFunctText=function(d){
       return enterYFunct(d)+height/25;
    }
    var circleData=svg.selectAll("circle") //gen an array of all circle element, possibly []
      .data(pieceData,function(d) { return(d.id); }); //bind data to elements
      //enter, if there isn't a circle matching a datapoint, add one
      circleData.enter()
      .append("circle")   //add new elements   vvvvvVVV
       .attr({
        "cx" : enterXFunct,
        "cy" : enterYFunct,
        'r'  : 40
      })
      .style({
        "fill": "maroon"
        //"stroke":"teal"
      });
      //applies transitions to both the newly added and old/updated circles
      circleData.transition()
      .ease("bounce")
      .attr({
        "cx" : function(d){return (0.5+d.x)*width/4;} ,
        "cy" : function(d){return (0.5+d.y)*height/4;} ,
        "r"  : 40
      })
      .style({
        "fill": "steelblue"
        //"stroke":"teal"
      })
      //.delay(200)
      .duration(animDur) ;
      //remove and animate exiting circles
      circleData.exit()
      .transition()
      .attr({
         'r': 0
      })
      .style({
        "fill": "maroon",
      })
      .remove();

    var textData=svg.selectAll("text") //gen an array of all circle element, possibly [] asdf
      .data(pieceData,function(d) { return(d.id); }); //bind data to elements
      //enter, if there isn't a circle matching a datapoint, add one
      textData.enter()
      .append("text")   //add new elements   vvvvvVVV
       .attr({
        "x" : enterXFunct,//function(d){return (0.5+d.x)*width/4;} ,
        "y" : enterYFunctText,//function(d){return (0.5+d.y)*height/4 +height/25;} ,
        "fill": "navy",
        "font-family": "sans-serif",
        "font-size": "50px",
        "text-anchor": 'middle',
        'vertical-align': 'text-bottom'
      })
      .text(function(d){return d.value});
      //applies transitions to both the newly added and old/updated circles
      textData.transition()
      .ease("bounce")
      .attr({

        "x" : function(d){return (0.5+d.x)*width/4;} ,
        "y" : function(d){return (0.5+d.y)*height/4 +height/25;},
      })
      .text(function(d){return d.value})
      .delay(animLag)
      .duration(animDur) ;
      //remove and animate exiting circles
      textData.exit()
      .transition()
      .attr({
         "font-size": "2px",
      })
      .remove();
  },
  drawBackgroundGrid: function(){
    //preview image
    previewSvg
      .append("rect")
      .attr({
        "x" : width/40,
        "y" : height/40,
        "rx" : width/40,
        "ry" : height/40,
        "width" : width/4-width/20,
        "height" : height/4-height/20,
        "fill" : colorPal.greenTea
      });
    //main svg
    var grid = d3.range(16);
    var indices=_.map(grid,function(val){
      return {x: Math.floor(val/4), y: val%4};
    });
    console.log(svg.selectAll("rect").data(indices).enter());
    svg.selectAll("rect")
      .data(indices)
      .enter()
      .append("rect")
      .attr({
        "x" : function(d){ return width/40+d.x*width/4 ; } ,
        "y" : function(d){ return height/40+d.y*height/4 ; } ,
        "rx" : width/40,
        "ry" : height/40,
        "width" : width/4-width/20,
        "height" : height/4-height/20,
        "fill" : colorPal.greenTea
      });
  },
  updatePreviewImage:function(){
    //the circle
    var oldCirc= previewSvg
      .select("circle");
    if(oldCirc)
      oldCirc
      .transition()
      .ease("bounce")
      .attr({
        "cx" : width/8,
        "cy" : height*3/8,
      })
      .duration(animDur)
      .remove();
    if(nextPieceValue>0){
      previewSvg
        .append("circle")
        .attr({
          "cx" : width/8,
          "cy" : -height/8,
          "r"  : 40
        })
        .style({
          "fill": "steelblue"
        })
        .transition()
        .ease("bounce")
        .attr({
          "cx" : width/8,
          "cy" : height/8,
        })
        .duration(animDur);
    }
    //the text/////
    var oldText= previewSvg
      .select("text");
    if(oldText)
      oldText
      .transition()
      .ease("bounce")
      .attr({
        "x" : width/8,
        "y" : height*3/8+height/25,
      })
      .duration(animDur)
      .remove();
    if(nextPieceValue>0){
      previewSvg
        .append("text")
        .text(nextPieceValue)
        .attr({
          "x" : width/8,
          "y" : -height/8+height/25,
          "fill": "navy",
          "font-family": "sans-serif",
          "font-size": "50px",
          "text-anchor": 'middle',
          'vertical-align': 'text-bottom'
        })
        .transition()
        .ease("bounce")
        .attr({
          "x" : width/8,
          "y" : height/8+height/25,
        })
        .duration(animDur+animLag);
    }
  },
  addPiece: function(dx,dy){

    //add a new piece
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
        if(dx===-1) { newX=3;  newY=freeCoord}
        else if(dx===1) { newX=0;  newY=freeCoord}
        else if(dy===-1) { newY=3;  newX=freeCoord}
        else if(dy===1) { newY=0;  newX=freeCoord}
      }
    }while(_.find(pieceData,function(item){
      return (item.x===newX && item.y===newY);
    }) );
    /*var newValue =  Math.floor( (Math.random()*3)+1); //[1,3]
    if (newValue ===3){
      if( topNumber >=48 ){ //the highest number tile
        if( Math.random<0.2)
          newValue = topNumber/8; // ie 48/8=6, 96/8=12 192/8= 24  (the acutal top value for a NEW tile)
      }
    }*/
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
  genNextPieceValue : function(){
    nextPieceValue =  Math.floor( (Math.random()*3)+1); //[1,3]
    if (nextPieceValue ===3){
      if( topNumber >=48 ){ //the highest number tile
        if( Math.random<0.2)
          nextPieceValue = topNumber/8; // ie 48/8=6, 96/8=12 192/8= 24  (the acutal top value for a NEW tile)
      }
    }

  },
  //only used for initialization the starting pieces = now
  addRandomPiece: function(newVal){
    newVal= newVal || Math.floor( (Math.random()*3)+1);//[1,3]
    //add a new piece
    var newX,
      newY;
    do{
      newX=Math.floor(Math.random()*4),
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
  isAnyMovePossible:function(){
    //return pieceData.length<16;
    var gameOn= !!threes.utils.canMoveInDir(0,1) ||
      !!threes.utils.canMoveInDir(0,-1) ||
      !!threes.utils.canMoveInDir(1,0) ||
      !!threes.utils.canMoveInDir(-1,0);
    if(!gameOn){
      gameOver=true;
      setTimeout(function(){
        console.log("GAME OVER");
        svg
        .append("text")   //add new elements   vvvvvVVV
         .attr({
          "x" : 200,//function(d){return (0.5+d.x)*width/4;} ,
          "y" : 200,//function(d){return (0.5+d.y)*height/4 +height/25;} ,
          "fill": "navy",
          "font-family": "sans-serif",
          "font-size": "10px",
          "text-anchor": 'middle',
          'vertical-align': 'text-bottom'
        })
        .text("Game Over")
        .transition()
        .attr({
          "font-size": "60px",
        })
        .duration(animDur) ;
      },animDur);//wait until after the new pieces are added
    }
    return gameOn;
  },
  canMoveInDir:function(dx,dy){
    var moveArray=threes.utils.moveInDirArray(dx,dy);
    var itemThatCanMove=_.find(moveArray,function(item){
      return item.canMove===true;
    });
    return !!itemThatCanMove;
  },
  moveInDirArray:function(dx,dy,piecesToRemove){ //3rd arguement is optional

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
                 piece.value*=2;
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
      return true
    }
  },
  smartMove: function(dx,dy){
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
    })

    //threes.utils.updateAndAddPieces(pieceData);

    //delete merged pieces
    pieceData=_.filter(pieceData,function(piece){
      var onRemList = _.find(piecesToRemove,function(remPiece){
        return remPiece.id===piece.id;
      });
      console.log(onRemList);
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
  },
  moveAll: function(dx,dy){
    _.forEach(pieceData, function(piece){
      piece.x+=dx;
      piece.y+=dy;
    });
    threes.utils.addPiece(dx,dy);
    threes.utils.updateAndAddPieces();
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




