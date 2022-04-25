const React = require('react');
const { createServer: createViteServer } = require('vite')
const bundle_model = require('./src/backend/db_functions');
let dotenv = require('dotenv');
const axios = require('axios');
const express = require("express");
const app = express();
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
dotenv.config()



async function createServer() {
    const app = express()
  
    // Create Vite server in middleware mode. This disables Vite's own HTML
    // serving logic and let the parent server take control.
    //
    // In middleware mode, if you want to use Vite's own HTML serving logic
    // use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
    const vite = await createViteServer({
      server: { middlewareMode: 'ssr' }
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  
    app.use('/', async (req, res, next) => {
        const url = req.originalUrl
      
        try {
          // 1. Read index.html
          let template = fs.readFileSync(
            path.resolve(__dirname, 'index.html'),
            'utf-8'
          )
      
          // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
          //    also applies HTML transforms from Vite plugins, e.g. global preambles
          //    from @vitejs/plugin-react
          template = await vite.transformIndexHtml(url, template)
      
          // 3. Load the server entry. vite.ssrLoadModule automatically transforms
          //    your ESM source code to be usable in Node.js! There is no bundling
          //    required, and provides efficient invalidation similar to HMR.
          const { render } = await vite.ssrLoadModule('/src/client/main.jsx')
      
          // 4. render the app HTML. This assumes entry-server.js's exported `render`
          //    function calls appropriate framework SSR APIs,
          //    e.g. ReactDOMServer.renderToString()
          const appHtml = await render(url)
      
          // 5. Inject the app-rendered HTML into the template.
          const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      
          // 6. Send the rendered HTML back.
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
          // If an error is caught, let Vite fix the stracktrace so it maps back to
          // your actual source code.
          vite.ssrFixStacktrace(e)
          next(e)
        }
      })
  
      app.post('/message', async (req,res) =>{

        res.send('messsage');
        var id = req.body.message_id;
        
        axios
        .get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages/${id}`,{
          headers: {
            authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
          }
        })
        .then(result => {
          console.log(`statusCode: ${result.status}`)
          console.log(result.data)
          res.send(result.data)
        })
        .catch(error => {
          console.error(error)
        })
        
        }
        )
        
        app.post('/messages', async (req,res) =>{
        
          res.send('messsages');
        
          var unique_id = req.body.unique;
        
        axios
        .get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages?q=in:sent subject:${unique_id}`,{
          headers: {
            authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
          }
        })
        .then(result => {
          console.log(`statusCode: ${res.status}`)
          console.log(result.data.messages)
          res.send(result.data.messages)
        })
        .catch(error => {
          console.error(error)
        })
        
        }
        )
        
        app.get("/api", (req, res) => {
            res.json({ message: "Hello from server!" });
          });
        
          app.get('/unique',  async (req, res) => {
          
            array = await bundle_model.getUniqueID();
        
            console.log("array ids" + array);
            res.send(array);
          })
        
        app.post('/email', (req, res) => {
          res.send('email');
        
          var name = req.body.name
          var email = req.body.email
          var question = req.body.question
          var unique_id = req.body.unique_id
          console.log('emails' + email);
          console.log('questions' + question);
          console.log('inside post request' + unique_id);
            const OAuth2 = google.auth.OAuth2
          
            const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
        
            OAuth2_client.setCredentials( { refresh_token: process.env.GMAIL_REFRESH_TOKEN } );
        
            const accessToken = OAuth2_client.getAccessToken();
        
            const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken
            }
          })
            
            const mail_options_two = {
              from: 'You & Yours admin <admin@youandyours.io',
              to: email, 
              subject: 'Email from You & Yours web app' + '(Email ID: ' + unique_id + ')',
              html: '<h6>' + question  +'</h6>'
          }
            transport.sendMail( mail_options_two, function(error, result){
            if(error){
                  console.log('Error: ',  error)
              }
              else {
                  console.log("Success woo!:  ", result)
                  id_queue.push({
                  id: unique_id,
                  results: result
                  })
              }
              transport.close()
          })
        
        })
        
        app.post('/bundle', (req, res) => {
          res.send('bundle');
          var name = req.body.name
          var unique_id = req.body.unique_id
          const objCreate = {
            values: [name, unique_id]
          }
          bundle_model.createBundle(objCreate);
        });
        
    
      app.listen(3000, () => {
          console.log(`Server listening on 3000`);
        });
  }
  
  createServer()

