import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPatientTable1760906404798 implements MigrationInterface {
    name = 'AddPatientTable1760906404798'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`CREATE TABLE \`patient\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`age\` int NULL, \`address\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_2c56e61f9e1afb07f28882fceb\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_2c56e61f9e1afb07f28882fceb\` ON \`patient\``);
        await queryRunner.query(`DROP TABLE \`patient\``);
        
    }

}
