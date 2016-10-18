const klay = require('klayjs')

function graphToKGraph (graph) {
  let kGraph =
    { id: 'root'
    , properties:
      { direction: 'RIGHT'
      , spacing: 40
      , feedBackEdges: true
      // , portConstraints: 'FREE'
      , edgeRouting: 'ORTHOGONAL'
      }
    , children: []
    , edges: []
    }
  for (let i = 0, len = graph.nodes.length; i < len; i++) {
    const node = graph.nodes[i]
    let kNode =
      { id: node.id
      , labels: [ { text: node.label || node.id } ]
      , width: 50
      , height: 50
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
  const options = {}
  function error (err) {
    done(err)
  }
  function success (graph) {
    send('layout', graph, done)
  }
  // Can be workerized if too sluggish on main thread
  // https://github.com/OpenKieler/klayjs#web-worker
  klay.layout({graph: kGraph, options, error, success})
}

module.exports = layoutEffect
