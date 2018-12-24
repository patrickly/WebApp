import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  item = {
    title: '',
    binId: '',
    typeId: '',
    description: '',
    image: '',

    correctAnswerFeedback: '',
    tipCompostWrong: '',
    tipRecycleWrong: '',
    tipLandfillWrong: '',
    isCompostAndLandfill: false,
  };

  currentBinID: any = null;
  currentBinName: any = null;

  currentTypeID: any = null;
  currentTypeName: any = null;

  itemID: any = null;
  itemIDstr: string = null;

  bins: any;
  types: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private data2: DataService,
    private rest: RestApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.rest
        .get(BACKEND_URL + `/item/${res['id']}`)
        .then(data => {
          data['success']
            ? (this.item = data['item'])
            : this.router.navigate(['/news']);
          if (data['success']) {

            this.currentBinID = data['item'].bin._id;
            this.item.binId = data['item'].bin._id;

            this.currentTypeID = data['item'].type._id;
            this.item.typeId = data['item'].type._id;

            this.currentBinName = data['item'].bin.name;
            this.currentTypeName = data['item'].type.name;

            this.item.image = data['item'].image;

            this.itemID = res.id;

          }
        })
        .catch(error => this.data.error(error['message']));
    });

    try {
      const data2 = await this.rest.get(BACKEND_URL + '/bins');
      data2['success']
        ? (this.bins = data2['bins'])
        : this.data.error(data2['message']);


    } catch (error) {
      this.data.error(error['message']);
    }

    try {
      const data3 = await this.rest.get(BACKEND_URL + '/types');
      data3['success']
        ? (this.types = data3['types'])
        : this.data.error(data3['message']);


    } catch (error) {
      this.data.error(error['message']);
    }

  }



  validate(item) {

    if (item.title) {
      if (item.bin._id) {
        if (item.image) {
          if (item.description) {
            return true;
          } else {
            this.data.error('Please enter description.');
          }
        } else {
          this.data.error('Please enter a link for the item.');
        }
      } else {
        this.data.error('Please select bin.');
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
          BACKEND_URL + '/item/' + this.itemID,
          {
            bin: this.item.binId,
            type: this.item.typeId,
            title: this.item.title,
            description: this.item.description,
            image: this.item.image,


            correctAnswerFeedback: this.item.correctAnswerFeedback,
            tipCompostWrong: this.item.tipCompostWrong,
            tipRecycleWrong: this.item.tipRecycleWrong,
            tipLandfillWrong: this.item.tipLandfillWrong,
            isCompostAndLandfill: this.item.isCompostAndLandfill

          }
        );


        if (data['success']) {
          this.router
            .navigate(['/items/'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error));
        } else {
          this.data.error(data['message']);
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

  goBack() {
    window.history.back();
  }
}
