import { PartialType } from '@nestjs/swagger';
import { CreateDsfSixDto } from './create-dsf-six.dto';

export class UpdateDsfSixDto extends PartialType(CreateDsfSixDto) {}
