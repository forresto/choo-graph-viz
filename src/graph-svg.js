const html = require('choo/html')

const arrowWidth = 8
const arrowHeight = 8
const arrow = html`
<marker id="markerArrow" refX="0" refY="0" orient="auto" overflow="visible">
  <path
    d="M ${0 - arrowWidth} ${0 - arrowHeight / 2} L 0 0 L ${0 - arrowWidth} ${arrowHeight / 2}"
    stroke="none" fill="black" />
</marker>
`

function renderNodes (nodes) {
  return nodes.map(function (node) {
    const {id, width, height, x, y, labels} = node
    let label
    if (labels && labels[0] && labels[0].text) {
      label = html`
        <text
          x="${x + labels[0].x}" y="${y + labels[0].y}"
          style="text-anchor: middle; font-family: monospace">
          ${labels[0].text}
        </text>
      `
    }
    return html`
      <g id="${id}">
        <rect
          x="${x}" y="${y}"
          width="${width}" height="${height}"
          fill="white" stroke="black"
        />
        ${label}
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
      <path id="${id}"
        d="${d}"
        fill="none" stroke="black"
        style="marker-end: url(#markerArrow);"
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
    <svg width="${width}" height="${height}">
      <defs>
        ${arrow}
      </defs>
      ${renderNodes(children)}
      ${renderEdges(edges)}
    </svg>
  `
}

module.exports = graphSVG
