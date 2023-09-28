import 'reflect-metadata'
import cors from 'cors'
import express from 'express';
import router from './routes';
import { print } from './controllers/getActiveRoute';
import { renderRoutesList } from './config/routes-list';
import { checkOrigin } from './middlewares/checkOrigins';
const multer = require('multer');
const app = express(); 
const port = process.env.PORT || 3001;

const allowedOrigins = [process.env.CLIENT_URL, process.env.HOST_URL, process.env.HOST_URL2, process.env.MANAGER_URL, process.env.MAIN_URL];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.use(checkOrigin)
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
