import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {
  types: any;

  newType = '';
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        BACKEND_URL + '/types'
      );
      data['success']
        ? (this.types = data['types'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async addType() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(
        BACKEND_URL + '/types',
        { type: this.newType }
      );
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

  goBack() {
    window.history.back();
  }
}