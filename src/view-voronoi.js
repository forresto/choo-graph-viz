const html = require('choo/html')

function renderPolygon (polygon) {
  return html`
    <polygon
      points="${polygon.map((point) => point.join(',')+' ')}"
      fill="none" stroke="green" />
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

