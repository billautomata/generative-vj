import React from 'react'
import * as d3 from 'd3'
import { svg } from 'd3'

import { 
  Box, Button, ButtonGroup,
  TextField, Typography, 
  Card, CardHeader, CardContent,
  Container,
  Grid
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser, faFileAlt, faUserPlus, faUserEdit, faUsers } from '@fortawesome/free-solid-svg-icons'

const LOCAL_STORAGE_KEY = 'COOKIE_VJ_SETTINGS'

export default class Interface extends React.Component {

  constructor(props) {
    super(props)
    this.svgRef = React.createRef()
    this.state = {
      shaderLines: '',
      matchingCodeLines: [],
      showBits: false,
      showCode: false
    }
    this.bitRate = 4
    this.geneSize = 64
    this.bits = d3.range(this.bitRate * this.geneSize).map(o=>{
      return Math.random() > 0.5 ? 1 : 0
    })

    this.convertBits = this.convertBits.bind(this)
    this.generateRandom = this.generateRandom.bind(this)
    this.readStoredSettings = this.readStoredSettings.bind(this)
    this.writeStoredSettings = this.writeStoredSettings.bind(this)

    this.saveSettings = this.saveSettings.bind(this)
    this.readStoredSettings = this.readStoredSettings.bind(this)
    this.loadConfiguration = this.loadConfiguration.bind(this)

    this.saveNameRef = React.createRef()

  }

  saveSettings () {
    const o = {
      name: this.saveNameRef.current.value,
      bitRate: this.bitRate,
      bits: this.bits,
      config: this.props.fns.getConfig()
    }
    console.log(o)
    this.writeStoredSettings(this.readStoredSettings().push(o))
  }

  readStoredSettings () {
    const o = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if(o === null) {
      return []
    } else {
      try {
        const p = JSON.parse(o)
        return p
      } catch (e) {
        return []
      }
    }
  }

  writeStoredSettings (settings) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
  }

  loadConfiguration (index) {
    const settings = this.readStoredSettings()
    window.shaderInit(this.props.fns.generateFragmentShader())    
    this.setState({
      shaderLines: this.props.fns.generateFragmentShader()
    })        
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

  generateRandom () {
    this.bits = d3.range(this.bitRate * this.geneSize).map(o=>{
      return Math.random() > 0.5 ? 1 : 0
    })
    this.props.fns.setDNA({data:this.convertBits()})
    window.shaderInit(this.props.fns.generateFragmentShader())
    this.setState({
      shaderLines: this.props.fns.generateFragmentShader(),
      matchingCodeLines: []
    })
    d3.select(this.svgRef.current).select('g').selectAll('rect').attr('fill', d=>{
      return this.bits[d.idx] === 1 ? 'white' : 'black'
    }).attr('stroke','none')
  }

  componentDidMount () {
    console.log('interface mounted')
    const dimensions = 100
    const svg = d3.select(this.svgRef.current)
      .attr('viewBox', '0 0 '+[dimensions,dimensions].join(' '))
      .attr('width', window.innerHeight*0.8)
    const gridSize = Math.ceil(Math.sqrt(this.bits.length)) 
    const boxSize = dimensions / gridSize
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
        .datum({idx: bitIndex})
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
      <div style={{ 
        position: 'absolute', top: 0, left: 0, 
        opacity: 1, backgroundColor: 'rgba(0,0,0,0)', 
        padding: '10px',
        width: '100%' }}>
        <Grid container spacing={1} alignItems='center' justify='flex-start'>
          <Grid item style={{width: '160px'}}><Button fullWidth color='default' variant='contained' onClick={()=>{this.setState({showBits: !this.state.showBits})}}>{this.state.showBits ? 'Hide' : 'Show'} DNA</Button></Grid>
          <Grid item style={{width: '160px'}}><Button fullWidth color='default' variant='contained' onClick={()=>{this.setState({showCode: !this.state.showCode})}}>{this.state.showCode ? 'Hide' : 'Show'} Code</Button></Grid>
          <Grid item><Button color='default' variant='contained' onClick={this.generateRandom}>Random</Button></Grid>
          <Grid item><Button color='default' variant='contained' onClick={this.generateRandom}>Reset</Button></Grid>
          <Grid item><Button color='default' variant='contained' onClick={this.saveSettings}>Save</Button></Grid>                      
          <Grid item><TextField inputRef={this.saveNameRef} variant='outlined' size='small' fullWidth></TextField></Grid>
        </Grid>
        <svg ref={this.svgRef} style={{marginTop: 10, display: this.state.showBits ? null : 'none',}}/>
      </div>
      <div style={{ display: this.state.showCode ? null : 'none', position: 'absolute', top: 0, right: 0, opacity: 1, backgroundColor: 'rgba(0,0,0,0)', width: '50%' }}>
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