const klay = require('klayjs')
const xtend = require('xtend')

const graphProps =
  { direction: 'RIGHT'
  , spacing: 40
  , feedBackEdges: true
  , edgeRouting: 'ORTHOGONAL'
  }
const nodeProps =
  { nodeLabelPlacement: 'INSIDE H_CENTER V_CENTER'
  , sizeConstraint: 'NODE_LABELS MINIMUM_SIZE'
  , sizeOptions: 'DEFAULT_MINIMUM_SIZE'
  , minWidth: 36
  , minHeight: 36
  }
const options =
  { intCoordinates: true
  }


function graphToKGraph (graph) {
  let kGraph =
    { id: 'root'
    , properties: graphProps
    , children: []
    , edges: []
    }
  for (let i = 0, len = graph.nodes.length; i < len; i++) {
    const node = graph.nodes[i]
    const label = node.label || node.id || "node"
    const minWidth = label.length * 10 + 12
    let kNode =
      { id: node.id
      , labels: [ { text: label } ]
      , properties: xtend(nodeProps, {minWidth})
      }
    kGraph.children.push(kNode)
  }
  for (let i = 0, len = graph.edges.length; i < len; i++) {
    const edge = graph.edges[i]
    let kEdge =
      { id: 'edge' + i
      , source: edge.source
      , target: edge.target
      }
    kGraph.edges.push(kEdge)
  }
  return kGraph
}

function layoutEffect (data, state, send, done) {
  const kGraph = graphToKGraph(data.graph)
  function error (err) {
    done(err)
  }
  function success (graph) {
    console.log(graph)
    send('layout', graph, done)
  }
  // Can be workerized if too sluggish on main thread
  // https://github.com/OpenKieler/klayjs#web-worker
  klay.layout({graph: kGraph, options, error, success})
}

module.exports = layoutEffect
