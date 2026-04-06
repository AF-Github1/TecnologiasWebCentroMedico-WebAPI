/* global d3, IntersectionObserver */

const THRESHOLD = 0.6
const TRANSITION_DURATION = 1500

const DATA_TABLE = [ // Dados para serem usados em gráfico de barras (ano = eixo x, numero = eixo y)
  { ano: '2016', numero: 32 },
  { ano: '2017', numero: 50 },
  { ano: '2018', numero: 70 },
  { ano: '2019', numero: 74 },
  { ano: '2020', numero: 87 },
  { ano: '2021', numero: 93 },
  { ano: '2022', numero: 100 }
]
const BAR_STYLE = {
  width: 800,
  height: 250,
  margin: { top: 20, bottom: 50, left: 90, right: 30 },
  backgroundColor: '#f2f6fc',
  barColor: 'steelblue'
}

function animationBarchart (data, config) {
  /*
  Criação de gráfico de barras animado utilizando a biblioteca d3.js

  * @param {Array} data - Dados utilizados para definir os valores gráfico de barras
  * @param {Object} config - Dados utilizados para o aspecto das barras (cores e tamanho)

  */
  const { width, height, margin, backgroundColor, barColor } = config

  const svg = d3.select('#grafico .grid-box')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto')

  const x = d3.scaleBand() // Eixo x
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.2)

  const y = d3.scaleLinear() // Eixo y
    .domain([0, 100])
    .range([height - margin.bottom, margin.top])

  const bars = svg.append('g') // Objecto gráfico (aspecto das barras)
    .selectAll('rect')
    .data(data.sort((a, b) => d3.ascending(a.ano, b.ano)))
    .join('rect')
    .attr('x', (d, i) => x(i))
    .attr('width', x.bandwidth())
    .attr('y', y(0))
    .attr('height', 0)
    .attr('fill', backgroundColor)

  chartTransition(bars, y, THRESHOLD, TRANSITION_DURATION, barColor)

  svg.append('text') // Legenda eixo y
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${margin.left / 6}, ${height / 2}) rotate(-90)`)
    .style('font-family', 'Poppins, sans-serif')
    .style('font-size', '20px')
    .style('fill', '#020000')

    .text('Projetos Completos')

  const xAxis = (g) => {
    g.attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].ano))
      .attr('font-size', '20px')
  }

  const yAxis = (g) => {
    g.attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .attr('font-size', '20px')
  }

  svg.append('g').call(xAxis)
  svg.append('g').call(yAxis)
}

function chartTransition (bars, y, threshold, duration, barColor) {
  /*
  Função responsável pela animação do gráfico de barras quando o utilizar está a ver acima de uma determinada percentagem da secção associada

  * @param {Object} bars - Informação sobre o aspecto das barras
  * @param {Function} y - Dados utilizados para definir os valores gráfico de barras
  * @param {number} threshold - Valor utilizado para definir a percentagem do ecrã que tem de ser visto para ativar a animação
  * @param {number} duration - Tempo que a animação da barra demorará
  * @param {Object} barColor - O valor de barColor define a cor das barras

  */

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        bars.transition()
          .duration(duration)
          .attr('y', (d) => y(d.numero))
          .attr('height', (d) => y(0) - y(d.numero))
          .attr('fill', barColor)

        observer.unobserve(entry.target)
      }
    })
  }, { threshold })

  const target = document.querySelector('#grafico')
  if (target) {
    observer.observe(target)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  animationBarchart(DATA_TABLE, BAR_STYLE)
})
