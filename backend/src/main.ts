import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = new DocumentBuilder()
		.setTitle('School Management API')
		.setDescription('The School Management API description')
		.setVersion('0.0.1')
		.addBearerAuth(
			{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			'access-token'
		)
		.addApiKey(
			{
				type: 'apiKey',
				name: 'secret_key',
				in: 'header',
				description: 'API key',
			},
			'secret_key'
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/doc', app, document, {
		customCss: '.swagger-ui .topbar { display: none;}',
	});

	// Enable CORS
	app.enableCors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
		credentials: true,
	});

	// Enable global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	);

	// Global API prefix
	app.setGlobalPrefix('api');

	const port = process.env.PORT || 3000;
	await app.listen(port);

	console.log(`🚀 Server running on http://localhost:${port}`);
	console.log(`📚 API available at http://localhost:${port}/api`);
	console.log(`📚 API available at http://localhost:${port}/api/doc`);
}

bootstrap();
