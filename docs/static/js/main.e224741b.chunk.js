(this["webpackJsonpwebgl-vj-generative"]=this["webpackJsonpwebgl-vj-generative"]||[]).push([[0],{100:function(e,t,n){"use strict";n.r(t);var i=n(0),r=n(1),o=n.n(r),a=n(23),s=n.n(a),c=(n(97),n(8)),u=n(9),l=n(12),h=n(11);n.p;n.p,n(98);for(var d=n(10),g=n(2),m=function(e){Object(l.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(c.a)(this,n),(i=t.call(this,e)).svgRef=o.a.createRef(),i.state={shaderLines:"",matchingCodeLines:[]},i.bitRate=4,i.geneSize=128,i.bits=g.b(i.bitRate*i.geneSize).map((function(e){return Math.random()>.5?1:0})),i.convertBits=i.convertBits.bind(Object(d.a)(i)),i}return Object(u.a)(n,[{key:"convertBits",value:function(){for(var e=this,t=[],n=function(n){var i=g.b(e.bitRate).map((function(t){return e.bits[n+t]}));t.push(parseInt(i.join(""),2))},i=0;i<this.geneSize*this.bitRate;i+=this.bitRate)n(i);return t}},{key:"componentDidMount",value:function(){var e=this;console.log("interface mounted");var t=g.c(this.svgRef.current).attr("viewBox","-5 -5 110 110").attr("width",.8*window.innerHeight),n=Math.floor(Math.sqrt(this.bits.length)),i=100/n,r=t.append("g"),o=g.a(),a=[];o.on("drag",(function(t){var o=Math.floor(t.x/i),s=Math.floor(t.y/i)*n+o;a[a.length-1]!==s&&(a.push(s),1===e.bits[s]?e.bits[s]=0:e.bits[s]=1,r.select("rect#_"+s).attr("fill",1===e.bits[s]?"white":"black"),e.props.fns.setDNA({data:e.convertBits()}),window.shaderInit(e.props.fns.generateFragmentShader()),e.setState({shaderLines:e.props.fns.generateFragmentShader()}))})),o.on("start",(function(e){a=[]})),r.call(o);var s=0,c=0;this.bits.forEach((function(t,o){c=Math.floor(o/n),s=o-c*n;var a=r.append("rect").attr("id","_"+o).attr("x",s*i).attr("y",c*i).attr("width",i).attr("height",i).attr("fill",1===t?"white":"black");a.on("mouseover",(function(){var t=Math.floor(o/e.bitRate);console.log("Gene index",t);var n=e.props.fns.getLineMetaData().map((function(e,t){return e.idx=t,e}));console.log(n);var i=n.filter((function(e){return t>=e.begin&&t<=e.end}));console.log(i),e.setState({matchingCodeLines:i.map((function(e){return e.idx}))})})),a.on("click",(function(){})),(s+=1)>n&&(c+=1,s=0)})),setTimeout((function(){e.props.fns.setDNA({data:e.convertBits()}),window.shaderInit(e.props.fns.generateFragmentShader()),e.setState({shaderLines:e.props.fns.generateFragmentShader()})}),10)}},{key:"render",value:function(){var e=this,t=this.props.fns.getLineMetaData(),n=this.state.shaderLines.split("\n").map((function(n,r){return Object(i.jsx)("div",{onMouseOver:function(){e.setState({matchingCodeLines:[r]}),g.c(e.svgRef.current).selectAll("rect").attr("stroke","none");var n=t[r-t.lineBegin];console.log(n),void 0!==n&&(n.end>n.begin?g.b(n.end-n.begin).forEach((function(t){g.c(e.svgRef.current).select("rect#_"+t+n.begin).attr("stroke","orange")})):console.log("wrap around issue"),r>=t.lineBegin&&console.log(t[r-t.lineBegin]))},style:{outline:-1!==e.state.matchingCodeLines.indexOf(r-t.lineBegin)?"1px solid white":null},children:n})}));return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)("div",{style:{position:"absolute",top:0,left:0,opacity:.3,backgroundColor:"rgba(0,0,0,0)",width:"100%"},children:Object(i.jsx)("svg",{ref:this.svgRef})}),Object(i.jsx)("div",{style:{position:"absolute",top:0,right:0,opacity:1,backgroundColor:"rgba(0,0,0,0)",width:"50%"},children:Object(i.jsx)("div",{style:{color:"white",fontFamily:"monospace",whiteSpace:"nowrap"},children:n})})]})}}]),n}(o.a.Component),f=24,p=0,v=[],b=[],w=0;w<256;w++)v.push(Math.floor(12*Math.random()));var R=[{name:"",args:1},{name:"sin",args:1},{name:"cos",args:1},{name:"abs",args:1},{name:"fract",args:1}],T=[{name:"+="},{name:"-="},{name:"*="}],A=[{name:"*"},{name:"+"},{name:"-"},{name:"/"}],x=[{name:"red"},{name:"green"},{name:"blue"},{name:"timeMulti"}],S=[{name:"position.x"},{name:"position.y"},{name:"time"},{name:"time2"},{name:"time*timeMulti"},{name:"time/timeMulti"},{name:"distanceToCenter"},{name:"distanceToBottomLeft"},{name:"distanceToBottomRight"},{name:"distanceToTopLeft"},{name:"distanceToTopRight"},{name:"red"},{name:"green"},{name:"blue"}];function F(){var e={begin:p,end:-1},t=v[p];p++,p%=v.length;var n=v[p];p++,p%=v.length;var i=v[p];p++,p%=v.length;var r=v[p]%6+1;r%2===0&&(r+=1),p++,p%=v.length;for(var o=[],a=0;a<r;a++)o.push(v[p]),p++,e.end=p-1,p%=v.length;return b.push(e),[_(x,t).name,_(T,n).name,_(R,i).name+"(",j(o),");"].join(" ")}function j(e){for(var t=[];e.length>0;)e.length>=2?t.push([_(S,e.pop()).name,_(A,e.pop()).name].join(" ")):t.push(_(S,e.pop()).name);return t.join(" ")}function _(e,t){return e[t%e.length]}function y(){p=0,b=[];var e=[];e.push("uniform float time;"),e.push("uniform vec2 resolution;"),e.push("void main ( void ) {"),e.push("vec2 position = - 1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;"),e.push("vec2 centerPosition = vec2(resolution.x*0.5, resolution.y*0.5);"),e.push("float distanceToCenter = (1.0/resolution.x) * 3.14 * distance(gl_FragCoord.xy, centerPosition);"),e.push("float distanceToTopLeft = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(0,0));"),e.push("float distanceToTopRight = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(resolution.x,0));"),e.push("float distanceToBottomLeft = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(0,resolution.y));"),e.push("float distanceToBottomRight = (1.0/resolution.x) * distance(gl_FragCoord.xy, resolution.xy);"),e.push("float timeMulti = 0.0;"),e.push("float time2 = time * 0.1;"),e.push("float red = 0.0;"),e.push("float green = 0.0;"),e.push("float blue = 0.0;"),b.lineBegin=e.length;for(var t=0;t<f;t++)e.push(F());e.push("gl_FragColor = vec4( red, green, blue, 1.0 );"),e.push("}");var n=[];return e.forEach((function(e,t){n.push([t,e].join("\t"))})),e.join("\n")}function E(e){v=[],p=0,e.data.forEach((function(e){v.push(e)}))}function L(){return b}var O=function(e){Object(l.a)(n,e);var t=Object(h.a)(n);function n(e){return Object(c.a)(this,n),t.call(this,e)}return Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=0;window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,1e3/60)};var t,n,i,r,o,a,s,c,u={start_time:(new Date).getTime(),time:0,screenWidth:0,screenHeight:0};function l(e){"\n\nattribute vec3 position;\nvoid main() {\n  gl_Position = vec4( position, 1.0 );\n}\n",r=e,t=document.querySelector("canvas");try{n=t.getContext("experimental-webgl")}catch(a){}if(!n)throw"cannot create webgl context";i=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),n.STATIC_DRAW),o=function(e,t){var i=n.createProgram(),r=h(e,n.VERTEX_SHADER),o=h("#ifdef GL_ES\nprecision highp float;\n#endif\n\n"+t,n.FRAGMENT_SHADER);if(null==r||null==o)return console.log(r,o),null;if(n.attachShader(i,r),n.attachShader(i,o),n.deleteShader(r),n.deleteShader(o),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))return alert("ERROR:\nVALIDATE_STATUS: "+n.getProgramParameter(i,n.VALIDATE_STATUS)+"\nERROR: "+n.getError()+"\n\n- Vertex Shader -\n"+e+"\n\n- Fragment Shader -\n"+t),null;return i}("\n\nattribute vec3 position;\nvoid main() {\n  gl_Position = vec4( position, 1.0 );\n}\n",r),u.start_time=(new Date).getTime(),s=n.getUniformLocation(o,"time"),c=n.getUniformLocation(o,"resolution")}function h(e,t){var i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),n.getShaderParameter(i,n.COMPILE_STATUS)?i:(alert((t==n.VERTEX_SHADER?"VERTEX":"FRAGMENT")+" SHADER:\n"+n.getShaderInfoLog(i)),null)}l("\n\nuniform float time;\nuniform float time2;\nuniform vec2 resolution; \nvoid main( void ) { \n  gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n} \n"),function r(){void(t.width==t.clientWidth&&t.height==t.clientHeight||(t.width=t.clientWidth,t.height=t.clientHeight,u.screenWidth=t.width,u.screenHeight=t.height,n.viewport(0,0,t.width,t.height))),function(){if(!o)return;u.time=(new Date).getTime()-u.start_time,n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.useProgram(o),n.uniform1f(s,u.time/1e3),n.uniform2f(c,u.screenWidth,u.screenHeight),n.bindBuffer(n.ARRAY_BUFFER,i),n.vertexAttribPointer(a,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(a),n.drawArrays(n.TRIANGLES,0,6),n.disableVertexAttribArray(a)}(),(e+=1)>3e9&&(e=0,E({data:g.b(128).map((function(e){return Math.floor(12*Math.random())}))}),l(y()),u.start_time=(new Date).getTime());requestAnimationFrame(r)}(),window.shaderInit=l}},{key:"render",value:function(){return Object(i.jsxs)("div",{className:"App",children:[Object(i.jsx)("canvas",{}),Object(i.jsx)(m,{fns:{generateFragmentShader:y,setDNA:E,shaderInit:undefined,getLineMetaData:L}})]})}}]),n}(o.a.Component),B=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,101)).then((function(t){var n=t.getCLS,i=t.getFID,r=t.getFCP,o=t.getLCP,a=t.getTTFB;n(e),i(e),r(e),o(e),a(e)}))};s.a.render(Object(i.jsx)(o.a.StrictMode,{children:Object(i.jsx)(O,{})}),document.getElementById("root")),B()},97:function(e,t,n){},98:function(e,t,n){}},[[100,1,2]]]);
//# sourceMappingURL=main.e224741b.chunk.js.map