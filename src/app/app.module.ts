import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ServiceWorkerModule, SwPush, SwUpdate} from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBar, MatSnackBarModule} from '@angular/material';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PushNotificationService} from './services/push-notification.service';
import {delay, retryWhen, tap} from 'rxjs/operators';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(update: SwUpdate, push: SwPush, snackbar: MatSnackBar, pushService: PushNotificationService) {
    update.available.subscribe((val) => {
      console.log('update available');
      const snack = snackbar.open('Update Available', 'Reload');

      snack.onAction().subscribe(() => {
        window.location.reload();
      });
    });

    push.messages.subscribe(msg => {
      console.log(msg);
      snackbar.open(JSON.stringify(msg));
    });

    const key = 'BO2o-qUJJEbSYGL7BcPlHAtEU0cPdW5OGrAJcm-swR4GYZl6_OK7lFGrQaHXtQtlHMG6V5f72hU_ug6kg4A_voo';
    push.requestSubscription({serverPublicKey: key})
      .then(pushSubscription => {
        console.log(pushSubscription.toJSON());
        pushService.sendSubscriptionToTheServer(pushSubscription).pipe(
          retryWhen(errors =>
            errors.pipe(
              tap(err => {
                console.error('Got error', err);
              }),
              delay(1000)
            )
          )
        ).subscribe();
      });
  }
}
