import 'dotenv/config';
import colors from "colors"
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
    console.log(colors.cyan.bold( `🚀 Server running on port ${env.port} [${env.nodeEnv}]`));
});