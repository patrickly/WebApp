import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  item = {
    title: '',
    categoryId: '',
    description: '',
    item_picture: ''
  };

  categories: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  validate(item) {
    if (item.title) {
        if (item.categoryId) {
          if (item.description) {
            if (item.item_picture) {
              return true;
            } else {
              this.data.error('Please enter a link for the item.');
            }
          } else {
            this.data.error('Please enter description.');
          }
        } else {
          this.data.error('Please select category.');
        }
      
    } else {
      this.data.error('Please enter a title.');
    }
  }



  async post() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.item)) {
        const data = await this.rest.post(
          'http://localhost:3030/api/admin/items',
          { category: this.item.categoryId,
            title: this.item.title,
            description: this.item.description,
            image: this.item.item_picture }
        );
        data['success']
          ? this.router.navigate(['/profile/'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
