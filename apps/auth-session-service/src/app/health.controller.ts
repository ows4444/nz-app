import { Controller } from '@nestjs/common';
import { health } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('health')
@health.HealthServiceControllerMethods()
export class HealthController implements health.HealthServiceController {
  check(request: health.HealthCheckRequest): Promise<health.HealthCheckResponse> | Observable<health.HealthCheckResponse> | health.HealthCheckResponse {
    return {
      healthy: true,
      details: 'OK',
    };
  }
}
