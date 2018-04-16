const express = require('express');
const socket = require('socket.io');
const app = express();

app.use('/public', express.static(__dirname + '/app'));
app.use('/vast', express.static(__dirname + '/vast'));
app.get('/vast', (request, response) => response.setHeader('Access-Control-Allow-Origin', request.get('origin')));
app.get('/', (request, response) => response.sendFile(__dirname + '/app/app.html'));

const server = app.listen(8080, () => console.log('Ready!'));

const io = socket.listen(server);
