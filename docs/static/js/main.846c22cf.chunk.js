(this["webpackJsonpwebgl-vj-generative"]=this["webpackJsonpwebgl-vj-generative"]||[]).push([[0],{100:function(e,t,n){"use strict";n.r(t);var o=n(1),i=n(0),r=n.n(i),a=n(23),s=n.n(a),c=(n(97),n(8)),u=n(9),l=n(12),h=n(11);n.p;n.p,n(98);for(var m=n(10),d=n(2),f=function(e){Object(l.a)(n,e);var t=Object(h.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).svgRef=r.a.createRef(),o.bitRate=4,o.geneSize=64,o.bits=d.b(o.bitRate*o.geneSize).map((function(e){return Math.random()>.5?1:0})),console.log(o.props,"props"),o.convertBits=o.convertBits.bind(Object(m.a)(o)),console.log(d.a),o}return Object(u.a)(n,[{key:"convertBits",value:function(){for(var e=this,t=[],n=function(n){var o=d.b(e.bitRate).map((function(t){return e.bits[n+t]}));t.push(parseInt(o.join(""),2))},o=0;o<this.geneSize*this.bitRate;o+=this.bitRate)n(o);return console.log("bytes",t),t}},{key:"componentDidMount",value:function(){var e=this;console.log("interface mounted");var t=d.c(this.svgRef.current).attr("viewBox","-5 -5 110 110").attr("width",.8*window.innerHeight),n=Math.floor(Math.sqrt(this.bits.length)),o=100/n,i=t.append("g"),r=d.a(),a=[];r.on("drag",(function(t){console.log("drag event",t.x,t.y);var r=Math.floor(t.x/o),s=Math.floor(t.y/o),c=s*n+r;console.log(r,s),a[a.length-1]!==c&&(a.push(c),1===e.bits[c]?e.bits[c]=0:e.bits[c]=1,i.select("rect#_"+c).attr("fill",1===e.bits[c]?"white":"black"),e.props.fns.setDNA({data:e.convertBits()}),window.shaderInit(e.props.fns.generateFragmentShader()))})),r.on("start",(function(e){a=[],console.log("DRAG START")})),i.call(r);var s=0,c=0;this.bits.forEach((function(e,t){c=Math.floor(t/n),s=t-c*n;var r=i.append("rect").attr("id","_"+t).attr("x",s*o).attr("y",c*o).attr("width",o).attr("height",o).attr("fill",1===e?"white":"black");r.on("click",(function(){})),(s+=1)>n&&(c+=1,s=0)})),setTimeout((function(){e.props.fns.setDNA({data:e.convertBits()}),window.shaderInit(e.props.fns.generateFragmentShader())}),10)}},{key:"render",value:function(){return Object(o.jsx)("div",{style:{position:"absolute",top:0,left:0,opacity:.3,backgroundColor:"rgba(0,0,0,0)",width:"100%"},children:Object(o.jsx)("svg",{ref:this.svgRef})})}}]),n}(r.a.Component),g=120,p=0,v=[],b=0;b<180;b++)v.push(Math.floor(12*Math.random()));var R=[{name:"",args:1},{name:"sin",args:1},{name:"cos",args:1},{name:"tan",args:1},{name:"abs",args:1},{name:"fract",args:1}],w=[{name:"+="},{name:"-="},{name:"*="},{name:"="}],T=[{name:"*"},{name:"+"},{name:"-"},{name:"/"}],A=[{name:"red"},{name:"green"},{name:"blue"},{name:"timeMulti"}],F=[{name:"position.x"},{name:"position.y"},{name:"time"},{name:"time2"},{name:"time*timeMulti"},{name:"time/timeMulti"},{name:"distanceToCenter"},{name:"distanceToBottomLeft"},{name:"distanceToBottomRight"},{name:"distanceToTopLeft"},{name:"distanceToTopRight"},{name:"red"},{name:"green"},{name:"blue"}];function S(){var e=v[p];p++,p%=v.length;var t=v[p];p++,p%=v.length;var n=v[p];p++,p%=v.length;var o=v[p]%6+1;o%2===0&&(o+=1),p++,p%=v.length;for(var i=[],r=0;r<o;r++)i.push(v[p]),p++,p%=v.length;return[_(A,e).name,_(w,t).name,_(R,n).name+"(",x(i),");"].join(" ")}function x(e){for(var t=[];e.length>0;)e.length>=2?t.push([_(F,e.pop()).name,_(T,e.pop()).name].join(" ")):t.push(_(F,e.pop()).name);return t.join(" ")}function _(e,t){return e[t%e.length]}function j(){var e=[];e.push("uniform float time;"),e.push("uniform vec2 resolution;"),e.push("void main ( void ) {"),e.push("vec2 position = - 1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;"),e.push("vec2 centerPosition = vec2(resolution.x*0.5, resolution.y*0.5);"),e.push("float distanceToCenter = (1.0/resolution.x) * 3.14 * distance(gl_FragCoord.xy, centerPosition);"),e.push("float distanceToTopLeft = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(0,0));"),e.push("float distanceToTopRight = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(resolution.x,0));"),e.push("float distanceToBottomLeft = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(0,resolution.y));"),e.push("float distanceToBottomRight = (1.0/resolution.x) * distance(gl_FragCoord.xy, resolution.xy);"),e.push("float timeMulti = 0.0;"),e.push("float time2 = time * 0.1;"),e.push("float red = 0.0;"),e.push("float green = 0.0;"),e.push("float blue = 0.0;");for(var t=0;t<g;t++)e.push(S());e.push("gl_FragColor = vec4( red, green, blue, 1.0 );"),e.push("}");var n=[];return e.forEach((function(e,t){n.push([t,e].join("\t"))})),e.join("\n")}function E(e){v=[],p=0,e.data.forEach((function(e){v.push(e)}))}var y=function(e){Object(l.a)(n,e);var t=Object(h.a)(n);function n(e){return Object(c.a)(this,n),t.call(this,e)}return Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=0;window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,1e3/60)};var t,n,o,i,r,a,s,c,u={start_time:(new Date).getTime(),time:0,screenWidth:0,screenHeight:0};function l(e){"\n\nattribute vec3 position;\nvoid main() {\n  gl_Position = vec4( position, 1.0 );\n}\n",i=e,t=document.querySelector("canvas");try{n=t.getContext("experimental-webgl")}catch(a){}if(!n)throw"cannot create webgl context";o=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),n.STATIC_DRAW),r=function(e,t){var o=n.createProgram(),i=h(e,n.VERTEX_SHADER),r=h("#ifdef GL_ES\nprecision highp float;\n#endif\n\n"+t,n.FRAGMENT_SHADER);if(null==i||null==r)return console.log(i,r),null;if(console.log(i),n.attachShader(o,i),n.attachShader(o,r),n.deleteShader(i),n.deleteShader(r),n.linkProgram(o),!n.getProgramParameter(o,n.LINK_STATUS))return alert("ERROR:\nVALIDATE_STATUS: "+n.getProgramParameter(o,n.VALIDATE_STATUS)+"\nERROR: "+n.getError()+"\n\n- Vertex Shader -\n"+e+"\n\n- Fragment Shader -\n"+t),null;return o}("\n\nattribute vec3 position;\nvoid main() {\n  gl_Position = vec4( position, 1.0 );\n}\n",i),u.start_time=(new Date).getTime(),s=n.getUniformLocation(r,"time"),c=n.getUniformLocation(r,"resolution")}function h(e,t){var o=n.createShader(t);return n.shaderSource(o,e),n.compileShader(o),n.getShaderParameter(o,n.COMPILE_STATUS)?o:(alert((t==n.VERTEX_SHADER?"VERTEX":"FRAGMENT")+" SHADER:\n"+n.getShaderInfoLog(o)),null)}l("\n\nuniform float time;\nuniform float time2;\nuniform vec2 resolution; \nvoid main( void ) { \n  gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n} \n"),function i(){void(t.width==t.clientWidth&&t.height==t.clientHeight||(t.width=t.clientWidth,t.height=t.clientHeight,u.screenWidth=t.width,u.screenHeight=t.height,n.viewport(0,0,t.width,t.height))),function(){if(!r)return;u.time=(new Date).getTime()-u.start_time,n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.useProgram(r),n.uniform1f(s,u.time/1e3),n.uniform2f(c,u.screenWidth,u.screenHeight),n.bindBuffer(n.ARRAY_BUFFER,o),n.vertexAttribPointer(a,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(a),n.drawArrays(n.TRIANGLES,0,6),n.disableVertexAttribArray(a)}(),(e+=1)>3e9&&(e=0,E({data:d.b(128).map((function(e){return Math.floor(12*Math.random())}))}),l(j()),u.start_time=(new Date).getTime());requestAnimationFrame(i)}(),window.shaderInit=l}},{key:"render",value:function(){return Object(o.jsxs)("div",{className:"App",children:[Object(o.jsx)("canvas",{}),Object(o.jsx)(f,{fns:{generateFragmentShader:j,setDNA:E,shaderInit:undefined}})]})}}]),n}(r.a.Component),B=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,101)).then((function(t){var n=t.getCLS,o=t.getFID,i=t.getFCP,r=t.getLCP,a=t.getTTFB;n(e),o(e),i(e),r(e),a(e)}))};s.a.render(Object(o.jsx)(r.a.StrictMode,{children:Object(o.jsx)(y,{})}),document.getElementById("root")),B()},97:function(e,t,n){},98:function(e,t,n){}},[[100,1,2]]]);
//# sourceMappingURL=main.846c22cf.chunk.js.map