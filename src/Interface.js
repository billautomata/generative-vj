import React from 'react'
import * as d3 from 'd3'

export default class Interface extends React.Component {

  constructor(props) {
    super(props)
    this.svgRef = React.createRef()
    this.bitRate = 4
    this.geneSize = 64
    this.bits = d3.range(this.bitRate * this.geneSize).map(o=>{
      // return 0
      return Math.random() > 0.5 ? 1 : 0
    })
    console.log(this.props, 'props')
    this.convertBits = this.convertBits.bind(this)
    console.log(d3.drag)
  }

  convertBits () {
    const bytes = []
    for(let i = 0; i < this.geneSize*this.bitRate; i+=this.bitRate) {
      const bitArray = d3.range(this.bitRate).map(offset=>{ return this.bits[i+offset] })
      // console.log(bitArray)
      bytes.push(parseInt(bitArray.join(''),2))
    }
    console.log('bytes', bytes)
    return bytes
  }

  componentDidMount () {
    console.log('interface mounted')
    const svg = d3.select(this.svgRef.current)
      .attr('viewBox', '-5 -5 110 110')
      .attr('width', window.innerHeight*0.8)
    const gridSize = Math.floor(Math.sqrt(this.bits.length)) 
    const boxSize = 100 / gridSize
    const g = svg.append('g')
    const drag = d3.drag()
    
    let dragFlipped = []
    drag.on('drag', (event)=>{
      console.log('drag event', event.x, event.y)
      const x = Math.floor(event.x / boxSize)
      const y = Math.floor(event.y / boxSize)
      const index = (y*gridSize) + x
      console.log(x,y)
      // if(dragFlipped.indexOf(index) === -1) {
      if(dragFlipped[dragFlipped.length-1] !== index) {
        dragFlipped.push(index)
        if(this.bits[index] === 1) {
          this.bits[index] = 0
        } else {
          this.bits[index] = 1
        }
        g.select('rect#_'+index).attr('fill', this.bits[index] === 1 ? 'white' : 'black')      
        this.props.fns.setDNA({data:this.convertBits()})
        window.shaderInit(this.props.fns.generateFragmentShader())    
      }
    })
    
    drag.on('start', (event)=>{
      dragFlipped = []
      console.log("DRAG START")
    })
    g.call(drag)

    // generate rectangles
    let x = 0
    let y = 0
    this.bits.forEach((bit,bitIndex)=>{     
      y = Math.floor(bitIndex / gridSize) 
      x = bitIndex - (y*gridSize)
      const rect = g.append('rect').attr('id', '_'+bitIndex)
        .attr('x',x*boxSize).attr('y',y*boxSize)
        .attr('width', boxSize).attr('height', boxSize)
        .attr('fill', bit === 1 ? 'white' : 'black')      

      rect.on('click', ()=>{
        return
        if(this.bits[bitIndex] === 1){
          this.bits[bitIndex] = 0
        } else {
          this.bits[bitIndex] = 1
        }
        // convertBits
        // this.props.setDNA({ data: this.bits })
        // this.convertBits()
        rect.attr('fill', this.bits[bitIndex] === 1 ? 'white' : 'black')      
        this.props.fns.setDNA({data:this.convertBits()})
        window.shaderInit(this.props.fns.generateFragmentShader())
      })
      x += 1
      if(x > gridSize) {
        y += 1
        x = 0
      }  
    })

    setTimeout(()=>{
      this.props.fns.setDNA({data:this.convertBits()})
      window.shaderInit(this.props.fns.generateFragmentShader())  
    },10)
  }

  render () {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3, backgroundColor: 'rgba(0,0,0,0)', width: '100%' }}>
        <svg ref={this.svgRef}/>
      </div>
    )
  }
}