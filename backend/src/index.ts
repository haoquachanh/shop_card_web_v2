import 'reflect-metadata'
import cors from 'cors'
import express from 'express';
import router from './routes';
import { print } from './controllers/getActiveRoute';
import { renderRoutesList } from './config/routes-list';
import bodyParser from 'body-parser';
const multer = require('multer');
const app = express(); 
const port = process.env.PORT || 3001;

const allowedOrigins = [process.env.CLIENT_URL, process.env.HOST_URL, process.env.HOST_URL2, process.env.MANAGER_URL, process.env.MAIN_URL];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use('/api', router)

app.get('/routes-list',(req,res)=>{

  let list=[]
  app._router.stack.forEach((layer) => {
    const values = print([], layer);
    list.push(...values);
  })
  let htmlpage=renderRoutesList(list)
  res.send(htmlpage)
})
app.get('*', (req, res) => {res.send("SERVER IS RUNNING")})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
