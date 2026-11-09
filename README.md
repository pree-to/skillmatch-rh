# SkillMatch RH

Aplicação web estática para apoiar o recrutamento: o RH cadastra uma vaga e o sistema compara seus requisitos com as habilidades de candidatos cadastrados em um arquivo JSON.

## Tecnologias
- HTML5 semântico e acessível
- CSS3 com Flexbox e layout responsivo
- JavaScript puro com módulos ES
- Fetch API e async/await para carregar os candidatos
- LocalStorage para salvar e recuperar a última vaga analisada

## Como executar
1. Abra a pasta do projeto no Visual Studio Code.
2. Inicie a extensão **Live Server** pelo arquivo `index.html`.
3. A aplicação será aberta no navegador. Não abra o HTML diretamente pelo sistema de arquivos, pois o projeto carrega o JSON com `fetch`.

## Como utilizar
1. Informe o cargo e selecione a área profissional.
2. Digite os requisitos separados por vírgulas (por exemplo: `HTML, CSS, JavaScript, Git`).
3. Informe a experiência mínima em meses.
4. Clique em **Analisar candidatos**.
5. Confira o ranking, o percentual de compatibilidade, os requisitos atendidos e os pontos de desenvolvimento sugeridos.

## Regras de compatibilidade
O percentual considera a proporção de requisitos da vaga atendidos pelo candidato: requisitos atendidos divididos pelo total de requisitos, multiplicado por 100. A classificação é Alta (80% a 100%), Média (50% a 79%) ou Baixa (0% a 49%). Em caso de empate, o candidato com maior experiência aparece primeiro. A experiência mínima também é sinalizada nos resultados.

## Estrutura
- `index.html`: estrutura e formulário da aplicação.
- `assets/styles/index.style.css`: identidade visual, Flexbox e responsividade.
- `assets/scripts/main.js`: inicialização e integração dos módulos.
- `assets/scripts/dados.js`: carregamento do JSON e persistência no LocalStorage.
- `assets/scripts/motor.js`: classes, herança, cálculo e classificação de compatibilidade.
- `assets/scripts/ui.js`: eventos, validação e criação dinâmica dos resultados no DOM.
- `assets/dados/candidatos.json`: banco fictício com seis candidatos.

## Programação JavaScript aplicada
O projeto utiliza arrays e objetos, `map`, `filter` e `reduce`, classes e herança, callback, closure, eventos, manipulação do DOM, Fetch API, tratamento de erros e LocalStorage.

## Observação
Os dados dos candidatos são fictícios e utilizados exclusivamente para fins acadêmicos.
