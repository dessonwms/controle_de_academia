const fs = require('fs')
const data = require("../data.json")
const { age, date } = require('../utils')

// INDEX
exports.index = function(req, res){ 
    return res.render('instructors/index', { instructors: data.instructors })
}

// SHOW
exports.show = function(req, res){
    // req.params
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!")

    // Sistema de espalhamento (usado para formatar informações antes de exibi-las)
    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", { instructor })
}

// CREATE
exports.create = function(req, res){
    return res.render('instructors/create')
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
    let { avatar_url, name, birth, gender, services } = req.body

    // Formata data de nascimento
    birth = Date.parse(birth)

    // Cria data de cadastro e adiciona mais um campo no req.body
    const created_at = Date.now()

    // Cria um ID único para o cadsatro de instrutores
    const id = Number(data.instructors.length + 1)

    // Adiciona novas informações no array para salvar no arquivo
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err){
        if (err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })

    //return res.send(req.body)
}

// EDIT
exports.edit = function(req, res){
    
    // req.params
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    } 
    
    return res.render('instructors/edit', { instructor })
}

// PUT
exports.put = function(req, res){

    // req.body
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if( id == instructor.id ){
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })
}

// DELETE
exports.delete = function(req, res){
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })
}