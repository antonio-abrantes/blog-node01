const express = require("express");
const _handlebars = require('handlebars'),
    expressHandlebars = require('express-handlebars'), 
    {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const admin = require('./routes/admin');
const path = require('path');

// Configurações
    //Sessão
    app.use(session({
        secret: "qualquercoisa",
        resave: true,
        saveUninitialized: true
    }));

    //Flass -> Tem que ficar abaixo da sessão
    app.use(flash());

    //Middlewares
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        
        next();
    });

    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //Handlebars
    app.engine('handlebars', expressHandlebars({
        defaultLayout: 'main',
        handlebars: allowInsecurePrototypeAccess(_handlebars)
    }));
    app.set('view engine', 'handlebars');

    //Arquivos estáticos
    app.use(express.static(path.join(__dirname, "public")));

    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp")
    .then(() => {
        console.log('MongoDB conectado com sucesso!');
    })
    .catch(err => {
        console.log('Erro de conexão: ' + err);
    });
   
// Rotas
app.get('/', (req, res)=>{
    res.send('Pagina inicial');
});

app.use('/admin', admin); // Setando um grupo de rotas

// Outros
const PORT = 8081;
app.listen(PORT, ()=>{
    console.log('Server on: http://localhost:'+PORT);
});