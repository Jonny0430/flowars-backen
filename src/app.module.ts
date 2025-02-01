import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoDBConfig } from './config/mongo.config';
import { MailModule } from './mail/mail.module';
import { AgentModule } from './agent/agent.module';
import { ProductModule } from './product/product.module';
import { FileModule } from './file/file.module';
import { AdminModule } from './admin/admin.module';
import { BooksModule } from './books/books.module';
import { PaymentModule } from './payment/payment.module';
import { CustomerModule } from './customer/customer.module';
import { ReviewModule } from './review/review.module';
import { ArticleModule } from './article/article.module';
import { AppGateway } from './gateways/app.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDBConfig,
    }),
    AuthModule,
    UserModule,
    MailModule,
    AgentModule,
    ProductModule,
    FileModule,
    AdminModule,
    BooksModule,
    PaymentModule,
    CustomerModule,
    ReviewModule,
    ArticleModule,
    ChatModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
