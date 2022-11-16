import { QueryRunner } from 'typeorm'

export type IQueryRunnerProps<T extends Record<string, unknown>> = T & {
  queryRunner: QueryRunner
}
