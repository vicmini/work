import * as Koa from 'koa';
// import * as KoaRouter from 'koa-router';
import * as BodyParser from 'koa-bodyparser';
import * as path from 'path';
import {load} from './utils/decors';
const app = new Koa();
app.use(BodyParser());
// const router = new KoaRouter();
// router.get('/get', (ctx: Koa.Context, next) => {
//   ctx.body = {
//     msg: ctx.query
//   };
// });
// router.post('/post', (ctx, next) => {
//   ctx.body = ctx.request.body;
// })
const router = load(path.join(__dirname,`./routes`))
app.use(router.routes()).use(router.allowedMethods());
app.listen(3001, () => {
  console.log(`serve is running on 3000`)
})
