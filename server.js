const express = require('express')
const app = express()
const cors = require('cors')
const { registerUser, verifyCredentials, getUser } = require('./querys')
const jwt = require("jsonwebtoken")

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.listen(3000, console.log("SERVER ON"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
    })

app.post("/usuarios", async (req, res) => {
    try {
    const user = req.body
    await registerUser(user)
    res.send("Usuario creado con éxito")
    } catch (error) {
    res.status(500).send(error)
    }
    })

app.post("/login", async (req, res) => {
    try {
    const { email, password } = req.body
    await verifyCredentials(email, password)
    const token = jwt.sign({ email }, "az_AZ")
    res.send(token)
    } catch (error) {
    console.log(error)
    res.status(error.code || 500).send(error)
    }
    })

app.get("/usuarios", async (req, res) => {
    try {
    const { id } = req.params
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, "az_AZ")
    const { email } = jwt.decode(token)
    await getUser(id)
    res.send(`El usuario ${email} ha sido autenticado`)
    } catch (error) {
    res.status(error.code || 500).send(error)
    }
    })