import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchTerm = '';

  constructor(
    private router: Router,
    private data: DataService,
  ) {
  }

  search() {
    if (this.searchTerm) {
      this.router.navigate(['search', { query: this.searchTerm }]);
    }
  }

  ngOnInit() {
  }
}