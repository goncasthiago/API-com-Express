const fs = require('fs')
const { join } = require('path');

const filePath = join(__dirname, 'users.json')

const getUsers = () => {
    const data = fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
    : []
    try{
        return JSON.parse(data)
    }catch {
        return []
    }
}

const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))

const userRoute = (app) => {
    app.route('/users/:id?')
        .get((req,res) => {
            const users = getUsers()
            res.send({users})
        })
        .post((req,res) => {
            const users = getUsers()
            users.push(req.body)
            saveUser(users)
            res.send(201).send('Ok')
        })
        .put((req,res) => {
            const users = getUsers()
            saveUser(users.map(user => {
                if (user.id === req.params.id) {
                    return {
                        ...user,
                        ...req.body
                    }
                } else {
                    return user
                }

                }))
            res.send(201).send('Ok')
        })
        .delete((req,res) => {
            const users = getUsers()
            saveUser(users.filter(user => user.id !== req.params.id))
            res.send(201).send('Ok')
        })
}

module.exports = userRoute