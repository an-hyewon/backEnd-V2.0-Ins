import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DsfSixService } from './dsf-six.service';
import { CreateDsfSixDto } from './dto/create-dsf-six.dto';
import { UpdateDsfSixDto } from './dto/update-dsf-six.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('dsf-six')
@ApiTags('ins/dsf-six')
export class DsfSixController {
  constructor(private readonly dsfSixService: DsfSixService) {}

  // @Post()
  // create(@Body() createDsfSixDto: CreateDsfSixDto) {
  //   return this.dsfSixService.create(createDsfSixDto);
  // }

  // @Get()
  // findAll() {
  //   return this.dsfSixService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dsfSixService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDsfSixDto: UpdateDsfSixDto) {
  //   return this.dsfSixService.update(+id, updateDsfSixDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dsfSixService.remove(+id);
  // }
}
