const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const PORT = 5000;

app.ws('/', (ws, req) => {
    ws.send('Connected successfully')
    ws.on('message', (msg) => {
        let data = JSON.parse(msg);
        switch (data.method) {
            case "connection":
                connectionHandler(ws, data);
                break;
        }
        console.log(msg)
    })
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
            client.send(`User ${data.username} connected`)
        }
    })
}
