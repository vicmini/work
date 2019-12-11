import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';
import * as glob from 'glob';
import * as path from 'path';
import schema from 'async-validator';
import * as  Parameter from 'parameter'
const router = new KoaRouter();

type LoadOptions = {
  extname?: string
}
type RouteOptions = {
  prefix?: string;
  middlewares?: Koa.Middleware[];
}
type HTTPMethod = 'get' | 'post' | 'put' | 'del' | 'patch' | 'all'

const routerDecorate = (url: string, method: HTTPMethod, router: KoaRouter, routeOpts: RouteOptions = {}) => {
  return (target, property: string) => {
    process.nextTick(() => {
      const routePath = routeOpts.prefix ? path.join(routeOpts.prefix, url) : url;
      const middlewares = [];
      if (routeOpts.middlewares) {
        middlewares.push(...routeOpts.middlewares);
      }
      middlewares.push(target[property]);
      router[method](routePath, ...middlewares);
    })
  }
};

const method = (method: HTTPMethod) =>
  (url: string, opts?: RouteOptions) =>
    routerDecorate(url, method, router, opts);


export const get = method('get');
export const post = method('post');

export const load = (dir: string, options: LoadOptions = {}): KoaRouter => {
  const extname = options.extname || `.{ts,js}`;
  glob.sync(path.join(dir, `./**/*${extname}`)).forEach(item => {
    require(item)
  });
  return router;
}

export const validate = (param) => (rule) => {
  return function (target, proprety, descriptor) {
    return {
      ...descriptor,
      async value(...args) {
        const ctx = args[0] as Koa.Context;
        const data = ctx.request[param];
        const parameter = new Parameter()
        const errors = parameter.validate(rule, data)
        if (errors) {
          throw new Error(JSON.stringify(errors));
        }
        descriptor.value.apply(this, args);
      }
    }
  }
}
export const queryValidate = validate('query');
export const bodyValidate = validate('body'); 
