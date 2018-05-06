import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {


    item = {
      title: '',
      categoryId: '',
      description: '',
      item_picture: '',
      image: ''
    };

    currentCategoryID: any = null;
    currentCategoryName: any = null;

    itemID : any = null;
    itemIDstr : string = null;

    categories: any;
    btnDisabled = false;
  
    constructor(
      private data: DataService,
      private data2: DataService,
      private rest: RestApiService,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) { }
  
 


    async ngOnInit() { //ngOnInit() will be run everytime the page(item) is visited
      this.activatedRoute.params.subscribe(res => {
        this.rest
          .get(`http://localhost:3030/api/item/${res['id']}`)
          .then(data => {
            data['success']
              ? (this.item = data['item'])
              : this.router.navigate(['/news']);
            if(data['success']){
              console.log(  "ngOnInit in editItem component");
              console.log(res);
              console.log(this.item);
         //     this.currentCategory = data['item'].category.name;
              console.log(data['item'].category.name);
              console.log(data['item'].category);

              this.currentCategoryID = data['item'].category;
              this.currentCategoryName = data['item'].category.name;

              console.log(this.currentCategoryID);
              console.log(this.currentCategoryName);

              this.item.item_picture =  data['item'].image;

              this.itemID = res.id;
           //   this.itemIDstr = this.itemID.toString;

              console.log(this.itemID);
           //   console.log(this.itemIDstr);

              console.log("http://localhost:3030/api/items/" + this.itemID);

            }  
          })
          .catch(error => this.data.error(error['message']));
      });

      try {
        const data2 = await this.rest.get(
          'http://localhost:3030/api/categories'
        );
        data2['success']
          ? (this.categories = data2['categories'])
          : this.data.error(data2['message']);

        console.log(this.categories);
        console.log(this.item);


      } catch (error) {
        this.data.error(error['message']);
      }

    }; //ngOnInit
  

    /*
    try {
      const data2 = await this.rest.get(
        'http://localhost:3030/api/categories'
      );
      data2['success']
        ? (this.categories = data2['categories'])
        : this.data.error(data2['message']);
    } catch (error) {
      this.data.error(error['message']);
    }

*/


    validate(item) {
  
     // console.log("33post-item " + item);
     //  console.log(JSON.stringify(item));
      if (item.title) {
          if (item.categoryId) {
            if (item.item_picture) {
              if (item.description ) {
                return true;
              } else {
                this.data.error('Please enter description.');
              }
            } else {
              this.data.error('Please enter a link for the item.');
            }
          } else {
            this.data.error('Please select category.');
          }
        
      } else {
        this.data.error('Please enter a title.');
      }
    }
  
  //             "http://localhost:3030/api/items/" + this.item._id,

  
    async post() {
      this.btnDisabled = true;
      try {
        if (this.validate(this.item)) {
  
          console.log("$$$$ categoryID is " + this.item.categoryId);
          console.log(this.itemID);


          console.log("#### " + "http://localhost:3030/api/item/" + this.itemID);
          const data = await this.rest.post(
            "http://localhost:3030/api/item/" + this.itemID,
            { category: this.item.categoryId,
              title: this.item.title,
              description: this.item.description,
              image: this.item.item_picture }
          );
          data['success']
            ? this.router.navigate(['/items/'])
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
  
