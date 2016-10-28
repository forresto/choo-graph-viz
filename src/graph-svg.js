const html = require('choo/html')
const viewVoronoi = require('./view-voronoi')

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
    childNodes = children.map(renderNode)
  }
  let childEdges
  if (edges) {
    childEdges = edges.map(renderEdge)
  }
  const fill = children ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.9)'
  const stroke = children ? 'rgba(0, 0, 0, 0.5)' : 'black'
  return html`
    <g id="${id}" transform="translate(${x} ${y})">
      <rect
        width="${width}" height="${height}"
        fill="${fill}" stroke="${stroke}"
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

function renderTooltip (pos, nearest) {
  if (!pos || !nearest) return
  return html`
    <g>
      <line
        x1="${pos.x}" y1="${pos.y}"
        x2="${nearest[0]}" y2="${nearest[1]}"
        stroke="red"
      />
      <text x="${pos.x}" y="${pos.y - 5}">
        ${nearest.data[2]}
      </text>
    </g>
  `
}

function graphSVG (state, prev, send) {
  const {layout, voronoi, showVoronoi, pos, nearest} = state.app
  if (!layout) {
    return html`<div>calculating layout...</div>`
  }
  const {children, edges} = layout
  let {height, width} = layout
  height = Math.ceil(height)
  width = Math.ceil(width)

  function onmousemove (event) {
    send('app:re_pointer', {x: event.offsetX, y: event.offsetY})
  }

  return html`
    <svg
      width="${width}" height="${height}"
      viewBox="0 0 ${width} ${height}"
      onmousemove=${onmousemove}>
      <defs>
        ${arrow}
      </defs>
      <g id="__graph">
        ${children.map(renderNode)}
        ${edges.map(renderEdge)}
      </g>
      <g id="__debug">
        ${(voronoi && showVoronoi) ? viewVoronoi(voronoi) : null}
      </g>
      <g id="__tooltip">
        ${renderTooltip(pos, nearest)}
      </g>
    </svg>
  `
}

module.exports = graphSVG
