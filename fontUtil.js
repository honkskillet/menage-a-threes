//UTILITY, put in another file
String.prototype.width = function(font) {
  var f = font || '12pt arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
};


var fontLookup = [];
//console.log("For string '3' width 50 px use console.log(val); point "+getFontPoint("3", "Lobster", 50, 200 ));
//console.log("For string '3' width 50 px use console.log(val); point "+getFontPoint("3", "Lobster", 50, 200 ));
//console.log("For string '3' width 75 px use console.log(val); point "+getFontPoint("3", "Lobster", 75, 200 ));
//console.log("For string '3' width 100 px use console.log(val); point "+getFontPoint("3", "Lobster", 100,200 ));

///helpfer function
//get width of text string for a given string 
function getFontPoint( text, font, maxWidth,maxPoint){
  var lookupVal=_.find(fontLookup , function(item){
    return item.text===text && item.font === font && item.maxWidth===maxWidth && item.maxPoint===maxPoint;
  });
  if(lookupVal){
    //console.log("Font lookup found: " +JSON.stringify(lookupVal ));
    return lookupVal.fontPoint;
  }
                      
  var retVal=_.chain( _.range(1,maxPoint+1,3) )  //sets up chaining
  .map(function(item){
    //console.log(item,String(text).width(item+"pt "+font));
    return { fontPoint: item, textWidth: String(text).width(item+"pt "+font)};
  })
  .filter(function(item){
    return (item.textWidth < maxWidth) ;
  })
  .last()
  .value()
  .fontPoint;
  retVal = retVal<maxPoint ? retVal : maxPoint;
  fontLookup.push({text:text, font:font, maxWidth:maxWidth, maxPoint:maxPoint, fontPoint:retVal});
 // console.log("Font lookup recorded: " +JSON.stringify(retVal ));
  return retVal;
  
}

