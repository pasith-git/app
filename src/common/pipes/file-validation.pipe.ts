import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus } from '@nestjs/common';
import { CustomException } from 'common/exceptions/custom.exception';

const FILE_MAXSIZE = 1000 * 1000 * 4;

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  transform(files: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    if (files?.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > FILE_MAXSIZE) {
          throw new CustomException({ error: `Validation failed (expected size is less than ${FILE_MAXSIZE})`, message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (!/(jpe?g|png)$/i.test(files[0].mimetype)) {
          throw new CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return files;
      }
    }
  }
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    if (file) {
      if (file.size > FILE_MAXSIZE) {
        throw new CustomException({ error: `Validation failed (expected size is less than ${FILE_MAXSIZE})`, message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      if (!/(jpe?g|png)$/i.test(file.mimetype)) {
        throw new CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return file;
    }

  }
}

@Injectable()
export class FileRequiredValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    if (file) {
      if (file.size > FILE_MAXSIZE) {
        throw new CustomException({ error: `Validation failed (expected size is less than ${FILE_MAXSIZE})`, message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      if (!/(jpe?g|png)$/i.test(file.mimetype)) {
        throw new CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return file;
    } else {
      throw new CustomException({ error: "File is required", message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

  }
}

@Injectable()
export class FileFieldValidationPipe implements PipeTransform {
  transform(file: { logo_image_file?: Express.Multer.File[], profile_image_file?: Express.Multer.File[] }, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    if (file?.logo_image_file?.[0]) {
      if (file.logo_image_file[0].size > FILE_MAXSIZE) {
        throw new CustomException({ error: `Validation failed (expected size is less than ${FILE_MAXSIZE})`, message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      if (!/(jpe?g|png)$/i.test(file.logo_image_file[0].mimetype)) {
        throw new CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    if (file?.profile_image_file?.[0]) {
      if (file.profile_image_file[0].size > FILE_MAXSIZE) {
        throw new CustomException({ error: `Validation failed (expected size is less than ${FILE_MAXSIZE})`, message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      if (!/(jpe?g|png)$/i.test(file.profile_image_file[0].mimetype)) {
        throw new CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    return file;
  }
}