import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupComponent } from './hostgroup.component';

describe('HostgroupComponent', () => {
  let component: HostgroupComponent;
  let fixture: ComponentFixture<HostgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
