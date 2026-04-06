function textSwap (element) {
  /*
  Permite substituição entre 2 caixas de texto com conteúdo diferentes quando o utilizar clica nelas

  * @param {HTML Element} element - Contém a referência ao element html que se está a manipular, de forma a fazer referência às secções no css que serão mudadas
    de forma a criar o efeito animado

  */

  const conteudo = element.querySelector('.conteudo-box')
  const stats = element.querySelector('.stat-box')
  const titulo = element.querySelector('.text-title')

  if (conteudo.style.display !== 'none') {
    showStats(conteudo, stats, titulo)
  } else {
    showContent(conteudo, stats, titulo)
  }
}

function showStats (conteudo, stats, titulo) {
  /*
  Animação GSAP que esconde o texto e mostra as estatísticas sobre o assunto do texto

  * @param {HTML Element} conteudo - Container do texto principal (.conteudo-box)
  * @param {HTML Element} stats - Container das e statísticas (.stat-box)
  * @param {HTML Element} titulo - Container do título (.text-title) para animação de cor e escala
 */

  gsap.timeline()
    .to(conteudo, { duration: 0.3, opacity: 0, y: -20, display: 'none', ease: 'power2.in' })
    .to(titulo, { duration: 0.3, color: '#1a73e8', scale: 1.05 }, '-=0.2')
    .fromTo(stats,
      { opacity: 0, y: 20, display: 'none' },
      { opacity: 1, y: 0, display: 'block', duration: 0.4, ease: 'power2.out' }
    )
}

function showContent (conteudo, stats, titulo) {
  /*
  Animação GSAP que esconde as estatísticas e mostra o texto principal

  * @param {HTML Element} conteudo - Container do texto principal (.conteudo-box)
  * @param {HTML Element} stats - Container das e statísticas (.stat-box)
  * @param {HTML Element} titulo - Container do título (.text-title) para animação de cor e escala

  */

  gsap.timeline()
    .to(stats, { duration: 0.3, opacity: 0, y: 20, display: 'none', ease: 'power2.in' })
    .to(titulo, { duration: 0.3, color: '#0f9d58', scale: 1 }, '-=0.2')
    .fromTo(conteudo,
      { opacity: 0, y: -20, display: 'none' },
      { opacity: 1, y: 0, display: 'block', duration: 0.4, ease: 'power2.out' }
    )
}
