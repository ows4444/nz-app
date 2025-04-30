import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@nz/application-auth';
import { LoginUserDto, RegisterUserDto } from '../dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginUserDto) {
    return this.authService.login(payload);
  }

  // @Post('logout')
  // async logout() {
  //   return this.authService.logout();
  // }

  // @Post('refresh')
  // async refresh() {
  //   return this.authService.refresh();
  // }

  // @Get('me')
  // async me() {
  //   return this.authService.getUser();
  // }
}
