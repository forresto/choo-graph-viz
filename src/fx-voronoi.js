const d3Voronoi = require('d3-voronoi').voronoi

function pointsFromNode (node, xOffset=0, yOffset=0) {
  let points = []
  const {x, y, width, height, id} = node
  if (x != null && y != null) {
    points.push([x + xOffset, y + yOffset, id])
    points.push([x + xOffset + width/2, y + yOffset, id]) // half
    points.push([x + xOffset + width, y + yOffset, id])
    points.push([x + xOffset + width, y + yOffset + height/2, id]) // half
    points.push([x + xOffset + width, y + yOffset + height, id])
    points.push([x + xOffset + width/2, y + yOffset + height, id]) // half
    points.push([x + xOffset, y + yOffset + height, id])
    points.push([x + xOffset, y + yOffset + height/2, id]) // half
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
  const {sourcePoint, bendPoints, targetPoint, id} = edge
  let points = [[sourcePoint.x + xOffset, sourcePoint.y + yOffset, id]]
  if (bendPoints) {
    for (let i = 0, len = bendPoints.length; i < len; i++) {
      const point = bendPoints[i]
      points.push([point.x + xOffset, point.y + yOffset, id])
    }
  }
  points.push([targetPoint.x, targetPoint.y+yOffset, id])
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
