import { repl } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const replServer = await repl(AppModule);
  replServer.setupHistory('.nest/auth.repl.log', (err) => {
    if (err) {
      console.error(err);
    }
  });
}

bootstrap();
