import { Controller, Get } from "@nestjs/common";
import { DataSource } from "typeorm";

@Controller('/api/migrate')
export class MigrationController {
    constructor(
        private readonly dataSource: DataSource
    ){}

    @Get()
    async runMigrations() {
        const result = await this.dataSource.runMigrations()
        return { message: 'Migraciones ejecutadas correctamente', result }
    }
}