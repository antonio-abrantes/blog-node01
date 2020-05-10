const express = require('express');
const router = express.Router();

// Chamada ao mongoose
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');

/*
router.get('/', (rec, res)=>{
    res.send();
});
*/

router.get('/', (req, res)=>{
    // res.send('Página principal do painel ADM');
    res.render('admin/index');
});

router.get('/posts', (req, res)=>{
    res.send('Página de Posts');
});

router.get('/categorias', (req, res)=>{ // Rota
    res.render('admin/categorias'); // nome da template
});

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res)=>{

    var erros = verificaErros(req);

    if(erros.length > 0){
        console.log(erros.length);
        res.render('admin/addcategorias', {erros: erros});
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria)
        .save()
        .then(()=>{
            req.flash('success_msg', "Categoria salva com sucesso!");
            //console.log("Success: "+ success_msg);
            res.redirect('/admin/categorias');
        })
        .catch((err)=>{
            req.flash('error_msg', "Erro ao salvar a categoria, tente novamente!");
            //console.log('Erro: '+ error_msg);
            res.redirect('/admin');
        });
    }
});

const verificaErros = (req) =>{
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 3){
        erros.push({texto: "Nome com caracteres minimos invalidos"});
    }

    return erros;
}

module.exports = router;