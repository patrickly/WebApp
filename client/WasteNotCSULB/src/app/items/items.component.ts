import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  itemData: any;
  totalItems:any;
  page = 1;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService) { }

    ngOnInit() {
      this.activatedRoute.params.subscribe(res => {
        this.getItems();
      });
    }



  get lower() {
    return 10 * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min(10 * this.page, this.itemData.totalItems);
  }

  async getItems(event?: any) {
    if (event) {
      this.itemData = null;
    }
    try {
      const data = await this.rest.get(
       `http://localhost:3030/api/items/?page=${this
           .page - 1}` ,
      //"http://localhost:3030/api/items"

      );
      data['success']
        ? (this.itemData = data)
        : this.data.error(data['message']);
      console.log(this.itemData);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

} // class


