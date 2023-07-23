export interface Db {
  schema: {
    hasTable: (arg0: string) => Promise<any>;
    createTable: (
      arg0: string,
      arg1: { (table: any): void; (table: any): void }
    ) => Promise<any>;
  };
}
