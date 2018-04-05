import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsComponent } from './hostgroups.component';

describe('HostgroupsComponent', () => {
  let component: HostgroupsComponent;
  let fixture: ComponentFixture<HostgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
