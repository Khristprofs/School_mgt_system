const express = require('express')

const app = express()

// middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World')
})

app.get('/about', (req, res) => {
    res.send('About page is for the purpose of the web app')
})

//Listen on port 3001
app.listen(3001, () => {
    console.log('server running at http://localhost:3001/')
})