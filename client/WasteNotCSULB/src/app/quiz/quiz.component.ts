import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.api;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  idx: number = 0;

  btnDisabled = true;

  items: any = null;

  obj4: any = {
    answered: false
  };

  answerCompost: any = false;
  answerRecycle: any = false;
  answerLandfill: any = false;

  questionResultRight: any = null;
  questionResultWrong: any = null;
  totalRight: number = 0.0;
  scorePercent: number = 0.0;

  quizFinished: boolean = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(BACKEND_URL + '/itemsRandom');
      data['success']
        ? (this.items = data['items'])
        : this.data.error(data['message']);

      if (data['success']) {
        this.items.forEach(element => {
          element = Object.assign(element, this.obj4);

          //console.log(JSON.stringify(element));
        });
        this.shuffle(this.items);
      } else {
        console.log('TTTT error');
      }
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  myFunction() {
    if (this.idx >= 9) {
      this.quizFinished = true;
    }
    this.btnDisabled = true;
    this.questionResultRight = null;
    this.questionResultWrong = null;
    this.answerCompost = false;
    this.answerRecycle = false;
    this.answerLandfill = false;
    this.idx += 1;
  }

  submitAnswer(itemIndex: number, choiceNum: number) {
    var tempChoice: string = '';

    if (choiceNum === 7) {
      tempChoice = 'Compost';
      this.answerCompost = true;

    }
    if (choiceNum === 8) {
      tempChoice = 'Recycle';
      this.answerRecycle = true;

    }
    if (choiceNum === 9) {
      tempChoice = 'Landfill';
      this.answerLandfill = true;

    }


    if (choiceNum === 7 && this.items[itemIndex].isCompostAndLandfill) {
      this.questionResultRight = 'Correct';
      this.totalRight += 1;
      this.items[itemIndex].bin.name = this.items[itemIndex].bin.name + ' or Landfill';

    }
    else if (tempChoice.includes(this.items[itemIndex].bin.name)) {
      this.questionResultRight = 'Correct';
      this.totalRight += 1;
    } else if (choiceNum === 9 && this.items[itemIndex].isCompostAndLandfill) {
      this.questionResultRight = 'Correct';
      this.totalRight += 1;
      this.items[itemIndex].bin.name = this.items[itemIndex].bin.name + ' or Landfill';

    }
    else if (choiceNum === 8 && this.items[itemIndex].isCompostAndLandfill) {
      this.questionResultWrong = 'Incorrect';
      this.items[itemIndex].bin.name = this.items[itemIndex].bin.name + ' or Landfill';
    }
    else {
      this.questionResultWrong = 'Incorrect';
    }

    this.items[itemIndex].answered = true;
    if (this.items[itemIndex].answered) {
      this.btnDisabled = false;
    }

    if (this.totalRight > 0) {
      this.scorePercent = (this.totalRight / (itemIndex + 1)) * 100;
    } else {
      this.scorePercent = 0;
    }

    if (itemIndex > 9) {
      this.quizFinished = true;
    }
  } //submitAnswer

  shuffle(array): void {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
  } // shuffle

  exitQuiz(): void {
    this.router.navigate(['/']);
  }

  refresh(): void {
    window.location.reload();
  }

  update(): void {
    this.ngOnInit();
  }

  goBack() {
    window.history.back();
  }
}
