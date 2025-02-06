### Setup do ambiente local

1 - `npm i`

2 - `npx sls`

3 - `npx sls dynamodb install`

4 - `npx tsc`

5 - `npm run dev`

### Testes

Abaixo serão listados os comandos para executar os testes, para os testes de integração é necessário ter o servidor de dev local rodando (siga o "Setup do ambiente local").
Os comandos de teste são:

-   Todos os testes com cobertura: `npm run test`
-   Testes unitários: `npm run unit-test`
-   Testes unitários com cobertura: `npm run unit-test-coverage`
-   Testes de integração: `npm run integration-test`

Se necessário, o valor de "x-api-key", dentro dos headers das requisições nos testes de integração, devem ser mudados para o valor que aparece quando o servidor local é iniciado na sua máquina.
