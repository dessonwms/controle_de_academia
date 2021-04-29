const fs = require('fs')
const data = require("../data.json")
const { date } = require('../utils')

// INDEX
exports.index = function(req, res){ 
    return res.render('members/index', { members: data.members })
}

// SHOW
exports.show = function(req, res){
    // req.params
    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found!")

    // Sistema de espalhamento (usado para formatar informações antes de exibi-las)
    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
    }

    return res.render("members/show", { member })
}

// CREATE
exports.create = function(req, res){
    return res.render('members/create')
}

// POST
exports.post = function(req, res){

    // valida os dados do formulário
    const keys = Object.keys(req.body)

    for (key of keys){
        if( req.body[key] == "" ){
            return res.send('Please, fill all fields') 
        }
    }

    // Desestruturando a variavel req.body
    let { 
        avatar_url, 
        name, 
        email,
        birth, 
        gender, 
        blood,
        weight,
        height 
    } = req.body

    // Formata data de nascimento
    birth = Date.parse(birth)

    // Cria um ID único para o cadsatro de instrutores
    let id = 1
    const lastMember = data.members[data.members.length - 1]

    if( lastMember ) {
        id = lastMember.id + 1
    }
    

    // Adiciona novas informações no array para salvar no arquivo
    data.members.push({
        id,
        avatar_url, 
        name, 
        email,
        birth, 
        gender, 
        blood,
        weight,
        height
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err){
        if (err) return res.send("Write file error!")

        return res.redirect("/members")
    })

    //return res.send(req.body)
}

// EDIT
exports.edit = function(req, res){
    
    // req.params
    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found!")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    } 
    
    return res.render('members/edit', { member })
}

// PUT
exports.put = function(req, res){

    // req.body
    const { id } = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex){
        if( id == member.id ){
            index = foundIndex
            return true
        }
    })

    if(!foundMember) return res.send("Member not found!")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/members/${id}`)
    })
}

// DELETE
exports.delete = function(req, res){
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/members")
    })
}