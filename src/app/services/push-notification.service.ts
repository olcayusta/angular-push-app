import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient) {
  }

  public sendSubscriptionToTheServer(subscription: PushSubscription) {
    return this.http.post('//localhost:5000/subscribe', subscription);
  }
}
