// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { SocketGateway } from './socket/socket.gateway';

@Module({
  imports: [
    // Load environment variables first
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify the .env file path
    }),

    // Configure MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Using MongoDB URI:', uri); // Debug log
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UserModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}