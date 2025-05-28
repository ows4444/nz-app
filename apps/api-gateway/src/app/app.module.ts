import { Module } from '@nestjs/common';
import { SharedConfigModule } from '@nz/config';
import { join } from 'path';

const protoPath = (name: string) => {
  console.log(`Loading proto file for ${name}`);

  return join(__dirname, 'assets', `${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.proto`);
};
@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: authSession.protobufPackage,
    //     transport: Transport.GRPC,
    //     options: {
    //       package: [authSession.AUTH_SESSION_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
    //       protoPath: [protoPath(authSession.protobufPackage), protoPath(health.protobufPackage)],
    //       url: 'localhost:4040',
    //     },
    //   },
    //   {
    //     name: identityDevice.protobufPackage,
    //     transport: Transport.GRPC,
    //     options: {
    //       package: [identityDevice.IDENTITY_DEVICE_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
    //       protoPath: [protoPath(identityDevice.protobufPackage), protoPath(health.protobufPackage)],
    //       url: 'localhost:6666',
    //     },
    //   },
    // ]),
    // CacheModule.registerAsync({
    //   useFactory: async () => ({
    //     stores: [new Keyv({ store: new KeyvRedis('redis://localhost:6379') })],
    //     isGlobal: true,
    //   }),
    // }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  //controllers: [HealthController, AuthController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: RateLimitInterceptor,
    // },
  ],
})
export class AppModule {}
