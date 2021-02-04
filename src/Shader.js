import React from 'react'

import { 
  Box, Button, 
  ButtonGroup,
  TextField, Typography, 
  Card, CardHeader, CardContent,
  Container,
  Grid
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser, faFileAlt, faUserPlus, faUserEdit, faUsers } from '@fortawesome/free-solid-svg-icons'

import * as d3 from 'd3'

let shaderInit 

const vertexShader = `

attribute vec3 position;
void main() {
  gl_Position = vec4( position, 1.0 );
}
`

const emptyFragmentShader = `

uniform float time;
uniform float time2;
uniform vec2 resolution; 
void main( void ) { 
  gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );
} 
`

let init 

class Shader extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      controlsAreConnected: false
    }

    this.controlsChannel = new BroadcastChannel('controls')


  }

  componentDidMount () {
    
    this.controlsChannel.onmessage = (msg) => {
      console.log('got a controls message')
      // console.log(msg)

      if(this.state.controlsAreConnected === false) {
        this.setState({controlsAreConnected: true})
      }

      if(msg.data.key === 'shader-lines') {
        // console.log(msg.data)
        init(msg.data.value)
      }

    }    

    let counter = 0
    window.requestAnimationFrame = window.requestAnimationFrame || ( function() {

      return  window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function(  callback, element ) {
                window.setTimeout( callback, 1000 / 60 );
              };

    })();

    var canvas, 
        gl, 
        buffer, 
        vertex_shader, fragment_shader, 
        currentProgram,
        vertex_position,
        timeLocation,
        resolutionLocation,
        parameters = {  start_time  : new Date().getTime(), 
                        time        : 0, 
                        screenWidth : 0, 
                        screenHeight: 0 };

    init = function (fragmentShader) {

      // console.log(fragmentShader)

      vertex_shader = vertexShader
      fragment_shader = fragmentShader

      canvas = document.querySelector( 'canvas' );

      // Initialise WebGL

      try {

        gl = canvas.getContext( 'experimental-webgl' );

      } catch( error ) { }

      if ( !gl ) {

        throw "cannot create webgl context";

      }

      // Create Vertex buffer (2 triangles)

      buffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl.STATIC_DRAW );

      // Create Program

      currentProgram = createProgram( vertex_shader, fragment_shader );
      parameters.start_time = new Date().getTime()
      timeLocation = gl.getUniformLocation( currentProgram, 'time' );
      resolutionLocation = gl.getUniformLocation( currentProgram, 'resolution' );

    }

    window.shaderInit = init

    init(emptyFragmentShader);
    animate();

    function createProgram( vertex, fragment ) {

      var program = gl.createProgram();

      var vs = createShader( vertex, gl.VERTEX_SHADER );
      var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );

      if ( vs == null || fs == null ) { 
        console.log(vs,fs)
        return null;
      }

      // console.log(vs)

      gl.attachShader( program, vs );
      gl.attachShader( program, fs );

      gl.deleteShader( vs );
      gl.deleteShader( fs );

      gl.linkProgram( program );

      if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {

        alert( "ERROR:\n" +
        "VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
        "ERROR: " + gl.getError() + "\n\n" +
        "- Vertex Shader -\n" + vertex + "\n\n" +
        "- Fragment Shader -\n" + fragment );

        return null;

      }

      return program;

    }

    function createShader( src, type ) {

      var shader = gl.createShader( type );

      gl.shaderSource( shader, src );
      gl.compileShader( shader );

      if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

        alert( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
        return null;

      }

      return shader;

    }

    function resizeCanvas( event ) {

      if ( canvas.width != canvas.clientWidth ||
         canvas.height != canvas.clientHeight ) {

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        parameters.screenWidth = canvas.width;
        parameters.screenHeight = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );

      }

    }

    function animate() {

      resizeCanvas();      
      render();

      // counter += 1
      // if(counter > 3000000000) {
      //   counter = 0
      //   setDNA({data: d3.range(128).map(o=>{return Math.floor(Math.random()*12)}) })
      //   init(generateFragmentShader())
      //   parameters.start_time = new Date().getTime()
      // }

      requestAnimationFrame( animate );

    }

    function render() {
      
      if ( !currentProgram ) return;

      parameters.time = new Date().getTime() - parameters.start_time;

      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

      // Load program into GPU

      gl.useProgram( currentProgram );

      // Set values to program variables

      gl.uniform1f( timeLocation, parameters.time / 1000 );
      gl.uniform2f( resolutionLocation, parameters.screenWidth, parameters.screenHeight );

      // Render geometry

      gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
      gl.vertexAttribPointer( vertex_position, 2, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( vertex_position );
      gl.drawArrays( gl.TRIANGLES, 0, 6 );
      gl.disableVertexAttribArray( vertex_position );

    }    
  }

  render () {
    return (
      <div className="App">
         <canvas></canvas>
         <div style={{ display: this.state.controlsAreConnected ? 'none' : null,  position: 'absolute', top: 0, left: 0}}>
           <Box>
            <Button onClick={()=>{ window.open('/generative-vj/#/controls' )}}>LAUNCH CONTROLS</Button>
           </Box>
          </div>
      </div>
    );
  }

}


export default Shader