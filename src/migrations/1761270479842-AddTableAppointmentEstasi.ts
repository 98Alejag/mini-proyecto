import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableAppointmentEstasi1761270479842 implements MigrationInterface {
    name = 'AddTableAppointmentEstasi1761270479842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`age\` int NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`role\` varchar(255) NOT NULL DEFAULT 'doctor', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`treatment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`price\` decimal(10,2) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`patient\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`age\` int NULL, \`address\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`role\` varchar(255) NOT NULL DEFAULT 'Patient', UNIQUE INDEX \`IDX_2c56e61f9e1afb07f28882fceb\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`datehour\` timestamp NOT NULL, \`durationMinutes\` int NOT NULL DEFAULT '30', \`status\` varchar(255) NOT NULL DEFAULT 'pendiente', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`doctorId\` int NULL, \`patientId\` int NULL, \`treatmentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_514bcc3fb1b8140f85bf1cde6e2\` FOREIGN KEY (\`doctorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_5ce4c3130796367c93cd817948e\` FOREIGN KEY (\`patientId\`) REFERENCES \`patient\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_91bba5a127e0958278e7e0cb577\` FOREIGN KEY (\`treatmentId\`) REFERENCES \`treatment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_91bba5a127e0958278e7e0cb577\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_5ce4c3130796367c93cd817948e\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_514bcc3fb1b8140f85bf1cde6e2\``);
        await queryRunner.query(`DROP TABLE \`appointment\``);
        await queryRunner.query(`DROP INDEX \`IDX_2c56e61f9e1afb07f28882fceb\` ON \`patient\``);
        await queryRunner.query(`DROP TABLE \`patient\``);
        await queryRunner.query(`DROP TABLE \`treatment\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
