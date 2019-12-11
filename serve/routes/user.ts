import * as Koa from 'koa';
import { get, post, queryValidate, bodyValidate } from '../utils/decors';

export default class User {
  @post('/list')
  @bodyValidate({
    name: {
      type: 'string',
      required: true
    },
    age: {
      type: 'number'
    }
  })
  public async list(ctx: Koa.Context) {
    ctx.body = { code: 10000, msg: 'hello world' }
  }
  @get('/add')
  @queryValidate({
    name: {
      type: 'string',
      required: true
    }
  })
  public async add(ctx: Koa.Context) {
    ctx.body = { code: 10000, msg: 'add success' }
  }
}

// {
//   middlewares: [async (ctx: Koa.Context, next) => {
//     const name = ctx.request.body.name;
//     if (!name) {
//       ctx.body = {
//         code: 10001,
//         msg: '没有name'
//       }
//     } else {
//       await next();
//     }
//   }]
// }