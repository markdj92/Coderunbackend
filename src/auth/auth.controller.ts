
import { Body, Controller, Post, HttpCode, HttpStatus, Request , UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    // login 할 때, email, password를 전달함
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: AuthDto) {
    return this.authService.signUp(signUpDto);
  }
}