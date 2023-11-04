const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use("/", express.static("public"))

app.get("/getDB", (req, res) => {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/database/data.json"), "utf8")
  )
  res.send(data.repere)
})

app.get("/verifyAdmin", (req, res) => {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/database/data.json"), "utf8")
  )
  const isAdmin = data.user[0].pass === req.query.password ? true : false
  res.send(isAdmin)
})

app.post("/addDB", (req, resp) => {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/database/data.json"), "utf8")
  )
  let id = Math.round(Math.random(1, 9999) * 100)
  while (data.repere.findIndex((item) => item.id === id) != -1) {
    id = Math.round(Math.random(1, 9999) * 100)
  }
  req.body.id = id
  data.repere.push(req.body)
  fs.writeFileSync(
    path.join(__dirname, "/database/data.json"),
    JSON.stringify(data, null, 2)
  )
  resp.send("element added")
})

app.put("/modifyDB/:id", (req, res) => {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/database/data.json"), "utf8")
  )
  const elementIndex = data.repere.findIndex(
    (item) => item.id === Number(req.params.id)
  )
  data.repere[elementIndex] = req.body
  fs.writeFileSync(
    path.join(__dirname, "/database/data.json"),
    JSON.stringify(data, null, 2)
  )
  res.send("element/elements modified")
})

app.delete("/deleteDB/:id", (req, res) => {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/database/data.json"), "utf8")
  )
  const elementIndex = data.repere.findIndex(
    (item) => item.id === Number(req.params.id)
  )
  data.repere.splice(elementIndex, 1)
  fs.writeFileSync(
    path.join(__dirname, "/database/data.json"),
    JSON.stringify(data, null, 2)
  )
  res.send("item deleted")
})

const server = app.listen("3000", () => {
  console.log("server started on http://localhost:3000")
})
