import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClinicalHistory1761614144003 implements MigrationInterface {
    name = 'AddClinicalHistory1761614144003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`clinical_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` varchar(255) NOT NULL, \`reasonForVisit\` varchar(255) NOT NULL, \`diagnosis\` varchar(255) NOT NULL, \`proposedTreatment\` varchar(255) NULL, \`patientId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clinical_history\` DROP FOREIGN KEY \`FK_6146817e142e2317a2a123ce71b\``);
        await queryRunner.query(`DROP TABLE \`clinical_history\``);
    }

}
