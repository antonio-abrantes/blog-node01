# Blog implementado com Node.js
    Projeto desenvolvido para fins didáticos

## Principais dependências
- Node.js 10.16.0
- Express 4.16.2
- Express Handlebars 3.0.0
- Mongoose 5.0.0

## Solução de erros
### Erro:
    SequelizeConnectionError: Client does not support authentication protocol requested by server; consider upgrading MySQL client
### Solução:
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

### Erro:
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