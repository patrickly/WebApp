import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item: any;
  binType: any;
  btnDisabled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  ngOnInit() {
    //ngOnInit() will be run everytime the page(item) is visited
    this.activatedRoute.params.subscribe(res => {
      this.rest
        .get(BACKEND_URL + `/item/${res['id']}`)
        .then(data => {
          data['success']
            ? (this.item = data['item'])
            : this.router.navigate(['/']);
          if (data['success']) {
            if (this.item.bin.name === 'Compost') {
              this.binType = 1;
            } else if (this.item.bin.name === 'Recycle') {
              this.binType = 2;
            } else if (this.item.bin.name === 'Landfill') {
              this.binType = 3;
            }

          }
        })
        .catch(error => this.data.error(error['message']));
    });
  } //ngOnInit

  async delete() {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.btnDisabled = true;

      try {
        const data = await this.rest.delete(
          BACKEND_URL + '/itemDelete/' + this.item._id
        );

        if (data['success']) {
        } else {
          this.data.error(data['message']);
        }
      } catch (error) {
        this.data.error(error['message']);
      }
      this.btnDisabled = false;
      this.router.navigate(['/items']);
    }
  } // delete

  edit() {

    this.router.navigate(['/item/edit/' + this.item._id]);
  }

  goBack() {
    window.history.back();
  }
} 
