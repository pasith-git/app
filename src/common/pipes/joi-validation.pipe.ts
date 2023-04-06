import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CustomException } from 'common/exceptions/custom.exception';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: any) { }

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new CustomException({ message: "Data validation", error: error.details });
        }
        return value;
    }
}