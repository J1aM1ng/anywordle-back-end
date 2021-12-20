// src/controllers/auth.ts
import { Context } from "koa";
import * as argon2 from "argon2";
import { getManager } from "typeorm";
import jwt from "jsonwebtoken";

import { User } from "../entity/user";
import { JWT_SECRET } from "../constants";

export default class AuthController {
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const user = await userRepository
      .createQueryBuilder()
      .where({ email: ctx.request.body.email })
      .addSelect("User.password")
      .getOne();

    if (!user) {
      ctx.status = 401;
      ctx.body = { message: "用户不存在" };
    } else if (await argon2.verify(user.password, ctx.request.body.password)) {
      ctx.status = 200;
      ctx.body = { token: jwt.sign({ id: user.id }, JWT_SECRET) };
    } else {
      ctx.status = 401;
      ctx.body = { message: "密码错误" };
    }
  }

  public static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const newUser = new User();
    newUser.email = ctx.request.body.email;
    newUser.password = await argon2.hash(ctx.request.body.password);

    // 保存到数据库
    const user = await userRepository.save(newUser);

    ctx.status = 201;
    ctx.body = user;
  }

  public static async sendEmail(ctx: Context) {
    const nodemailer = require("nodemailer");
    const smtpTransport = require("nodemailer-smtp-transport");

    const transport = nodemailer.createTransport(
      smtpTransport({
        host: "smtp.qq.com", // 服务 qq邮箱
        port: 465, // smtp端口 默认无需改动
        secure: true, // 使用TLS
        auth: {
          user: "3263415875@qq.com", // 用户名
          pass: "ynjvehszrbnsdbig", // SMTP授权码
        },
      })
    );
    const randomFns = () => {
      // 生成6位随机数
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      }
      return code;
    };
    const regEmail =
      /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //验证邮箱正则

    ctx.status = 200;
  }
}
