const html = require('choo/html')

function renderPolygon (polygon, index, array) {
  const fill = `hsl(${index / array.length * 360}, 100%, 75%)`
  return html`
    <polygon
      points="${polygon.map((point) => point.join(',') + ' ')}"
      fill="${fill}" stroke="white" />
  `
}

function renderDot (polygon) {
  const {data} = polygon
  return html`
    <circle cx="${data[0]}" cy="${data[1]}" r="3" fill="white" />
  `
}

function viewVoronoi (voronoi) {
  const {polygons} = voronoi
  return html`
    <g>
      ${polygons.map(renderPolygon)}
      ${polygons.map(renderDot)}
    <g>
  `
}

module.exports = viewVoronoi

