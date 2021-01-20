let compoundArgumentsLength = 6
let genesLength = 180
let linesLength = 120

let currentDNAIndex = 0
let dna = []

for (let i = 0; i < genesLength; i++) {
  dna.push(Math.floor(Math.random()*12))
}

const functions = [
  { name: '', args: 1 }, 
  { name: 'sin', args: 1 },
  { name: 'cos', args: 1 },
  { name: 'tan', args: 1 },
  { name: 'abs', args: 1 },
  { name: 'fract', args: 1 }
]

const operatorsAssign = [
  { name: '+=' },
  { name: '-=' },
  { name: '*=' },
  { name: '=' },
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
  { name: 'time2' },
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

function createLineDNA() {

  const leftGene = dna[currentDNAIndex]
  currentDNAIndex++
  currentDNAIndex = currentDNAIndex % dna.length
  // console.log(currentDNAIndex)
  const operatorGene = dna[currentDNAIndex]
  currentDNAIndex++
  currentDNAIndex = currentDNAIndex % dna.length
  // console.log(currentDNAIndex)
  const functionGene = dna[currentDNAIndex]
  currentDNAIndex++
  currentDNAIndex = currentDNAIndex % dna.length
  // console.log(currentDNAIndex)
  
  let valueLengthGene = (dna[currentDNAIndex] % compoundArgumentsLength) + 1
  if(valueLengthGene % 2 === 0) {
    valueLengthGene += 1
  }
  currentDNAIndex++
  currentDNAIndex = currentDNAIndex % dna.length
  // console.log('value length gene', valueLengthGene)
  const valueGenes = []
  for(let i = 0; i < valueLengthGene; i++) {
    valueGenes.push(dna[currentDNAIndex])
    currentDNAIndex++
    currentDNAIndex = currentDNAIndex % dna.length
  }

  // console.log({leftGene,operatorGene,functionGene,valueLengthGene,valueGenes})

  return [
    rDNA(values, leftGene).name,
    rDNA(operatorsAssign, operatorGene).name,
    rDNA(functions, functionGene).name + '(',
    createCompoundValueDNA(valueGenes),
    ');'
  ].join(' ')
}

function createCompoundValueDNA(genes) {
  let geneIndex = 0
  const values = []
  // console.log('genes length', genes.length)
  while(genes.length > 0) {
    if(genes.length >= 2) {
      values.push(
        [
          rDNA(constantValues,genes.pop()).name, 
          rDNA(operatorsSimple,genes.pop()).name
        ].join(' ')
      )
    } else {
      values.push(rDNA(constantValues, genes.pop()).name)
    }  
  }
  return values.join(' ')
}

function rDNA(arr, value) {
  // console.log('array length', arr.length, 'asked index', value, 'computed index', value%arr.length)
  return arr[value%(arr.length)]
}

function generateFragmentShader() {

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
  lines.push('float time2 = time * 0.1;')
  lines.push('float red = 0.0;')
  lines.push('float green = 0.0;')
  lines.push('float blue = 0.0;')

  for(let i = 0; i < linesLength; i++) {
    lines.push(createLineDNA())
  }

  lines.push('gl_FragColor = vec4( red, green, blue, 1.0 );')
  lines.push('}')

  const displayLines = []
  lines.forEach((line,lineIndex)=>{
    displayLines.push([lineIndex,line].join('\t'))
  })
  // console.log(displayLines.join('\n'))

  return lines.join('\n')

}

function setDNA(options) {
  dna = []
  currentDNAIndex = 0
  options.data.forEach(d=>{
    dna.push(d)
  })
}
function configure(options) {
  linesLength = options.linesLength
}

export {
  configure,
  generateFragmentShader,
  setDNA
}