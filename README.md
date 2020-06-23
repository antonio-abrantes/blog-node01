# Blog implementado com Node.js
Projeto de microblog implementado em NodeJS, desenvolvido para fins didáticos, com deploy realizado na plataforma [Heroku](https://www.heroku.com/) e banco de dados hospedado na [MongoDB Atlas](https://cloud.mongodb.com).

## Principais recursos
- Node.js 10.16.0
- Express 4.16.2
- Express Handlebars 3.0.0
- Mongoose 5.9.20
- Connect Flash 0.1.1
- Passport 0.4.0
- Bcryptjs 2.4.3

## Links da aplicação
- [Home principal do Blog NodeJS](https://blog-node01.herokuapp.com/)
- [Painel administrativo](https://blog-node01.herokuapp.com/admin)
   - Credencias de teste com administrador: Usuário: teste@hotmail.com, Senha: 1234

## Solução de possiveis erros
### Erro 1:
    SequelizeConnectionError: Client does not support authentication protocol requested by server; consider upgrading MySQL client
### Solução:
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

### Erro 2:
    ...because it is not an "own property" of its parent...
### Solução
    npm i @handlebars/allow-prototype-access
```
    const _handlebars = require('handlebars'),
            expressHandlebars = require('express-handlebars'),
            {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

        //Código...

        app.engine('handlebars', expressHandlebars({
            handlebars: allowInsecurePrototypeAccess(_handlebars)
        }))
        app.set('view engine', 'handlebars')
```