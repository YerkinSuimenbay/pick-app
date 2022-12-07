import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SocialProvider } from './../../auth/socials/enums/social-provider.enum'
import { UpdateAccountInputDto } from './../dto/update-account-input.dto'

import { RegisterInputDto } from '../../auth/dto/register-input.dto'
import { AuthService } from '../../auth/services'
import { User } from '../entities'
import { FileService } from '../../file/file.service'
import { StorageService } from '../../storage/storage.service'
import { SocialInterface } from '../../auth/socials/interfaces'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly fileService: FileService,
    private readonly storageService: StorageService,
  ) {}

  findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: [
        'idImages',
        'favorites',
        'favorites.idImages',
        'profileImage',
      ],
    })
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: [
        'idImages',
        'favorites',
        'favorites.idImages',
        'profileImage',
      ],
    })
  }

  findByPhone(phone: string) {
    return this.userRepository.findOne({
      where: { phone },
      relations: ['idImages'],
    })
  }

  findBySocialIdAndProvider(socialId: string, socialProvider: SocialProvider) {
    return this.userRepository.findOne({
      where: { socialId, socialProvider },
    })
  }

  async create(userInput: RegisterInputDto) {
    const user = this.userRepository.create(userInput)
    return this.userRepository.save(user)
  }

  async createSocial(
    socialProvider: SocialProvider,
    socialData: SocialInterface,
  ) {
    let name = socialData.firstName
    if (socialData.lastName) name += ` ${socialData.lastName}`

    const user = this.userRepository.create({
      socialId: socialData.id,
      socialProvider,
      email: socialData.email,
      name,
    })

    return this.userRepository.save(user)
  }

  async upsertIdImages(user: User, idImageIds: number[]) {
    let images = await this.fileService.findByIds(idImageIds)
    images = images.filter((image) => {
      return !(image.userIdImageId || image.packageImageId)
    })

    if (images.length === 0) {
      throw new BadRequestException('No image was found')
    }

    user.idImages = images
    return this.userRepository.save(user)
  }

  async upsertProfileImage(user: User, imageId: number) {
    const image = await this.fileService.findByIdOrFail(imageId)
    if (image.userIdImageId || image.packageImageId) {
      throw new BadRequestException('Image not available')
    }

    if (user.profileImage) {
      if (user.profileImage.id === imageId) {
        return user
      }

      // DELETE THE ACTUAL IMAGE
      this.storageService.deleteFile(
        `${user.profileImage.path}.${user.profileImage.extension}`,
      )

      await this.fileService.delete(user.profileImage.id)
    }

    user.profileImage = image
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

  unfavorite(user: User, favoriteToRemove: User) {
    if (user.favorites == null) user

    user.favorites = user.favorites.filter(
      (favorite) => favorite.id !== favoriteToRemove.id,
    )

    return this.userRepository.save(user)
  }
}
