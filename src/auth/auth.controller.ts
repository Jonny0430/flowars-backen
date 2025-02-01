import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { TokenDto } from './dto/token.dto'
import { Auth } from './decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	public async register(@Body() dto: LoginAuthDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	public async login(@Body() dto: LoginAuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('access')
	public async getNewTokens(@Body() dto: TokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@HttpCode(200)
	@Post('check-user')
	public async checkUser(@Body() dto: { email: string }) {
		return this.authService.checkUser(dto.email)
	}

	@HttpCode(200)
	@Get('check-agent')
	@Auth('AGENT')
	public async checkAgent(@User('_id') _id: string) {
		return _id ? true : false
	}

	@HttpCode(200)
	@Get('check-admin')
	@Auth('ADMIN')
	public async checkAdmin(@User('_id') _id: string) {
		return _id ? true : false
	}

	@HttpCode(200)
	@Get('checkAllUser')
	@Auth()
	public async checkAllUser(@User('_id') _id: string) {
		return _id ? true : false
	}
}
