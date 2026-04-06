Tecnologias Web, PEI2 : Javascript
Grupo 4

No contexto deste projeto, foi adicionado um formulário funcional, 3 animações feitas com bibliotecas externas e 3 eventos distintos, em Javascript.
Para efeitos de formatação de Javascript, foi utilizado JavaScript Standard Style

**Formulário**

O código associado ao formulário está presente no módulo de form.js e no modulo formClass

Já existia um formulário (não funcional) na versão do trabalho entregue em PE1. 
Este formulário foi adaptado de forma a que se consiga inserir um Nome, Email, Assunto, Mensagem, e Número Telefónico com código de área associado (Opcional), através de uma classe Formulario (em formClass.js) , que inclui os atributos com os dados mencionados aqui
e  métodos para a validação dos mesmos.

É verificado se o email está num formato aceitável (xxx@yyy.zzz, onde xxx pode tomar qualquer valor, yyy deverá tomar um valor alfanumérico e zzz deverá tomar apenas valores do alfabeto, de a-z.
xxx e yyy deverão ser separados por um arroba { @ }, yyy e zzz deverão ser separados por um ponto { . }

É verificado se o telefone está no formato correto, sendo composto apenas por números, e 6 a 15 caracteres no total.

Os assuntos selecionados apresentam estruturas de mensagens parcialmente completas na caixa de mensagem de forma a facilitar o trabalho ao utilizador.

Os campos obrigatórios são validados de forma a verificar se estão preenchidos.

Caso exista algum erro, quer seja um campo obrigatório vazio ou inválido, o utilizador é notificado de que o formulário não está correto.

Caso contrário e esteja tudo correto, o utilizador é informado que submeteu o formulário com sucesso.


**Animações**

Foram usadas as bibliotecas de d3js, GSAP e Threejs, cada uma separada no seu próprio módulo, respetivamente chamados de, barChart.js, textToggle.js, animation3js.js

**d3js** 

Utilizada de forma a inserir um gráfico de barras animado.

Quando o utilizador chega à secção relevante na página pela primeira vez, na secção com o nome de "Conheça os nossos parceiros e o nosso impacto", é mostrado um gráfico de barras a crescer, que mostra
o crescimento de projetos realizados pela instituição desde 2016

Denota-se que além de d3js, foi utilizada a biblioteca SVG de forma a manipular objectos gráficos. No feedback da aula de 20/03 foi indicado para tornar os nomes de variáveis g e d (ambas agrupam instruções relativamente a como construir o gráfico) para algo mais claro,
contudo a biblioteca espera que estes nomes sejam especificamente indicados como g e d de forma a funcionar.

https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/g
https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d

**GSAP**

Utilizado para animar a secção de "Áreas de Investigação" de forma a criar um efeito de toggle.

Quando o utilizador toca no texto descritivo, existe uma animação feita através da função de timeline de GSAP que cria a ilusão de o texto a ser arrastado para fora da caixa, e a ser substituido por algumas métricas relevantes para a área.

Quando o utilizador toca nesta métricas, o texto descritivo faz "scroll" de volta, e as estatísticas desaparecem.

De forma a ser claro que isto é algo com que o utilizador poderá interagir, existe uma mudança do ponteiro do rato enquanto o ponteiro estiver em cima do texto e é mostrado um efeito de sombra à volta do container.

**Threejs**

Utilizado em combinação com o evento de Popup, na secção de Oportunidades.

Toma o formato de uma cruz verde 3D a rodar, na caixa de texto que aparece, de forma a chamar a atenção do utilizador.

**Eventos**

Todos os eventos estão presentes no módulo de events.js

**Galeria**

O primeiro evento encontra-se na secção de Apresentação no topo da página.

Existe uma galeria que roda pelas suas imagens automaticamente, permitindo também ao utilizador manualmente selecionar a próxima imagem à esquerda ou à direita, voltando à imagem inicial caso chegue 
à última da galeria

**Botão para voltar ao topo**

O segundo evento é um botão de voltar para cima.

Quando o utilizador desce o suficiente na página, aparece uma seta que permite ao utilizador tocar nela para voltar à secção superior da página.

**Popup**

O terceiro evento é um popup. Quando o utilizador passa 3 segundos na secção de Oportunidades, aparece um popup que permite ao utilizador passar imediamente para o formulário.

Este popup desaparece automaticamente se o utilizador sair da secção e pode voltar a aparecer até o utilizador tocar nele.

Caso o utilizador tocar nele, este popup nunca mais aparece até uma nova instância da página ser aberta.

Como indicado em Threejs, este Popup inclui a animação da cruz presente no seu container.
<img src="https://github.com/AF-Github1/TecnologiasWebCentroMedico-javascript/blob/main/ReadmeFiles/chrome_XCoiapmor3.gif" width="600">




