import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/main'
import cors from 'cors'

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json())
app.use(cors())


app.use('/', indexRouter)


app.listen(port, () => {
    console.log('Server is running at 3000')
})