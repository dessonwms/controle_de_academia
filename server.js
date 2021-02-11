const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')

const server = express()

// Inclusão dos arquivos
server.use(express.static('public'))
server.use(routes)

// Configuração da Template Engine
server.set("view engine", "njk")
nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

// Cria o servidor da aplicação
server.listen(5000, function() {
    console.log("Server is running")
})