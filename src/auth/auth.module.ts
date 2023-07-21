import { AuthDto } from './dto/auth.dto';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { AuthSchema } from './schemas/auth.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES },
      }),
    }),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
  ],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}