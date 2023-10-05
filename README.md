# sistema-banco
Back-end de um sistema de um banco, feito em JavaScript, Node.js. Usando API REST e JSON.

Acessar os recursos do programa através de um servidor local com porta 3000 (http://localhost:3000)

ROTAS:

GET /contas?senha_banco=Cubos123Bank : Lista todas as contas cadastradas (Banco de dados inicia zerado) (Senha do admin do banco requerida na quarry)
![Alt text](image-1.png)

POST /contas : Cadastra uma nova conta (precisa da validação da senha_banco na quarry)
![Alt text](image.png)

PUT /contas/:numeroConta/usuario : Atualiza uma conta existente
![Alt text](image-2.png)

DELETE /contas/:numeroConta : Exclui uma conta existente
![Alt text](image-3.png)

POST /transacoes/depositar : Realiza a operação de deposito em uma conta existente
![Alt text](image-4.png)

POST /transacoes/sacar : Saque em uma conta existente (Senha requerida no body da requisição, no formato JSON)
![Alt text](image-5.png)

POST /transacoes/transferir : Tranferência entre contas existentes (Senha requerida no body da requisição, no formato JSON)
![Alt text](image-6.png)

GET /contas/saldo?numero_conta=123&senha=123 : Exibir o saldo de uma conta existente (Senha requerida na quarry)
![Alt text](image-7.png)

GET /contas/extrato?numero_conta=123&senha=123 : Exibir o extrato (Histórico de transações: saque, saque e transferencias) de uma conta existente (Senha requerida na quarry)
![Alt text](image-8.png)