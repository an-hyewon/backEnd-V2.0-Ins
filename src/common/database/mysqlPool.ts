import { createConnection, Connection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { createMapper, getStatement } from 'mybatis-mapper';

export class mysqlPool {
  constructor(private configService: ConfigService) {}

  getConnection() {
    return createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  closeConnection(connection: Connection): void {
    connection.end();
  }

  async excuteQuery(
    mappingXmlPath: string,
    mappingXmlId: string,
    mappingXmlMatchId: string,
    parameter: any,
  ) {
    const connection = this.getConnection();

    createMapper([mappingXmlPath]);

    let query = getStatement(mappingXmlId, mappingXmlMatchId, parameter, {
      language: 'sql',
      indent: '  ',
    });

    console.log(
      `Get Mapping ID : '${mappingXmlMatchId}' Query :::::::::::::::::\n`,
      query,
    );

    let data = (await connection).query(query); // 데이터 반환

    this.closeConnection(await connection);

    return data;
  }
}
