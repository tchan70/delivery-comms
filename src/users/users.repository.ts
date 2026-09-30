import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseUsers } from './parse-users';
import { User } from './user.types';

// Resolves to the repo root from both src/users (ts-jest) and dist/users (build).
const DATA_FILE_PATH = join(__dirname, '..', '..', 'data.json');

/** Stands in for a database: loads and validates data.json once at startup. */
@Injectable()
export class UsersRepository {
  private readonly usersById: Map<string, User>;

  constructor() {
    const data: unknown = JSON.parse(readFileSync(DATA_FILE_PATH, 'utf8'));
    const users = parseUsers(data);
    this.usersById = new Map(users.map((user) => [user.id, user]));
  }

  findById(id: string): User | undefined {
    return this.usersById.get(id);
  }
}
