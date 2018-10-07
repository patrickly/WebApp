import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss'],
})
export class BinComponent implements OnInit {
  binId: any;
  bin: any;
  page = 1;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.binId = res['id'];
      this.getItems();
    });
  }

  get lower() {
    return 10 * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min(10 * this.page, this.bin.totalItems);
  }

  async getItems(event?: any) {
    if (event) {
      this.bin = null;
    }
    try {
      const data = await this.rest.get(
        BACKEND_URL + `/bins/${this.binId}?page=${this
          .page - 1}`,
      );
      data['success']
        ? (this.bin = data)
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}