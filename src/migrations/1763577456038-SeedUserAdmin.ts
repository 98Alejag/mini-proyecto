import { RolesEnum } from "src/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserAdmin1763577456038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" (
                name, email, phone, password, address, age, status, role
            ) VALUES (
                'Administrador',
                'admin@tuapp.com',
                '3001234567',
                '$2b$10$dPmf3kmr8.zOzTIObeA1keFVY91pGQFl8pT6dIgonHmTmcnUm8Shq', -- hashed password bcrypt: admin123
                'Calle Falsa 123',
                35,
                true,
                '${RolesEnum.ADMIN}'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE email = 'admin@tuapp.com'
        `);
    }

}
