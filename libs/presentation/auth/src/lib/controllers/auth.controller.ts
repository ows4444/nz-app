import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, RegisterUserDto } from '@nz/application-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDto) {
    return this.authService.register(payload);
  }

  // @Post('login')
  // async login() {
  //   return this.authService.login();
  // }

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
