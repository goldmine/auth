import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ToolModule } from 'src/tool/tool.module';

@Module({
  imports: [PrismaModule, ToolModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class UserModule {}
