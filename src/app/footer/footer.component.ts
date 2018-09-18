import { Component, OnInit } from '@angular/core';
import { HostgroupService } from '../_services/index';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public lastCheck: any;

  constructor(private hostgroupService: HostgroupService) { }

  ngOnInit() {
    this.hostgroupService.getSchedulerLastCheck().subscribe(lastCheck => {
      this.lastCheck = lastCheck;
    });

  }

}
