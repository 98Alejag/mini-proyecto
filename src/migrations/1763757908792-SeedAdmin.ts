import { MigrationInterface, QueryRunner } from "typeorm";
const ADMIN_EMAIL = 'admin@routify.com';
const ADMIN_HASH = '$2b$10$46LRH3Z7D.j1PruDIgnYvuBdnX7rVAIlobTd2KhJUrG3Q00qC5G3q'; // ejemplo para 'admin123'
const ADMIN_NAME = 'Administrador';
const ADMIN_PHONE = '3000000000'; // Cambia por un número real si lo deseas
const ADMIN_ADDRESS = 'Dirección Admin'; // Opcional, puedes dejarlo vacío o con un valor genérico
const ADMIN_AGE = '27';
const ADMIN_ROLE = 'admin';


export class SeedAdmin1763757908792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO users 
        (email, password, name, phone, address, age, role, status)
      SELECT 
        '${ADMIN_EMAIL}', 
        '${ADMIN_HASH}', 
        '${ADMIN_NAME}', 
        '${ADMIN_PHONE}', 
        '${ADMIN_ADDRESS}', 
        '${ADMIN_AGE}', 
        '${ADMIN_ROLE}', 
        true
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = '${ADMIN_EMAIL}');
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DELETE FROM users WHERE email = '${ADMIN_EMAIL}';
    `);
    }

}
