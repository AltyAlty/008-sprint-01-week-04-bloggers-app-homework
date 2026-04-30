import { DriverOutputDTO } from './driver.output-dto';

/*DTO для данных по водителю для отправки клиенту.*/
export type WrappedDriverOutputDTO = {
  data: DriverOutputDTO;
};
