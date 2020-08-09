# store-transactions-with-typeorm  
This is a back-end application with as functionalities register new tranasactions, import transactions from a .csv file, list all transactions and balance.
  
**This application is only a practice application of TypeScript and Node.js, is not recommended to use this application in production.**
  
## Required  
#### Fill the file `.env.[stage]`
Should be to create and to fill the environment file with name `.env.[stage]`, has a file named as `.env.stage.example` with the current constants requires.  
```
TEST_DB_NAME=[DATABASE_NAME_TEST]
```  
  
**`[stage]` should be replaced by a environment name `test`, `dev` or `prod`.**  
  
#### Fill the file `.ormconfig.json`
Should be to create and to fill database settings file with name `ormconfig.json`,  has a file named as `.ormconfig.example.json` as an example to settings required.  
```
{
  "type": "postgres",
  "host": "HOST",
  "port": "POST",
  "username": "USERNAME_DATABASE",
  "password": "PASSWORD_DATABASE",
  "database": "NAME_DATABASE",
  "entities": [
    "./src/models/*.ts"
  ],
  "migrations": [
    "./src/database/migrations/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/database/migrations"
  }
}
```
    
## Available scripts  
#### `yarn build`  
Use this command script to transpile all files `.ts` to `.js` to path `./dist`.  
  
#### `yarn dev:server`  
Use this command script to run a dev server on port `3333`.
  
#### `yarn test`  
Use this command script to run application tests.  
**stage: dev**  
  
#### `yarn typeorm`  
Use this command script to run commands of the `typeorm`.  
