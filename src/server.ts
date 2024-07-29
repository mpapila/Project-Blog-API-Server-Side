import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/main'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet';

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json())
app.use(cors())

app.use(compression());
app.use('/', indexRouter)

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self' 'unsafe-inline'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    }),
);


app.listen(port, () => {
    console.log('Server is running at 3000')
})