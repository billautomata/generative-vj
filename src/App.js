import React from 'react'

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import './App.css';

import Shader from './Shader.js'
import Controls from './Interface.js'

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#01579b',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#546e7a',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    body2: {
      fontSize: 18
    }
  },
  input: {
    color: 'white'
  }
});

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Shader/>
            </Route>
            <Route exact path="/controls">
              <Controls/>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }

}


export default App