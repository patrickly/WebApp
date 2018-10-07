import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  item = {
    title: '',
    binId: '',
    typeId: '',
    description: '',
    item_picture: ''
  };

  bins: any;
  types: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        BACKEND_URL + '/bins'
      );
      data['success']
        ? (this.bins = data['bins'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  validate(item) {

    // console.log("33post-item " + item);
    //  console.log(JSON.stringify(item));
    if (item.title) {
      if (item.binId) {
        if (item.typeId){
          if (item.item_picture) {
            if (item.description) {
              return true;
            } else {
              this.data.error('Please enter description.');
            }
          } else {
            this.data.error('Please enter a link for the item.');
          }
        } else{
          this.data.error('Please select a type.');
        }
      } else {
        this.data.error('Please select a bin.');
      }

    } else {
      this.data.error('Please enter a title.');
    }
  }



  async post() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.item)) {

        console.log("$$$$ binID is " + this.item.binId);
        const data = await this.rest.post(
          BACKEND_URL + '/admin/items',
          {
            bin: this.item.binId,
            type: this.item.typeId,
            title: this.item.title,
            description: this.item.description,
            image: this.item.item_picture
          }
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
