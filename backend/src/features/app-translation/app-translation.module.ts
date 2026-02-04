import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppTranslation } from "@domain/entities";
import { AppTranslationService } from "./app-translation.service";

@Module({
  imports: [TypeOrmModule.forFeature([AppTranslation])],
  providers: [AppTranslationService],
  exports: [AppTranslationService],
})
export class AppTranslationModule {}