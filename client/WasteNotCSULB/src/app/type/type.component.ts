import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit {
  typeId: any;
  type: any;
  page = 1;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.typeId = res['id'];
      this.getItems();
    });
  }

  get lower() {
    return 10 * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min(10 * this.page, this.type.totalItems);
  }

  async getItems(event?: any) {
    if (event) {
      this.type = null;
    }
    try {
      const data = await this.rest.get(
        BACKEND_URL + `/types/${this.typeId}?page=${this
          .page - 1}`,
      );
      data['success']
        ? (this.type = data)
        : this.data.error(data['message']);
        console.log(this.type);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}