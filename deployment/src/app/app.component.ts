import { Component, HostListener, ElementRef, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './data.service';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from "../environments/environment";
import { RestApiService } from './rest-api.service';


const BACKEND_URL = environment.api;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  itemIndex: any;
  itemData: any;
  itemArray: any[];
  totalItems: any;
  page = 1;

  selected: string = "";
  directSelect: any = false;

  searchTerm = '';
  isCollapsed = true;

  constructor(
    private router: Router,
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService,
    private eleRef: ElementRef
  ) {
    this.data.getProfile();
    this.activatedRoute.params.subscribe(res => {
      this.getItems();
    });
  }

  jumpToTopPage() {
    window.scrollTo(0, 0);
  }

  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {
    this.data.user = {};
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {
    if (this.searchTerm) {
      this.collapse();

    }
    this.searchTerm = null;
  }

  selectItemName(name) {

    this.itemIndex = 0;
    for (var i = 0; i < this.itemArray.length; i++) {
      if (this.itemArray[i].title === name) {
        this.itemIndex = i;


        this.directSelect = true;

      }
    }



    if (name) {
      this.collapse();
      if (this.directSelect) {
        this.router.navigate(['/item/' + this.itemArray[this.itemIndex]._id]);
      } else {
        this.router.navigate(['search', { query: name }]);
      }
    }
    this.selected = null; // 
    this.directSelect = false;
  }

  onChange(deviceValue) {
  }

  async getItems(event?: any) {
    if (event) {
      this.itemData = null;
    }
    try {
      const data = await this.rest.get(
        BACKEND_URL + `/itemsAll/?page=${this
          .page - 1}` ,
      );
      if (data['success']) {
        this.itemData = data;
        this.itemArray = this.itemData.items;
      } else {
        this.data.error(data['message']);
      }


    } catch (error) {
      this.data.error(error['message']);
    }
  }

}