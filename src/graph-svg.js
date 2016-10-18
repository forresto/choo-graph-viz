const html = require('choo/html')

function renderNodes (nodes) {
  return nodes.map(function (node) {
    const {id, width, height, x, y, labels} = node
    return html`
      <g id="${id}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}"
          fill="white" stroke="black"
        />
        <text x="${x + 10}" y="${y + 30}">
          ${(labels ? labels[0].text : '')}
        </text>
      </g>
    `
  })
}

function renderEdges (edges) {
  return edges.map(function (edge) {
    const {id, sourcePoint, targetPoint, bendPoints} = edge
    let d = ''
    d += `M ${sourcePoint.x} ${sourcePoint.y} `
    if (bendPoints) {
      for (let i = 0, len = bendPoints.length; i < len; i++) {
        const bendPoint = bendPoints[i]
        d += `L ${bendPoint.x} ${bendPoint.y} `
      }
    }
    d += `L ${targetPoint.x} ${targetPoint.y} `
    return html`
      <path id="${id}" d="${d}"
        stroke="black" fill="none" style="marker-end: url(#markerArrow);"
      />
    `
  })
}

function graphSVG (layout) {
  if (!layout) {
    return html`<div>calculating layout...</div>`
  }
  const {height, width, children, edges} = layout
  return html`
    <svg width="${Math.ceil(width)}" height="${Math.ceil(height)}">
      <defs>
        <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto">
          <path d="M2,2 L2,11 L10,6 L2,2" fill="black" />
        </marker>
      </defs>
      ${renderNodes(children)}
      ${renderEdges(edges)}
    </svg>
  `
}

module.exports = graphSVG
