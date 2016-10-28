const d3Voronoi = require('d3-voronoi').voronoi

function pointsFromNode (node, xOffset=0, yOffset=0) {
  let points = []
  const {x, y, width, height} = node
  if (x != null && y != null) {
    points.push([x + xOffset, y + yOffset])
    points.push([x + xOffset + width/2, y + yOffset])
    points.push([x + xOffset + width, y + yOffset])
    points.push([x + xOffset + width, y + yOffset + height/2])
    points.push([x + xOffset + width, y + yOffset + height])
    points.push([x + xOffset + width/2, y + yOffset + height])
    points.push([x + xOffset, y + yOffset + height])
    points.push([x + xOffset, y + yOffset + height/2]) // half
    xOffset += x
    yOffset += y
  }

  if (node.children) {
    for (let i = 0, len = node.children.length; i < len; i++) {
      const child = node.children[i]
      points = points.concat(pointsFromNode(child, xOffset, yOffset))
    }
  }

  if (node.edges) {
    for (let i = 0, len = node.edges.length; i < len; i++) {
      const edge = node.edges[i]
      points = points.concat(pointsFromEdge(edge, xOffset, yOffset))
    }
  }

  return points
}

function pointsFromEdge (edge, xOffset=0, yOffset=0) {
  let points = [[edge.sourcePoint.x + xOffset, edge.sourcePoint.y + yOffset]]
  if (edge.bendPoints) {
    for (let i = 0, len = edge.bendPoints.length; i < len; i++) {
      const point = edge.bendPoints[i]
      points.push([point.x + xOffset, point.y + yOffset])
    }
  }
  points.push([edge.targetPoint.x, edge.targetPoint.y+yOffset])
  return points
}

function fxVoronoi (state, data, send, done) {
  const {layout} = state

  const points = pointsFromNode(layout)

  const voronoi = d3Voronoi()
    .extent([[0, 0], [Math.ceil(layout.width), Math.ceil(layout.height)]])
  const diagram = voronoi(points)
  const polygons = diagram.polygons()

  send('app:re_voronoi', {diagram, polygons}, done)
}

module.exports = fxVoronoi
