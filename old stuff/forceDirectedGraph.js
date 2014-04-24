
var width = 320,
    height = 480;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-100)
    .linkDistance(50)
    .size([width, height]);

var svg = d3.select("#forceDirectedGraphDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

//d3.json("menuTree.json", function(error, graph) {
  graph=menuTreeObject;
  for(var i=0;i<4;i++){
    graph.nodes[i].x=width/2;
    graph.nodes[i].y=height*3/12+i*height/6;
  }
  graph.nodes[20].x=width*3/16;
  graph.nodes[20].y=height*3/12;
  graph.nodes[20].fixed=true;
  graph.nodes[11].x=width*13/16;
  graph.nodes[11].y=height*3/12;
  graph.nodes[11].fixed=true;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter()
      .append("a")
      .attr({
        //"xmlns":"http://www.w3.org/2000/svg",
        "xlink:href": function(d){return d.group===1 ? "#continent" : "";},
        "data-transition":"slide",
      })
      .append("text")
      .attr({
        //"pointer-events": "none",
        "class":"node",
        "dy":".33em",
        "fill": colorPal.yellow,
        "stroke" : colorPal.grayDark,
        "stroke-width" : function(d){return d.group===1 ? 2 : 1;},
        "font-family": function(d){return d.group===1 ? "Lobster,cursive" : "FontAwesome";},
        "font-size": function(d){return d.group===1 ? "40px" : "20px";},
        "text-anchor": 'middle',
        //"font-family": "FontAwesome",
      })
      .style({
        "fill": function(d){ 
          if(d.group===2)
            return colorPal.pinkLite;
          if(d.group===3)
            return colorPal.tealLite;
          if(d.group===4)
            return colorPal.purpleLite;
          return colorPal.yellow;
        },
        "stroke": function(d){ 
          if(d.group===2)
            return colorPal.pink;
          if(d.group===3)
            return colorPal.teal;
          if(d.group===4)
            return colorPal.purple;
          return colorPal.grayDark;
        },
      })
      .text(function(d){ 
        if(d.group===4)
          return "\uf182";
        if(d.group===3)
          return "\uf183";
        if(d.group===2)
          return "\uf004";
        return d.name;
      })
      .call(force.drag);

//  node.append("title")
//      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("x", function(d,i) { return d.x; })
        .attr("y", function(d,i) { return d.y; });
  });
//});