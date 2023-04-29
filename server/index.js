const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

const PORT = 5000;

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        let data = JSON.parse(msg);
        switch (data.method) {
            case "connection":
                connectionHandler(ws, data);
                break;
            case "draw":
                broadcastConnection(ws, data);
                break;
        }
        console.log(msg)
    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({msg: "Done"})
    }catch (e) {
        console.log(e)
        return res.status(500).send("error")
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64')
        res.json(data)
    }catch (e) {
        console.log(e)
        return res.status(500).send("error")
    }
})

app.listen(PORT, () => {
    console.log("Started on port: 5000")
})

const connectionHandler = (ws, data) => {
    ws.id = data.id
    broadcastConnection(ws, data)
}

const broadcastConnection = (ws, data) => {
    aWss.clients.forEach(client => {
        if (client.id === data.id) {
            client.send(JSON.stringify(data))
        }
    })
}
