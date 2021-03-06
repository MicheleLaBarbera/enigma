import { Component, OnInit } from '@angular/core';
import { HostgroupService } from '../_services/index';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public lastCheck: any;
  public refreshPanelTimer;

  constructor(private hostgroupService: HostgroupService) { }

  ngOnInit() {
    this.hostgroupService.getSchedulerLastCheck().subscribe(lastCheck => {
      this.lastCheck = lastCheck;
    });
    this.refreshPanelTimer = setInterval( () => {     
      this.hostgroupService.getSchedulerLastCheck().subscribe(lastCheck => {
        this.lastCheck = lastCheck;
      });
    }, 60000);
  }

  ngOnDestroy() {
    if (this.refreshPanelTimer) {
      clearInterval(this.refreshPanelTimer);
    }
  }

}
