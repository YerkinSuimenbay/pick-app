import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UpdateAccountInputDto } from './../dto/update-account-input.dto'

import { RegisterInputDto } from '../../auth/dto/register-input.dto'
import { AuthService } from '../../auth/services'
import { User } from '../entities'
import { FileService } from '../../file/file.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['idImages'],
    })
  }

  async create(input: RegisterInputDto) {
    const { idImageIds, ...userInput } = input
    const user = this.userRepository.create(userInput)

    const images = await this.fileService.findByIds(idImageIds)
    user.idImages = images

    return this.userRepository.save(user)
  }

  changePassword(user: User, newPassword: string) {
    user.password = newPassword
    return this.userRepository.save(user)
  }

  updateAccount(user: User, input: UpdateAccountInputDto) {
    user.name = input.name
    user.phone = input.phone
    user.email = input.email
    user.description = input.description

    return this.userRepository.save(user)
  }
}
