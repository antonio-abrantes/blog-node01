const express = require('express');
const router = express.Router();

// Chamada ao mongoose
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');
const Categoria = mongoose.model('categorias');
const Postagem = mongoose.model('postagens');

const {eAdmin} = require("../helpers/eAdmin");

router.get('/', eAdmin, (req, res) => {
    // res.send('Página principal do painel ADM');
    res.render('admin/index');
});

router.get('/categorias', eAdmin , (req, res) => { // Rota
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
            res.render('admin/categorias', { categorias: categorias }); // nome da template
        }).catch((err) => {
            req.flash('error_msg', "Erro ao carregar categorias!");
            res.redirect('/admin');
        });
});

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias');
});

router.post('/categorias/nova', eAdmin, (req, res) => {

    var erros = verificaErros(req);

    if (erros.length > 0) {
        console.log(erros.length);
        res.render('admin/addcategorias', { erros: erros });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria)
            .save()
            .then(() => {
                req.flash('success_msg', "Categoria salva com sucesso!");
                //console.log("Success: "+ success_msg);
                res.redirect('/admin/categorias');
            })
            .catch((err) => {
                req.flash('error_msg', "Erro ao salvar a categoria, tente novamente!");
                //console.log('Erro: '+ error_msg);
                res.redirect('/admin');
            });
    }
});

const verificaErros = (req) => {
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" });
    }

    if (req.body.nome.length < 3) {
        erros.push({ texto: "Nome com caracteres minimos invalidos" });
    }

    return erros;
}

router.get('/categorias/edit/:id', eAdmin, (req, res)=>{
    Categoria.findOne({_id: req.params.id})
        .then((categoria) =>{
            res.render('admin/editcategorias', {categoria: categoria});
        })
        .catch((err) => {
            req.flash('error_msg', "Esta categoria não existe!");
            res.redirect('/admin/categorias');
        });
});

router.post('/categorias/edit', eAdmin, (req, res) =>{
    Categoria.findOne({_id: req.body.id})
        .then((categoria) =>{
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;
            categoria.save()
                .then(()=>{
                    req.flash('success_msg', "Categoria editada com sucesso!");
                    res.redirect('/admin/categorias');
                })
                .catch((err) => {
                    req.flash('error_msg', "Erro interno ao salvar categoria!");
                    res.redirect('/admin/categorias');
                });
        })
        .catch((err) => {
            req.flash('error_msg', "Erro ao aditar categoria!");
            res.redirect('/admin/categorias');
        });
}); 

router.post('/categorias/deletar', eAdmin, (req, res) =>{
    Categoria.remove({_id: req.body.id})
        .then(()=>{
            req.flash('success_msg', "Categoria deletada com sucesso!");
            res.redirect('/admin/categorias');
        })
        .catch((err) => {
            req.flash('error_msg', "Erro interno deletar categoria!");
            res.redirect('/admin/categorias');
        });
});

/**
 *  Rotas de postagens
 */

router.get('/postagens', eAdmin, (req, res) =>{

    Postagem.find().populate("categoria").sort({date: 'desc'}).then((postagens) => {
        res.render('admin/postagens', { postagens: postagens }); // nome da template
    }).catch((err) => {
        req.flash('error_msg', "Erro ao carregar postagens!");
        res.redirect('/admin');
    });
});

router.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find()
        .then((categorias)=>{
            res.render('admin/addpostagem', {categorias: categorias});
        });
});

router.post('/postagens/nova', eAdmin, (req, res) => {

    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
    }

    console.log(req.body);

    new Postagem(novaPostagem)
        .save()
        .then(() => {
            req.flash('success_msg', "Postagem salva com sucesso!");
            //console.log("Success: "+ success_msg);
            res.redirect('/admin/postagens');
        })
        .catch((err) => {
            req.flash('error_msg', "Erro ao salvar a postagem, tente novamente!");
            //console.log('Erro: '+ error_msg);
            res.redirect('/admin/postagens');
        });
});

router.get('/postagens/edit/:id', eAdmin, (req, res)=>{
    Postagem.findOne({_id: req.params.id})
        .then((postagem) =>{

            Categoria.find()
                .then((categorias)=>{
                    res.render('admin/editpostagens', {postagem: postagem, categorias: categorias});
                })
                .catch((err) => {
                    req.flash('error_msg', "Erro ao listar categorias");
                    res.redirect('/admin/postagens');
                });
        })
        .catch((err) => {
            req.flash('error_msg', "Esta postagem não existe!");
            res.redirect('/admin/postagens');
        });
});

router.post('/postagens/edit', eAdmin, (req, res) =>{
    Postagem.findOne({_id: req.body.id})
        .then((postagem) =>{
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;
            postagem.save()
                .then(()=>{
                    req.flash('success_msg', "Postagem editada com sucesso!");
                    res.redirect('/admin/postagens');
                })
                .catch((err) => {
                    req.flash('error_msg', "Erro interno ao salvar postagem!");
                    res.redirect('/admin/postagens');
                });
        })
        .catch((err) => {
            req.flash('error_msg', "Erro ao aditar postagem!");
            res.redirect('/admin/postagens');
        });
});

router.get('/postagens/deletar/:id', eAdmin, (req, res) =>{
    Postagem.remove({_id: req.params.id})
        .then(()=>{
            req.flash('success_msg', "Postagem deletada com sucesso!");
            res.redirect('/admin/postagens');
        })
        .catch((err) => {
            req.flash('error_msg', "Erro interno deletar postagem!");
            res.redirect('/admin/postagens');
        });
});

module.exports = router;