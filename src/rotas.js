const express = require('express')

const controlador = require('./controladores/controlador.js')

const rotas = express()

rotas.get('/contas', controlador.verificarSenhaBanco, controlador.listarContas)

rotas.post('/contas', controlador.verificarSenhaBanco, controlador.cadastrarConta)

rotas.put('/contas/:numeroConta/usuario', controlador.verificarSenhaBanco, controlador.atualizarConta)

rotas.delete('/contas/:numeroConta', controlador.verificarSenhaBanco, controlador.excluirConta)

rotas.post('/transacoes/depositar', controlador.depositar)

rotas.post('/transacoes/sacar', controlador.sacar)

rotas.post('/transacoes/transferir', controlador.transferir)

rotas.get('/contas/saldo', controlador.saldo)

rotas.get('/contas/extrato', controlador.extrato)

module.exports = rotas