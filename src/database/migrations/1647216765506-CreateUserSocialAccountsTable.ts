import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateUserSocialAccountsTable1647216765506
  implements MigrationInterface
{
  private tableName = 'user_social_accounts';
  private userTableName = 'users';

  private userSocialAccountUniqueConstraint = new TableUnique({
    columnNames: ['provider_identifier', 'provider_name'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'provider_identifier',
            type: 'varchar',
            length: '192',
            isNullable: false,
          },
          {
            name: 'provider_name',
            type: 'varchar',
            length: '192',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      this.tableName,
      this.userSocialAccountUniqueConstraint,
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.userTableName,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const thisTable = await queryRunner.getTable(this.tableName);

    const userIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );

    await queryRunner.dropForeignKey(this.tableName, userIdForeignKey);
    await queryRunner.query(`DROP TABLE ${this.tableName}`);
  }
}
