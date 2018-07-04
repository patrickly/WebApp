import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

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
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) {}

  ngOnInit() {
    //ngOnInit() will be run everytime the page(item) is visited
    this.activatedRoute.params.subscribe(res => {
      this.rest
        .get(`http://localhost:3030/api/item/${res['id']}`)
        .then(data => {
          data['success']
            ? (this.item = data['item'])
            : this.router.navigate(['/']);
          if (data['success']) {
            console.log(this.item.category.name === 'compost');

            if (this.item.category.name === 'compost') {
              this.binType = 1;
            } else if (this.item.category.name === 'recycle') {
              this.binType = 2;
            } else if (this.item.category.name === 'landfill') {
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

      //  console.log(`${this.item['id']}`);
      //  console.log(this.item);

      console.log('http://localhost:3030/api/itemDelete/' + this.item._id);

      // const data = await this.rest.delete(`http://localhost:3030/api/itemDelete/${this.item['id']}`);

      try {
        const data = await this.rest.delete(
          'http://localhost:3030/api/itemDelete/' + this.item._id
        );

        if (data['success']) {
          console.log('item deleted');
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
    console.log('http://localhost:3030/api/item/edit' + this.item._id);

    this.router.navigate(['/item/edit/' + this.item._id]);
  }
} // class
