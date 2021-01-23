import React from 'react'
import * as d3 from 'd3'
import { svg } from 'd3'

export default class Interface extends React.Component {

  constructor(props) {
    super(props)
    this.svgRef = React.createRef()
    this.state = {
      shaderLines: '',
      matchingCodeLines: []
    }
    this.bitRate = 4
    this.geneSize = 128
    this.bits = d3.range(this.bitRate * this.geneSize).map(o=>{
      // return 0
      return Math.random() > 0.5 ? 1 : 0
    })
    // console.log(this.props, 'props')
    this.convertBits = this.convertBits.bind(this)
    // console.log(d3.drag)
  }

  convertBits () {
    const bytes = []
    for(let i = 0; i < this.geneSize*this.bitRate; i+=this.bitRate) {
      const bitArray = d3.range(this.bitRate).map(offset=>{ return this.bits[i+offset] })
      // console.log(bitArray)
      bytes.push(parseInt(bitArray.join(''),2))
    }
    // console.log('bytes', bytes)
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
      // console.log('drag event', event.x, event.y)
      const x = Math.floor(event.x / boxSize)
      const y = Math.floor(event.y / boxSize)
      const index = (y*gridSize) + x
      // console.log(x,y)
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
        this.setState({
          shaderLines: this.props.fns.generateFragmentShader()
        })    
      }
    })
    
    drag.on('start', (event)=>{
      dragFlipped = []
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
        // .attr('stroke','green')
        .attr('stroke-width','0.5px')

      rect.on('mouseover', ()=>{      
        const geneIndex = Math.floor(bitIndex / this.bitRate)
        console.log('Gene index', geneIndex)
        const metadata = this.props.fns.getLineMetaData().map((o,idx)=>{o.idx = idx; return o})        
        console.log(metadata)
        const matchingResults = metadata.filter(o=>{ return geneIndex >= o.begin && geneIndex <= o.end })
        console.log(matchingResults)

        this.setState({
          matchingCodeLines: matchingResults.map(o=>{return o.idx})
        })

      })

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
      this.setState({
        shaderLines: this.props.fns.generateFragmentShader()
      })  
    },10)
  }

  render () {
    const metadata = this.props.fns.getLineMetaData()
    const shaderLines = this.state.shaderLines.split('\n').map((o,lineIdx)=>{
      return (
        <div 
        onClick={ () => {
          const p = metadata[lineIdx - metadata.lineBegin]
          // console.log(p)
          if(p === undefined) {
            return
          }
          if(p.end > p.begin) {
            const svg = d3.select(this.svgRef.current)
            d3.range((p.end-p.begin)*this.bitRate).forEach(n=>{
              console.log(n, p.begin, n+(p.begin*this.bitRate))
              const rectIndex = (n+(p.begin*this.bitRate))
              this.bits[rectIndex] = Math.random() > 0.5 ? 1 : 0                
              svg.select('rect#_'+rectIndex) .attr('fill', this.bits[rectIndex] === 1 ? 'white' : 'black')   
            })
            this.props.fns.setDNA({data:this.convertBits()})
            window.shaderInit(this.props.fns.generateFragmentShader())    
            this.setState({
              shaderLines: this.props.fns.generateFragmentShader()
            })        
          } else {
            console.log('wrap around issue')
          }

        } }
        onMouseOver={ () => { 
          // console.log(metadata.lineBegin, lineIdx)
          this.setState({
            matchingCodeLines: [lineIdx - metadata.lineBegin]
          })
          d3.select(this.svgRef.current).selectAll('rect').attr('stroke', 'none')
          const p = metadata[lineIdx - metadata.lineBegin]
          // console.log(p)
          if(p === undefined) {
            return
          }
          if(p.end > p.begin) {
            d3.range((p.end-p.begin)*this.bitRate).forEach(n=>{
              console.log(n, p.begin, n+(p.begin*this.bitRate))
              const rectIndex = (n+(p.begin*this.bitRate)) 
              d3.select(this.svgRef.current).select('rect#_'+rectIndex).attr('stroke', 'orange')
            })
          } else {
            console.log('wrap around issue')
          }
        } }
        style={{
          outline: this.state.matchingCodeLines.indexOf(lineIdx - metadata.lineBegin) !== -1 ? '1px solid white' : null,
          cursor: 'pointer'
        }}>
          {o}
        </div>
      )
    })

    return (
      <>
      <div style={{ position: 'absolute', top: 0, left: 0, opacity: 1, backgroundColor: 'rgba(0,0,0,0)', width: '100%' }}>
        <svg ref={this.svgRef}/>
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, opacity: 1, backgroundColor: 'rgba(0,0,0,0)', width: '50%' }}>
        <div style={{
          padding: '10px',
          color: '#333', 
          fontFamily: 'monospace', 
          whiteSpace: 'nowrap', 
          backgroundColor: 'rgba(255,255,255,0.6)'}}>
          {shaderLines}
        </div>
      </div> 
      </>
    )
  }
}