import { CanActivateFn } from '@angular/router';
import { GuardService } from './guard.service';
import { inject } from '@angular/core';
import { DataService } from './data.service';


export const authGuard: CanActivateFn = (route, state) => {
  //const guardSrv: GuardService = inject(GuardService);
  const dataSrv: DataService = inject(DataService);
  return dataSrv.isUserLoggedIn();
};
