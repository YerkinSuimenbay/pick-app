import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import * as uuid from 'uuid'

import { SessionEntity } from '../entities/session.entity'
import { User } from '../../user/entities'

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private readonly dataSource: DataSource,
  ) {}

  findByUser({ id }: User) {
    return this.dataSource
      .getRepository(SessionEntity)
      .createQueryBuilder('session')
      .innerJoin('session.user', 'user')
      .where('user.id = :id', { id })
      .getOne()
  }

  async upsert(user: User) {
    let session = await this.findByUser(user)

    if (!session) {
      session = this.sessionRepository.create({ user })
    }

    session.isActive = true
    session.sessionToken = this.generateToken()
    session.lastLoginAt = new Date()

    return this.sessionRepository.save(session)
  }

  generateToken() {
    return uuid.v4()
  }

  async hasSession(user: User, sessionToken: string) {
    try {
      const session = this.dataSource
        .getRepository(SessionEntity)
        .createQueryBuilder('session')
        .innerJoin('session.user', 'user')
        .where('user.id = :id', { id: user.id })
        .andWhere('session.sessionToken = :sessionToken', { sessionToken })
        .getOne()

      return !!session
    } catch (error) {
      return false
    }
  }
}
