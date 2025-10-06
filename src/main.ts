import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT ?? 3000;
	await app.listen(port);
	console.log(
		`\x1b[96m🚀 Server is running on http://localhost:${port}/graphql\x1b[0m`,
	);
}

void bootstrap();
