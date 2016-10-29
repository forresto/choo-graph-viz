const html = require('choo/html')

function renderPolygon (polygon, index, array) {
  const fill = `hsl(${index / array.length * 360}, 100%, 75%)`
  return html`
    <polygon
      points="${polygon.map((point) => point.join(',')+' ')}"
      fill="${fill}" stroke="white" />
  `
}

function viewVoronoi (voronoi) {
  const {polygons} = voronoi
  return html`
    <g>
      ${polygons.map(renderPolygon)}
    <g>
  `
}

module.exports = viewVoronoi

