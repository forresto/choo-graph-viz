const choo = require('choo')
const html = require('choo/html')
const graphSVG = require('./graph-svg')
const graphLayout = require('./graph-layout')

const app = choo()
app.router(['/', view])

const model =
  { state:
    { graph: {}
    , layout: null
    }
  , reducers:
    { layout: (state, data) => ({ layout: data })
    }
  , effects:
    { layouter: graphLayout
    }
  , subscriptions:
    [ initLayout
    ]
  }

function initLayout (send, done) {
  console.log(arguments)
  send('layouter', {}, (err) => {if (err) return done(err)})
}

function view (state, prev, send) {
  const {graph, layout} = state

  return html`
    <div>
      <h1>🚂 Graph</h1>
      ${(layout ? graphSVG(layout) : html`<div>calculating layout...</div>`)}
      <pre>${JSON.stringify(graph, null, 2)}</pre>
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
