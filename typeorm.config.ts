import * as dotenv from 'dotenv'
import { User } from './src/entities/user.entity';
import { DataSource } from 'typeorm'
import { Treatment } from './src/entities/treatment.entity';
import { Patient } from './src/entities/patient.entity';
import { Appointment } from './src/entities/appointment.entity';



dotenv.config(); 

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Treatment, Patient, Appointment],
    migrations: ['./src/migrations/*.ts']
    
});
