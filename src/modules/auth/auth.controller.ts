import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'modules/auth/auth.service';
import { MODULE_NAMES } from 'common/constants';

@ApiTags(MODULE_NAMES.AUTH.toUpperCase())
@Controller(MODULE_NAMES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
