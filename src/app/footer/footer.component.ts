import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public currentTime: any;

  constructor() { }

  ngOnInit() {
    this.currentTime = setInterval( () => {
      //let todayDate = new Date();
      this.currentTime = new Date();
    }, 1000);
  }

}
