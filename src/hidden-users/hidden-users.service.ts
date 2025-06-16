import { Injectable } from '@nestjs/common';
import { HiddenUserRepository } from './infrastructure/persistence/hidden-user.repository';
import { User } from '../users/domain/user';
import { HiddenUserStatusDto } from './dto/hidden-user-status.dto';

@Injectable()
export class HiddenUsersService {
  constructor(
    private readonly hiddenUserRepository: HiddenUserRepository,
  ) {}

  async hideUser(user: User): Promise<HiddenUserStatusDto> {
    // Check if user is already hidden
    const existingHiddenUser = await this.hiddenUserRepository.findByUserId(user.id);
    
    if (existingHiddenUser) {
      return { isHidden: true };
    }

    // Add user to hidden list
    await this.hiddenUserRepository.create({ user });
    return { isHidden: true };
  }

  async unhideUser(user: User): Promise<HiddenUserStatusDto> {
    await this.hiddenUserRepository.remove(user.id);
    return { isHidden: false };
  }

  async getHiddenStatus(user: User): Promise<HiddenUserStatusDto> {
    const hiddenUser = await this.hiddenUserRepository.findByUserId(user.id);
    return { isHidden: !!hiddenUser };
  }

  async getAllHiddenUserIds(): Promise<string[]> {
    return this.hiddenUserRepository.getAllHiddenUserIds();
  }
}