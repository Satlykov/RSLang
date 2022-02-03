import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  public sideNavToggleSubject: BehaviorSubject<null> = new BehaviorSubject(null);

  public toggle() {
    return this.sideNavToggleSubject.next(null);
  }
}
