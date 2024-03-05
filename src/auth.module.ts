import { CommonModule } from "@app/common"
import { RmqModule } from "@app/common/rmq/rmq.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import * as joi from "joi"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        RABBIT_MQ_URL: joi.string().required(),
      }),
      envFilePath: "./apps/auth/.env",
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    RmqModule.register({ name: "USER" }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
