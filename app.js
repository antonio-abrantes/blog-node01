require("dotenv").config();
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
const usuarios = require('./routes/usuario');
const path = require('path');

// Autenticação
const passport = require('passport');
require("./config/auth")(passport);

// Models
require('./models/Categoria');
require('./models/Postagem');
const Categoria = mongoose.model('categorias');
const Postagem = mongoose.model('postagens');


// Configurações
    //Sessão
    app.use(session({
        secret: process.env.SECRET_SESSION,
        resave: true,
        saveUninitialized: true
    }));

    // Inicilização do Passport -> Importante que siga esta ordem abaixo da session
    app.use(passport.initialize());
    app.use(passport.session());

    //Flass -> Tem que ficar abaixo da sessão
    app.use(flash());

    //Middlewares
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });

    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //Handlebars
    app.engine('handlebars', expressHandlebars({ //handlebars
        defaultLayout: 'main',
        handlebars: allowInsecurePrototypeAccess(_handlebars)
    }));
    app.set('view engine', 'handlebars');

    //Arquivos estáticos
    app.use(express.static(path.join(__dirname, "public")));

    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
      })
    .then(() => {
        console.log('MongoDB conectado com sucesso!');
    })
    .catch(err => {
        console.log('Erro de conexão: ' + err);
    });
   
// Rotas
app.get('/', (req, res)=>{
    Postagem.find().populate("categoria").sort({date: 'desc'}).then((postagens) => {
        res.render('index', { postagens: postagens }); // nome da template
    }).catch((err) => {
        console.log(err);
        req.flash('error_msg', "Erro ao carregar postagens!");
        res.redirect('/404');
    });
});

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug})
        .then((postagem) =>{
            res.render('postagem/index', {postagem: postagem});
        })
        .catch((err) => {
            req.flash('error_msg', "Esta postagem não existe!");
            res.redirect('/');
        });
});

app.get('/categorias', (req, res)=>{
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
            res.render('categorias/index', { categorias: categorias }); // nome da template
        }).catch((err) => {
            req.flash('error_msg', "Erro ao carregar categorias!");
            res.redirect('/');
        });
});

app.get('/categorias/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug})
        .then((categoria) =>{

            Postagem.find({categoria: categoria._id}).sort({date: 'desc'})
                .then((postagens)=>{
                    res.render('postagem/postagens', {postagens: postagens, categoria: categoria});
                })
        })
        .catch((err) => {
            req.flash('error_msg', "Erro ao buscar categoria!");
            res.redirect('/');
        });
});

app.get('/404', (req, res)=>{
    res.send("Erro 404...");
});

app.use('/admin', admin); // Setando um grupo de rotas
app.use('/usuarios', usuarios); // Setando um grupo de rotas

// Outros
const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=>{
    console.log('Server on: http://localhost:'+PORT);
});