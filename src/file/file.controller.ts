import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileService } from './file.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  
  @Post('save')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async saveFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return this.fileService.saveFile(file, folder);
  }
}
