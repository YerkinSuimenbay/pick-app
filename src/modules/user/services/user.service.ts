import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RegisterInputDto } from '../../auth/dto/register-input.dto'
import { AuthService } from '../../auth/services'
import { User } from '../entities'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  create(input: RegisterInputDto) {
    const user = this.userRepository.create(input)
    return this.userRepository.save(user)
  }
  me() {
    // const user = this.userRepository.create({
    //   name: 'test',
    //   phone: '87779091213',
    //   email: 'test@gmail.com',
    //   idType: '25.09.1999',
    //   idNumber: '9548312',
    // })

    return 'me'
  }
}
