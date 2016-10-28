const klay = require('klayjs')
const xtend = require('xtend')

const graphProps =
  { direction: 'RIGHT'
  , spacing: 40
  , feedBackEdges: true
  , edgeRouting: 'ORTHOGONAL'
  , unnecessaryBendpoints: false
  }
const nodeProps =
  { nodeLabelPlacement: 'INSIDE H_CENTER V_CENTER'
  , sizeConstraint: 'NODE_LABELS MINIMUM_SIZE'
  , sizeOptions: 'DEFAULT_MINIMUM_SIZE COMPUTE_INSETS'
  , labelSpacing: 12
  , minWidth: 36
  , minHeight: 36
  }
const options =
  { intCoordinates: false
  }


function makeKNode (node) {
  const label = node.label || node.id || "node"
  const minWidth = label.length * 10 + 12
  let kNode =
    { id: node.id
    , labels: [ { text: label } ]
    , properties: xtend(nodeProps, {minWidth})
    }
  if (node.children) {
    kNode.children = node.children.map(makeKNode)
    kNode.properties.nodeLabelPlacement = 'OUTSIDE H_CENTER V_TOP'
  }
  if (node.edges) {
    kNode.edges = node.edges.map(makeKEdge)
  }
  return kNode
}

function makeKEdge (edge) {
  let kEdge =
    { id: `${edge.source}___${edge.target}`
    , source: edge.source
    , target: edge.target
    }
  return kEdge
}

function graphToKGraph (graph) {
  let kGraph =
    { id: 'root'
    , properties: graphProps
    , children: graph.children.map(makeKNode)
    , edges: graph.edges.map(makeKEdge)
    }
  return kGraph
}

function layoutEffect (state, data, send, done) {
  const {graph} = state
  const kGraph = graphToKGraph(graph)
  function error (err) {
    done(err)
  }
  function success (layout) {
    send('app:re_layout', layout, done)
    send('app:fx_voronoi', layout, done)
  }
  // Can be workerized if too sluggish on main thread
  // https://github.com/OpenKieler/klayjs#web-worker
  klay.layout({graph: kGraph, options, error, success})
}

module.exports = layoutEffect
