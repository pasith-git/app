import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CustomException } from 'common/exceptions/custom.exception';
import { ObjectSchema, ValidationError } from 'joi';

@Injectable()
export class FormDataValidationPipe implements PipeTransform {
    constructor(private schema: any) { }
    async transform(value: {body: string}, metadata: ArgumentMetadata) {
        try{
            const jsonBoby = JSON.parse(value.body);
            const { error } = await this.schema.validateAsync(jsonBoby);
            return jsonBoby;
        }catch(e){
            if(e instanceof ValidationError){
                throw new CustomException({ message: "data validation", error: e.details });
            }
            throw new CustomException({ message: "data validation", error: e.message });
        }
        
    }
}
