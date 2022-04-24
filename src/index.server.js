const express = require('express');
const React = require('react');
const renderToString = require('react-dom/server').renderToString
const App = require('../src/client/app/App').default

const app = express();

app.get('/', (req, res) => {

})


app.listen(3000, ()=>{
    console.log('listening on port 3000 from index.server.js')
})