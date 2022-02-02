import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  constructor() { }

  public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  public toggle() {
    return this.sideNavToggleSubject.next(null);
  }
}
