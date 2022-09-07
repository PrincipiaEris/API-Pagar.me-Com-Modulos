# API-Pagar.me-Com-Modulos

API de pagamentos integrada ao gateway da pagar.me e com o banco de dados mongodb.

Você terá que editar o arquivo app.js na linha 21 para adicionar a sua string de conexão com o mongo atlas, além de criar um arquivo .env com a variável "KEY" para a chave secreta da pagar.me. A chave precisa já estar codificada em Base64 sem os "==" no final.

//--*//

Payments API integrated with the pay.me gateway and with the mongodb database.

You will have to edit the app.js file on line 21 to add your connection string to mongo atlas, in addition to creating an .env file with the variable "KEY" for the pay.me secret key. The key needs to be already encoded in Base64 with the "==" removed.
