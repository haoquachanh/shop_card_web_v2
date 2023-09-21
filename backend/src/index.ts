import 'reflect-metadata'
import express from 'express';
import router from './routes';
import { print } from './controllers/getActiveRoute';
import { renderRoutesList } from './routes-list';
const app = express(); 
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

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
