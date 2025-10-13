import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}
  findAll() {
    return this.usersRepo.find();
  }
  async findOne(id: number) {
    const userFind = await this.usersRepo.findOne({ where: { id } });
    if (!userFind) throw new NotFoundException(`User with id ${id} not found`);
    return userFind;
  }

  async findByName(name: string): Promise<User[]> {
    const users = await this.usersRepo.find({
      where: { name: ILike(`%${name}%`)},
    })
    if (users.length === 0) {
    throw new NotFoundException(`No users found with name: ${name}`);
  }

  return users;
  }
  create(newUser: CreateUserDTO) {
    const userCreated = this.usersRepo.create(newUser);
    return this.usersRepo.save(userCreated);
  }
  async update(id: number, updatedUser: UpdateUserDTO) {
    const hashedPassoword = await bcrypt.hash(updatedUser.password, 10)
    await this.usersRepo.update(id, {...updatedUser, password: hashedPassoword});
    return this.usersRepo.findOne({ where: { id } });
  }
  async disable(id: number): Promise<{ message: string }> {
    const userRemoved = await this.usersRepo.findOne({ where: { id } });
    if (!userRemoved)
      throw new NotFoundException(`Product with id ${id} not found`);
    userRemoved.status = false;
    await this.usersRepo.save(userRemoved);
    return { message: `Product with id ${id} disable successfully`}
  }
}
