import { Injectable } from '@nestjs/common';
import { CreateDsfSixDto } from './dto/create-dsf-six.dto';
import { UpdateDsfSixDto } from './dto/update-dsf-six.dto';

@Injectable()
export class DsfSixService {
  create(createDsfSixDto: CreateDsfSixDto) {
    return 'This action adds a new dsfSix';
  }

  findAll() {
    return `This action returns all dsfSix`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dsfSix`;
  }

  update(id: number, updateDsfSixDto: UpdateDsfSixDto) {
    return `This action updates a #${id} dsfSix`;
  }

  remove(id: number) {
    return `This action removes a #${id} dsfSix`;
  }
}
