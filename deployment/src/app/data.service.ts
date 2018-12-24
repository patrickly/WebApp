import { Injectable } from '@angular/core';

import { NavigationStart, Router } from '@angular/router';

import { RestApiService } from './rest-api.service';

import { environment } from "../environments/environment";

const BACKEND_URL = environment.api;

@Injectable()
export class DataService {
  message = '';
  messageType = 'danger';

  user: any;

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
  }

  error(message) {
    this.messageType = 'danger';
    this.message = message;
  }

  success(message) {
    this.messageType = 'success';
    this.message = message;
  }

  warning(message) {
    this.messageType = 'warning';
    this.message = message;
  }


  async getProfile() {
    try {
      if (localStorage.getItem('token')) {
        const data = await this.rest.get(
          BACKEND_URL + '/accounts/profile',
        );
        this.user = data['user'];
      }
    } catch (e) {
      this.error(e);
    }
  }
}