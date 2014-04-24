
var highScoreManager={
  highScores:[], 
  lastScore:{name:"",score:0},
};

highScoreManager.utils={
  getHighScoresFromCookies: function(){
    var cookieVal = $.cookie("highScoreData") ;
    if(cookieVal)
      highScoreManager.highScores= JSON.parse(cookieVal);
    else
      highScoreManager.highScores=[];
    for(var i=highScoreManager.highScores.length;i<10;i++) // put in dummy data
      highScoreManager.highScores.push( {name:"Alexander White",score:10-i} );
    console.log("get");
    console.log(JSON.stringify(highScoreManager.highScores));
  },
  saveScoreToCookies: function( newScore ){
    highScoreManager.utils.getHighScoresFromCookies();
    highScoreManager.highScores.push(newScore);
    highScoreManager.highScores=_.sortBy(highScoreManager.highScores,function(scoreObj){return -1*scoreObj.score;});

    $.cookie("highScoreData", JSON.stringify( highScoreManager.highScores),{expires:365});
  },
  resetScores:function(){
    $.cookie("highScoreData",[],{expires:365});
    $.cookie("lastHighScoreName","The Yellow King",{expires:365});
  },
  checkIfHighScore:function( newScore ){
    highScoreManager.utils.getHighScoresFromCookies();
    var ranking=_.reduce(highScoreManager.highScores,function(memo,highScoreObject){
      if(newScore.score>highScoreObject.score)
        return memo;
      else
        return memo+1;
    },0); 
    console.log("Score rank ",ranking,ranking<10);
    return ranking<10;
  },
  insertHighScoresIntoDOM:function(){

    highScoreManager.utils.getHighScoresFromCookies();
    $("#highScoreDiv").empty();
    for(var i=0;i<10;i++){
      var hs = highScoreManager.highScores[i];
      $("#highScoreDiv").append("<p>"+hs.name + " : " +hs.score +"</p>" );
    }
  },
  goToHighScoreEntryPage:function(){
    var lastUser = $.cookie("lastHighScoreName");
    if(!lastUser)
      lastUser="The Yellow King";
    $("#highScoreNameInput").attr("placeholder", lastUser);
    //$.mobile.navigate( "#enterName" );
    $("#enterDialog").click();
  },
  goToHighScoresPage:function(){
    //refresh high scores from coookie
    highScoreManager.utils.insertHighScoresIntoDOM();
    //navigate to page
    $.mobile.navigate( "#highscores" );
  },
  enteringNewHighScore:function(){
    var userName=$("#highScoreNameInput").val();
    console.log("userName");
     console.log(userName);
    if(userName==="")
      userName=$("#highScoreNameInput").attr("placeholder");
    $.cookie("lastHighScoreName",userName,{expires:365});
    var newHighScore={
      name:userName,
      score:threes.metaGameManager.finalScore,
    };
    highScoreManager.utils.saveScoreToCookies(newHighScore);
    highScoreManager.utils.insertHighScoresIntoDOM();
  },

  
    
};