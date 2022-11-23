import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
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
      relations: ['idImages', 'favorites', 'favorites.idImages'],
    })
  }

  findByPhone(phone: string) {
    return this.userRepository.findOne({
      where: { phone },
      relations: ['idImages'],
    })
  }

  async create(userInput: RegisterInputDto) {
    const user = this.userRepository.create(userInput)
    return this.userRepository.save(user)
  }

  async upsertIdImages(user: User, idImageIds: number[]) {
    const images = await this.fileService.findByIds(idImageIds)

    if (images.length === 0) {
      throw new BadRequestException('No image was found')
    }

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

  favorite(user: User, favorite: User) {
    if (user.favorites) {
      user.favorites.push(favorite)
    } else {
      user.favorites = [favorite]
    }
    return this.userRepository.save(user)
  }
}
