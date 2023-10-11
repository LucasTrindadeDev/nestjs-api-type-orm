import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: `j461+ff}.5Jr9O}9Ha2?72efJ%C"n4Cg`,
    }),
  ],
})
export class AuthModule {}
