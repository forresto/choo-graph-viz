const choo = require('choo')
const html = require('choo/html')
const graphSVG = require('./graph-svg')
const graphLayout = require('./graph-layout')
const effectVoronoi = require('./fx-voronoi')
const xtend = require('xtend')

const app = choo()
app.router(['/', view])

const model =
  { namespace: 'app'
  , state:
    { graph: null
    , layout: null
    , voronoi: null
    , showVoronoi: true
    , pos: null
    , nearest: null
    }
  , reducers:
    { re_toggleVoronoi: (state, data) => ({ showVoronoi: data })
    , re_layout: (state, data) => ({ layout: data })
    , re_voronoi: (state, data) => ({ voronoi: data })
    , re_pointer: setNN
    }
  , effects:
    { fx_layout: graphLayout
    , fx_voronoi: effectVoronoi
    }
  , subscriptions:
    [ initLayout
    ]
  }

function setNN (state, data) {
  if (!state.voronoi) return
  const point = state.voronoi.diagram.find(data.x, data.y)
  return {pos: data, nearest: point}
}

function initLayout (send, done) {
  send('app:fx_layout', {}, (err) => {if (err) return done(err)})
}

function view (state, prev, send) {
  const {graph, layout, showVoronoi} = state.app

  function toggleV (event) {
    send('app:re_toggleVoronoi', event.target.checked)
  }

  return html`
    <div>
      <h1>🚂 Graph</h1>
      ${(layout ? graphSVG(state, prev, send) : html`<div>calculating layout...</div>`)}
      <label>
        Debug
        <input type="checkbox" checked="${showVoronoi}" onchange=${toggleV}>
      </label>
      <pre>${graph ? JSON.stringify(graph, null, 2) : '{}'}</pre>
    </div>
  `
}

function mountApp (containerDOM, initialState) {
  model.state = xtend(model.state, initialState)
  app.model(model)

  const tree = app.start()
  containerDOM.appendChild(tree)

  return app
}

module.exports = mountApp
