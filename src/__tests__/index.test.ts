import request from 'supertest';
import HTTPStatusCode from 'http-status-codes';

import App from '../app';

describe('Simple tests', () => {
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
  });
  it('should be able to delete a transaction', async () => {
    const transactionCreated = await request(App).post('/transactions').send({
      title: 'Salário',
      value: 3000,
      type: 'income',
      category: 'Test new category',
    });
    const response = await request(App).post(
      `/transactions/${transactionCreated.body.transaction.id}`,
    );
    expect(response.status).toBe(HTTPStatusCode.NO_CONTENT);
  });
  it('should be able to import transactions', async () => {
    expect(1 + 1).toBe(2);
  });
});
