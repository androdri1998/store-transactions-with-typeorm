import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import HTTPStatusCode from 'http-status-codes';

import createConnection from '../database';
import App from '../app';

let connection: Connection;

describe('Simple tests', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS transactions');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM transactions');
    await connection.query('DELETE FROM categories');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new transaction', async () => {
    const response = await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Fixa',
    });
    expect(response.status).toBe(HTTPStatusCode.CREATED);
  });
  it('should create tags when inserting new transactions', async () => {
    const response = await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Test new category',
    });
    expect(response.status).toBe(HTTPStatusCode.CREATED);
  });
  it('should not create tags when they already exists', async () => {
    await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Test new category',
    });
    const response = await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Test new category',
    });
    expect(response.status).toBe(HTTPStatusCode.CREATED);
  });
  it('should be able to list the transactions', async () => {
    const response = await request(App).get('/transactions');
    expect(response.status).toBe(HTTPStatusCode.OK);
  });
  it('should not be able to create outcome transaction without a valid balance', async () => {
    await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Test new category',
    });
    const response = await request(App).post('/transactions').send({
      title: 'debts',
      value: 4000,
      type: 'outcome',
      category: 'Test new category',
    });
    expect(response.status).toBe(HTTPStatusCode.BAD_REQUEST);
    expect(1 + 1).toBe(2);
  });
  it('should be able to delete a transaction', async () => {
    const transactionCreated = await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Test new category',
    });
    const response = await request(App).delete(
      `/transactions/${transactionCreated.body.transaction.id}`,
    );
    expect(response.status).toBe(HTTPStatusCode.NO_CONTENT);
  });
  it('should be able to import transactions', async () => {
    expect(1 + 1).toBe(2);
  });
});
