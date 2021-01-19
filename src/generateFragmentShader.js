const compoundArgumentsLength = 2

const functions = [
  { name: 'sin', args: 1 },
  { name: 'cos', args: 1 },
  // { name: 'tan', args: 1 },
  { name: 'abs', args: 1 },
  { name: 'fract', args: 1 }
]

const operatorsAssign = [
  { name: '=' },
  { name: '+=' },
  { name: '-=' },
  { name: '*=' },
  // { name: '/=' }
]

const operatorsSimple = [
  { name: '*' },
  { name: '+' },
  { name: '-' },
  { name: '/' }
]

const values = [
  { name: 'red' },
  { name: 'green' },
  { name: 'blue' },
  { name: 'timeMulti' },
]

const constantValues = [
  { name: 'position.x' },
  { name: 'position.y' },
  { name: 'time' },
  { name: 'time*timeMulti' },
  { name: 'time/timeMulti' },
  { name: 'distanceToCenter' },
  { name: 'distanceToBottomLeft' },
  { name: 'distanceToBottomRight' },
  { name: 'distanceToTopLeft' },
  { name: 'distanceToTopRight' },
  { name: 'red' },
  { name: 'green' },
  { name: 'blue' },
]

function createLine() {
  return [
    r(values).name,
    r(operatorsAssign).name,
    r(functions).name + '(',
    createCompoundValue(1+Math.floor(Math.random()*compoundArgumentsLength)),
    ');'
  ].join(' ')
}

function createCompoundValue(n) {
  const values = []
  for(let i = 0; i < n; i++) {
    if(i !== n-1) {
      values.push([r(constantValues).name, r(operatorsSimple).name].join(' '))
    } else {
      values.push(r(constantValues).name)
    }    
  }
  return values.join(' ')
}

function r(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

export default function () {

  console.log(createLine())

  const lines = []
  lines.push('uniform float time;')
  lines.push('uniform vec2 resolution;')
  lines.push('void main ( void ) {')
  lines.push('vec2 position = - 1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;')
  lines.push('vec2 centerPosition = vec2(resolution.x*0.5, resolution.y*0.5);')
  lines.push('float distanceToCenter = (1.0/resolution.x) * 3.14 * distance(gl_FragCoord.xy, centerPosition);')
  lines.push('float distanceToTopLeft = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(0,0));')
  lines.push('float distanceToTopRight = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(resolution.x,0));')
  lines.push('float distanceToBottomLeft = (1.0/resolution.x) * distance(gl_FragCoord.xy, vec2(0,resolution.y));')
  lines.push('float distanceToBottomRight = (1.0/resolution.x) * distance(gl_FragCoord.xy, resolution.xy);')  
  lines.push('float timeMulti = 0.0;')
  lines.push('float red = 0.0;')
  lines.push('float green = 0.0;')
  lines.push('float blue = 0.0;')

  for(let i = 0; i < 30; i++) {
    lines.push(createLine())
  }
  // lines.push('red = sin(distanceToCenter);')
  lines.push('gl_FragColor = vec4( red, green, blue, 1.0 );')
  lines.push('}')

  return lines.join('\n')

}