/* IntersectionObserver, sessionStorage, gsap */

/* Este ficheiro está dedicado às funções dos eventos javascript de galeria, seta de voltar ao topo e popup */

function showPopup () {
  /*
  Verifica se o utilizador já tocou no link presente no popup, verificando o value associado à chave check em session storage. Caso não, mostra o popup
  */
  const USER_CHECK = sessionStorage.getItem('check')
  if (USER_CHECK !== '1') {
    document.getElementById('sidepopup').style.width = '250px'
  }
}
function hidePopup () {
  /*
  Esconde o popup quando chamada
  */
  document.getElementById('sidepopup').style.width = '0'
}

function userDismiss () {
  /*
  Guarda um par de key / value em sessão. Este valores ficam guardados até o utilizador abrir uma nova instância da página.
  */
  sessionStorage.setItem('check', '1')
}

function popupStart () {
  /*
  Quando o utilizador mantenha-se uma quantidade determinada de tempo na página (3 segundos) é chamada a função de showPopup, de forma a mostrar um popup ao utilizador.
  Caso o utilizador saia da secção, se o popup estiver à mostra, volta a ser escondido e o timeout sofre um reset de forma reiniciar a contagem. O mesmo acontece se o
  utilizador sair da secção antes de o popup aparecer
  */

  let timeout
  const TIME_INTERVAL = 3000
  const THRESHOLD = 0.6

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeout = setTimeout(() => {
          showPopup()
        }, TIME_INTERVAL)
      } else {
        clearTimeout(timeout)
        hidePopup()
      }
    })
  }, { threshold: THRESHOLD }
  )

  const TARGET = document.querySelector('#oportunidades')
  if (TARGET) {
    observer.observe(TARGET)
  }
}

window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop')
  btn.style.display = window.scrollY > 800 ? 'block' : 'none'
})

let atual = 0
const total = 3
let autoplay = setInterval(() => mudar(1), 5000)

function irPara (index) {
  /*
  Função que permite a troca de imagens numa galeria. Dependendo do valor do parâmetro, a imagem desloca-se para a esquerda ou para a direita.
  Adicionalmente, permite que haja uma troca automática de imagens da esquerda para a direita, depois de um intervalo fixo de tempo

  * @param {Integer} index - Valor que controla qual a imagem que deverá ser apresentada

  */

  document.querySelectorAll('.bolinha')[atual].classList.remove('active')

  atual = (index + total) % total

  document.querySelector('.slides').style.transform = `translateX(-${atual * 100}%)`

  document.querySelectorAll('.bolinha')[atual].classList.add('active')

  clearInterval(autoplay)
  autoplay = setInterval(() => mudar(1), 5000)
}

function mudar (direcao) {
  /*
  Função que recebe o parâmetro que define a translação da imagem e chama a função que realiza a translação da imagem em si

  * @param {Integer} direcao - Valor que controla a direcao da translação. -1 corresponderá a uma translação à esquerda, +1 corresponderá a uma
  translação à direita

  */
  irPara(atual + direcao)
}

window.addEventListener('DOMContentLoaded', () => {
  popupStart()
}
)
