import {
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HiddenUsersService } from './hidden-users.service';
import { HiddenUserStatusDto } from './dto/hidden-user-status.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Hidden Users')
@Controller({
  path: 'hidden-users',
  version: '1',
})
export class HiddenUsersController {
  constructor(private readonly hiddenUsersService: HiddenUsersService) {}

  @ApiOperation({
    summary: 'Hide current user from All Posts API',
    description: 'Adds the current user to the hidden users list, preventing their posts from appearing in the All Posts API',
  })
  @ApiOkResponse({
    type: HiddenUserStatusDto,
    description: 'User successfully hidden',
  })
  @Post('hide')
  @HttpCode(HttpStatus.OK)
  hideUser(@Request() request): Promise<HiddenUserStatusDto> {
    return this.hiddenUsersService.hideUser(request.user);
  }

  @ApiOperation({
    summary: 'Unhide current user from All Posts API',
    description: 'Removes the current user from the hidden users list, allowing their posts to appear in the All Posts API',
  })
  @ApiOkResponse({
    type: HiddenUserStatusDto,
    description: 'User successfully unhidden',
  })
  @Delete('hide')
  @HttpCode(HttpStatus.OK)
  unhideUser(@Request() request): Promise<HiddenUserStatusDto> {
    return this.hiddenUsersService.unhideUser(request.user);
  }

  @ApiOperation({
    summary: 'Get current user hidden status',
    description: 'Returns whether the current user is hidden from the All Posts API',
  })
  @ApiOkResponse({
    type: HiddenUserStatusDto,
    description: 'Current hidden status',
  })
  @Get('status')
  @HttpCode(HttpStatus.OK)
  getHiddenStatus(@Request() request): Promise<HiddenUserStatusDto> {
    return this.hiddenUsersService.getHiddenStatus(request.user);
  }
}