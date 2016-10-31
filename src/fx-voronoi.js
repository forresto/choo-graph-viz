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

function divideSegment (x1, y1, x2, y2, maxLength = 50) {
  let points = []
  const dX = x2 - x1
  const dY = y2 - y1
  const distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
  const count = Math.floor(distance / maxLength)
  let x = x1
  let y = y1
  for (let i = 0; i < count; i++) {
    x += dX / (count + 1)
    y += dY / (count + 1)
    points.push([x, y])
  }
  return points
}

function pointsFromEdge (edge, xOffset=0, yOffset=0) {
  const {sourcePoint, bendPoints, targetPoint, id} = edge
  let x = sourcePoint.x
  let y = sourcePoint.y
  let points = [[sourcePoint.x + xOffset, sourcePoint.y + yOffset, id]]
  if (bendPoints) {
    for (let i = 0, len = bendPoints.length; i < len; i++) {
      const point = bendPoints[i]
      const subdivisions = divideSegment(x, y, point.x, point.y)
      for (let i = 0, len = subdivisions.length; i < len; i++) {
        const subdivision = subdivisions[i]
        points.push([subdivision[0] + xOffset, subdivision[1] + yOffset, id])
      }
      points.push([point.x + xOffset, point.y + yOffset, id])
      x = point.x
      y = point.y
    }
  }
  const subdivisions = divideSegment(x, y, targetPoint.x, targetPoint.y)
  for (let i = 0, len = subdivisions.length; i < len; i++) {
    const subdivision = subdivisions[i]
    points.push([subdivision[0] + xOffset, subdivision[1] + yOffset, id])
  }
  points.push([targetPoint.x + xOffset, targetPoint.y + yOffset, id])
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
