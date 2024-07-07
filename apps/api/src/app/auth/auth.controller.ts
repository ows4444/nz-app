import { Body, Controller, Get, Post, Res, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginUserUseCase } from '@apps/api/src/use-cases/user';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Session as ExpressSession } from 'express-session';
import { AuthGuard } from '@core/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  @Post('login')
  async login(@Body() payload: LoginDto, @Session() session: ExpressSession, @Res() res: Response): Promise<any> {
    const user = await this.loginUserUseCase.execute(payload.email, payload.password);

    if (user) {
      delete user.password;
      session['user'] = user;
      return res.status(200).send({ ok: true, message: 'Login success ' });
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Session() session: ExpressSession): Promise<any> {
    if (session['user']) {
      session.touch();
      session.save();
      return { id: session['user'] };
    }
    throw new UnauthorizedException('Unauthorized');
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Session() session: ExpressSession, @Res() res: Response): Promise<any> {
    session.destroy((err) => {
      if (err) {
        return res.status(500).send({ ok: false, message: 'Logout failed' });
      }
      return res.status(200).send({ ok: true, message: 'Logout success' });
    });
  }
}
