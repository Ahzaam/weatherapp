const express = require('express')
const app = express()


var distDir ="./dist/weatherapp";
app.use(express.static(distDir));


app.get('/api',(req, res) => {
    res.status(200).json({"status": 200, "message" : "Hello World"})
})

app.get('/api/hello',(req, res) => {
    res.status(200).send('I love JavaScript')
} )


app.listen(3000, () => {
    console.log("Server Running")
})