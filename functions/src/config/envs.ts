// import 'dotenv/config';
// import * as joi from 'joi';

// interface EnvVars {
// 	PORT: number;
// 	JWT_SECRET: string;
// 	DATABASE_NAME: string;
// 	DATABASE_USERNAME: string;
// 	DATABASE_PASSWORD: string;
// 	DATABASE_HOST: string;
// 	DATABASE_PORT: number;
// }

// const envVarsSchema = joi
// 	.object({
// 		//* Application Configuration
// 		PORT: joi
// 			.number()
// 			.required()
// 			.description('Port number for the application'),

// 		//* JWT Configuration
// 		JWT_SECRET: joi
// 			.string()
// 			.required()
// 			.description('JWT secret key for signing tokens'),

// 		//* Database Configuration
// 		DATABASE_NAME: joi.string().required().description('Database name'),
// 		DATABASE_USERNAME: joi
// 			.string()
// 			.required()
// 			.description('Database username'),
// 		DATABASE_PASSWORD: joi
// 			.string()
// 			.required()
// 			.description('Database password'),
// 		DATABASE_HOST: joi.string().required().description('Database host'),
// 		DATABASE_PORT: joi.number().required().description('Database port'),
// 	})
// 	.unknown(true);

// const { error, value } = envVarsSchema.validate(process.env);
// if (error) {
// 	throw new Error(`Config validation error: ${error.message}`);
// }

// const envVars: EnvVars = value;

// export const envs = {
// 	port: envVars.PORT,
// 	jwtSecret: envVars.JWT_SECRET,
// 	database: {
// 		name: envVars.DATABASE_NAME,
// 		username: envVars.DATABASE_USERNAME,
// 		password: envVars.DATABASE_PASSWORD,
// 		host: envVars.DATABASE_HOST,
// 		port: envVars.DATABASE_PORT,
// 	},
// };
