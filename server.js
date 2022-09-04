const express = require('express')
const app = express()


var distDir = __dirname + "/dist/weatherapp";
app.use(express.static(distDir));


app.get('/api',(req, res) => {
    res.status(200).json({"status": 200, "message" : distDir})
})

app.get('/api/hello',(req, res) => {
    res.status(200).send(distDir)
} )


app.listen(3000, () => {
    console.log("Server Running")
})