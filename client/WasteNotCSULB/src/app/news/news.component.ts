import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  news: any;

  newNews = '';
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/news'
      );
      data['success']
      ? (this.news = data['news'])
      : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async addNews() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(
        'http://localhost:3030/api/news',
        { _news: this.newNews }
      );
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
