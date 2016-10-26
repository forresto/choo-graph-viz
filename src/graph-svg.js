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

function renderNode (node) {
  const {id, width, height, x, y, labels, children, edges} = node
  let label
  if (labels && labels[0] && labels[0].text) {
    const yOffset = children ? 0 : 4
    label = html`
      <text
        x="${labels[0].x}" y="${labels[0].y + yOffset}"
        style="text-anchor: middle; font-family: monospace">
        ${labels[0].text}
      </text>
    `
  }
  let childNodes
  if (children) {
    console.log(children)
    childNodes = children.map(renderNode)
  }
  let childEdges
  if (edges) {
    childEdges = edges.map(renderEdge)
  }
  return html`
    <g id="${id}" transform="translate(${x} ${y})">
      <rect
        width="${width}" height="${height}"
        fill="transparent" stroke="black"
      />
      ${childNodes}
      ${childEdges}
      ${label}
    </g>
  `
}

function renderEdge (edge) {
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
}

function graphSVG (layout) {
  if (!layout) {
    return html`<div>calculating layout...</div>`
  }
  const {children, edges} = layout
  let {height, width} = layout
  height = Math.ceil(height)
  width = Math.ceil(width)
  return html`
    <svg
      width="${width}" height="${height}"
      viewBox="0 0 ${width} ${height}"
      style="max-width: 100%">
      <defs>
        ${arrow}
      </defs>
      ${children.map(renderNode)}
      ${edges.map(renderEdge)}
    </svg>
  `
}

module.exports = graphSVG
