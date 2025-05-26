import { Observable, of, combineLatest, ReplaySubject } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';

import { AppShellConfig } from './config/app-shell.config';

export class ShellModel {
  isShell = false;
}

export class DataStore<T> {
  // We wait on purpose 2 secs on local environment when fetching from json to simulate the backend roundtrip.
  // However, in production you should set this delay to 0 in the assets/config/app-shell.config.prod.json file.
  // tslint:disable-next-line:max-line-length
  private networkDelay = (AppShellConfig.settings && AppShellConfig.settings.networkDelay) ? AppShellConfig.settings.networkDelay : 0;

  private timeline: ReplaySubject<T & ShellModel> = new ReplaySubject(1);

  constructor(private shellModel: T) { }

  // Static function with generics
  // (ref: https://stackoverflow.com/a/24293088/1116959)
  // Append a shell (T & ShellModel) to every value (T) emmited to the timeline
  public static AppendShell<T>(dataObservable: Observable<T>, shellModel: T, networkDelay = 400): Observable<T & ShellModel> {
    const delayObservable = of(true).pipe(
      delay(networkDelay)
    );

    // Assign shell flag accordingly
    // (ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    return combineLatest([
      delayObservable,
      dataObservable
    ]).pipe(
      // Dismiss unnecessary delayValue
      map(([delayValue, dataValue]: [boolean, T]): (T & ShellModel) => Object.assign(dataValue, {isShell: false})),
      // Set the shell model as the initial value
      startWith(Object.assign(shellModel, {isShell: true}))
    );
  }

  load(dataSourceObservable: Observable<T>): void {
    const dataSourceWithShellObservable = DataStore.AppendShell(dataSourceObservable, this.shellModel, this.networkDelay);

    dataSourceWithShellObservable
    .subscribe((dataValue: T & ShellModel) => {
      this.timeline.next(dataValue);
    });
  }

  public get state(): Observable<T & ShellModel> {
    return this.timeline.asObservable();
  }
}
