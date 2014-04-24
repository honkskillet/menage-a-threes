!function(){
  var icons=[
    {
      font: "FontAwesome",
      fontSize: "70px",
       fill: colorPal.tealLite,
      stroke: colorPal.teal,
      text: "\uf182"
    },
    {
      font: "Lobster,cursive",
      fontSize: "80px",
      fill: colorPal.purpleLite,
      stroke: colorPal.purple,
      text: "+",
    },
    {
      font: "FontAwesome",
      fontSize: "70px",
      fill: colorPal.tealLite,
      stroke: colorPal.teal,
      text: "\uf183"
    },
    {
      font: "Lobster,cursive",
      fontSize: "80px",
      fill: colorPal.purpleLite,
      stroke: colorPal.purple,
      text: "+",
    },
    {
      font: "FontAwesome",
      fontSize: "70px",
       fill: colorPal.tealLite,
      stroke: colorPal.teal,
      text: "\uf182"
    },
    {
      font: "Lobster,cursive",
      fontSize: "80px",
      fill: colorPal.purpleLite,
      stroke: colorPal.purple,
      text: "=",
    },
    {
      font: "FontAwesome",
      fontSize: "70px",
      fill: colorPal.pinkLite,
      stroke: colorPal.pink,
      text: "\uf004"
    },
  ];


  var pieceG_Data=d3.select("#loveSVG")
    .selectAll("text") //gen an array of all circle element, possibly []
    .data(icons) //bind data to elements
    .enter()
    .append("text") //set initial icon values
      .attr({
        "font-family": function(d){return d.font;},
        "font-size" : function(d){return d.fontSize;},
        "x" : function(d,i){return 35+i*60;},
        "y" : 60,
        "dy" :".33em",
        "text-anchor": "middle",
        "fill":    function(d){return d.fill;},
        "stroke":  function(d){return d.stroke;},
        "stroke-width": 4 ,
      })
      .style({
        //"filter" :"url(#dropShadowPurpleFilter)" ,
      })
      .text(function(d){ return d.text; });

}();