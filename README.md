# api_chat
 esta é uma Api web que usa o socket.io para criar um chat ao vivo. desafio completo de desenvolvedor backend pleno.

# LiveChat API:
1.para usar o live chat: após realizar as configurações abaixo e inicializar o servidor, basta acessar no navegador a rota raíz GET: /
2.crie um usuário clicando no botão registrar
3.faça o login
4.divirta-se

 ## Desafios enfrentados
 .Foi bem divertido construir esta a aplicação, o desafio mais complicado foi configurar o sequelize visto
 .que se trata de uma ORM bem antiga e sou acostumado a usar o prisma que faz a maioria das coisas de forma
 .automática.
 .Outro desafio foi o uso do socket.io, primeira vez usando-o e achei ele bem intuitivo e direto ao ponto.
 .trabalhar com aquilo que não estamos acostumados é sempre um grande desafio, mas o deve tem que está
 .sempre preparado para solucionar problemas, independente da ferramenta que ele vá usar.
 .gostaria de ter trabalho mais neste projeto, documentando ele via swagger, porém não vi necessidade visto
 .que se trata apenas de um crud simples sem interações com várias rotas, além disto a aplicação está utilizando
 .o jest para testar as rotas e os serviços.

### Rotas via insomnia

![crud](./src/assets/crud.gif)

### Aplicação LiveChat

![chat](./src/assets/chat.gif)

## Frameworks e libs usadas:
```json
{
   "bcrypt": "^5.1.1",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.9.7",
    "sequelize": "^6.37.3",
    "socket.io": "^4.7.5",
    "zod": "^3.23.4"
  },
```

## Como iniciar o servidor:

vincule seu banco de dados
```
renomeie o arquivo ".env.example" para apenas ".env" e adicione o seu servidor mysql, conforme o exemplo mostrado
```

### instale o node no projeto
```javascript
npm install
```

### rode as migrações do sequelize no projeto
certifique de está corretamente configurado e limpo o seu banco de dados.
```
npx sequelize db:migrate
```

### rodar o servidor:
```
npm run dev
```

### rodar o test(jest):
```
npm run test
```

# Documentação Completa:

## Rotas de Usuário

### Registrar usuário: POST /users/register

Padrão de Corpo:
```json
{
	"firstName": "john",
	"lastName": "doe",
	"email": "johndoe@gmail.com",
	"password": "12345"
}
```

Padrão de Resposta (STATUS 201):
```json
{
	"id": 1,
	"firstName": "john",
	"lastName": "doe",
	"email": "johndoe@gmail.com",
	"createdAt": "2024-05-01T00:13:37.621Z"
}

```
Possíveis erros:

403 FORBIDDEN

```json
{
	"message": "E-mail already registered"
}
```

### Logar usuário: POST /users/login

Padrão de Corpo:
```json
{
	"email": "john_doe@mail.com",
	"password": "12345678"
}
```

Padrão de Resposta (STATUS 200):
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU1LCJpYXQiOjE3MTQ1MjI0ODQsImV4cCI6MTcxNzExNDQ4NH0.nUersErXnjOdvdyx5hC7t3bXXx6JA3ESDga3FukCn_w",
	"user": {
		"id": 1,
		"firstName": "john",
		"lastName": "doe",
		"email": "johndoe@gmail.com",
		"createdAt": "2024-05-01T00:13:37.000Z",
		"updatedAt": "2024-05-01T00:13:37.000Z"
	}
}
```

### Obter usuários(necessário autorização): GET /users
Forneça um token de usuário válido:
```json
{
  "headers": {
    "Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA4NTQ2MDQzfQ.pDcRf1yu1XmVaIrRLOBoa6O_8Ukl1lxX-6lkxwcJRtI"
 }
}
```

Padrão de Resposta (STATUS 200):
```json
[
{
	"id": 1,
	"firstName": "john",
	"lastName": "doe",
	"email": "johndoe@gmail.com",
	"createdAt": "2024-05-01T00:13:37.000Z",
	"updatedAt": "2024-05-01T00:13:37.000Z"
}
]
```


### Atualizar um usuários(necessário autorização): PATCH /users/:id
Forneça um token de usuário válido:
```json
{
  "headers": {
    "Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA4NTQ2MDQzfQ.pDcRf1yu1XmVaIrRLOBoa6O_8Ukl1lxX-6lkxwcJRtI"
  }
}
```

Padrão de Corpo:
```json
{
	"firstName": "john2",
	"lastName": "doe2",
	"email": "johndoe2@gmail.com",
  "password": "12345"
}
```

Padrão de Resposta (STATUS 200):
```json
{
	"id": 155,
	"firstName": "john2",
	"lastName": "doe2",
	"email": "johndoe2@gmail.com",
	"createdAt": "2024-05-01T00:13:37.000Z",
	"updatedAt": "2024-05-01T00:20:16.034Z"
}
```

### Deletar um usuário(necessário autorização): DELETE /users/:id
Forneça um token de usuário válido:
```json
{
  "headers": {
    "Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA4NTQ2MDQzfQ.pDcRf1yu1XmVaIrRLOBoa6O_8Ukl1lxX-6lkxwcJRtI"
  }
}
```

Padrão de Resposta (STATUS 204):
```json
no body returned for response
```