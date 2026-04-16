Tecnologias Web, PEI3 : WebAPI
Grupo 4

No âmbito deste projeto realizaram-se as implementações de indexedDB, e 3 integrações com API externas.


**indexedDB**

Implementado em indexeddb.js

Integrado com o formulário de contacto, newsletter e eventos, permitindo registar na base de dados, numa tabela própria, a informação dos utilizadores que entraram em contacto com a instituição através do site, e registar os subscritores à newsletter.
O newsletter foi implementado em newsletter.js, consistindo de um formulário que pede e valida o nome e email de um utilizador.

Adicionalmente, indexedDB está integrado com o formulário de eventos e com uma tabela de forma a garantir que um utilizador consiga ver as entradas atuais na tabela respectiva a eventos da base de dados, e manipular as entradas, permitindo mudar valores específicos ou eliminar linhas inteiras. Esta informação em si está integrada com o API de openstreetmap.

**openstreetmap API**

Implementação localizada em eventsMap.js

Através deste API mostra-se um mapa interativo no site. A integração com o indexedDB permite a que um utilizar consiga utilizar a informação fornecida para a localização de um evento, de forma a que este local seja demonstrado no mapa, caso seja possível encontrar a localização. Se não for possível, o utilizador será informado através de um alerta.


**Google Translate API**

Implementação localizada em translator.js

Através deste API, permitimos ao utilizador realizar traduções automáticas do texto no site para múltiplas linguagens, através de uma opção no header.


**RSS API**

Implementação localizada em index.html

Utilizado para meter um carousel de notícias relevantes médicas por parte da World Health Organization (WHO) debaixo da secção de contactos.
