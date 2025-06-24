import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { esm } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('esm')
@esm.ESMServiceControllerMethods()
export class ESMController implements esm.ESMServiceController {
  getEsmInfo(request: esm.ESMRequest, metadata?: Metadata): Promise<esm.ESMResponse> | Observable<esm.ESMResponse> | esm.ESMResponse {
    throw new Error('Method not implemented.');
  }
}
