import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-sprint-game-page',
  templateUrl: './sprint-game-page.component.html',
  styleUrls: ['./sprint-game-page.component.scss'],
})
export class SprintGamePageComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get('words').subscribe((req) => {
      console.log(req);
    });
  }
}
