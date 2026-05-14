import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { brewRouter } from '../src/routes/brew.route.js';
import { troubleshootRouter } from '../src/routes/troubleshoot.route.js';





dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/brew', brewRouter);
app.use('/api/troubleshoot', troubleshootRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world! This is a server');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
