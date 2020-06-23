const express = require('express');
const router = express.Router();

// Chamada ao mongoose
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/registro', (req, res)=>{
    res.render("usuarios/registro");
});

router.post('/registro', (req, res)=>{

  const novoUsuario = new Usuario({
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha
  });

  let erros = [];

  if(!novoUsuario.nome || typeof novoUsuario.nome == undefined || novoUsuario.nome == null){
    erros.push({texto: "Nome inválido"});
  }

  if(!novoUsuario.email || typeof novoUsuario.email == undefined || novoUsuario.email == null){
    erros.push({texto: "E-mail inválido"});
  }

  if(!novoUsuario.senha || typeof novoUsuario.senha == undefined || novoUsuario.senha == null){
    erros.push({texto: "Senha inválida"});
  }

  if(novoUsuario.senha.length < 4){
    erros.push({texto: "Senha precisa ter 4 ou mais caracteres"});
  }

  if(novoUsuario.senha != req.body.senha2){
    erros.push({texto: "Senhas diferentes, tente novamente!"});
  }

  // console.log(erros);
  // console.log(req.body);

  if(erros.length > 0){
    let userTemp = {nome: novoUsuario.nome, email: novoUsuario.email}
    res.render("usuarios/registro", {erros: erros, usuario: userTemp});
  }else{
    Usuario.findOne({email: novoUsuario.email})
      .then((usuario)=>{
        if(usuario){
          req.flash('error_msg', "Já existe uma conta cadastrada com este e-mail!");
          res.redirect('/usuarios/registro');
        }else{

          bcrypt.genSalt(10, (erro, salt)=>{
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
              if(erro){
                req.flash('error_msg', "Erro ao salvar usuário!");
                res.redirect('/usuarios/registro');
              }

              novoUsuario.senha = hash;
              novoUsuario.save().then(()=>{
                req.flash('success_msg', "Conta criada com sucesso!");
                res.redirect('/');
              })
              .catch((err) => {
                req.flash('error_msg', "Erro ao criar conta!");
                res.redirect('/usuarios/registro');
              });

            });
          });
        }
      })
      .catch((err) => {
          req.flash('error_msg', "Houve um erro interno!");
          res.redirect('/');
      });  
  }
});

router.get('/login', (req, res)=>{
  res.render("usuarios/login");
});

router.post('/login', (req, res, next)=>{

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res)=>{
  req.logOut();
  req.flash('success_msg', "Logout efetuado com sucesso!");
  res.redirect('/');
});

module.exports = router;