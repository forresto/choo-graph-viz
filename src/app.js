const choo = require('choo')
const html = require('choo/html')
const graphSVG = require('./graph-svg')
const graphLayout = require('./graph-layout')
const effectVoronoi = require('./fx-voronoi')

const app = choo()
app.router(['/', view])

const model =
  { state:
    { graph: null
    , layout: null
    , voronoi: null
    }
  , reducers:
    { re_layout: (state, data) => ({ layout: data })
    , re_voronoi: (state, data) => ({ voronoi: data })
    }
  , effects:
    { fx_layout: graphLayout
    , fx_voronoi: effectVoronoi
    }
  , subscriptions:
    [ initLayout
    ]
  }

function initLayout (send, done) {
  send('fx_layout', {}, (err) => {if (err) return done(err)})
}

function view (state, prev, send) {
  const {graph, layout} = state

  return html`
    <div>
      <h1>🚂 Graph</h1>
      ${(layout ? graphSVG(state) : html`<div>calculating layout...</div>`)}
      <pre>${graph ? JSON.stringify(graph, null, 2) : '{}'}</pre>
    </div>
  `
}

function mountApp (containerDOM, initialState) {
  model.state = initialState
  app.model(model)

  const tree = app.start()
  containerDOM.appendChild(tree)

  return app
}

module.exports = mountApp
