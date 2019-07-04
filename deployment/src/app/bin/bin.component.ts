import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  binType: any;
  page = 1;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.binId = res['id'];
      this.getItems();
      this.getBinType();
    });
  }

  get lower() {
    return 50 * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min(50 * this.page, this.bin.totalItems);
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

  getBinType() {
    if (this.binId === '5ace82a94561ae0ecf27a16a') {
      this.binType = 1;
    } else if (this.binId === '5ae79d9d027d2834db315428') {
      this.binType = 2;
    } else if (this.binId === '5ae79d8e027d2834db315427') {
      this.binType = 3;
    }
  }

  goBack() {
    window.history.back();
  }
}