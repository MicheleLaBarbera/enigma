import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresComponent } from './infrastructures.component';

describe('InfrastructuresComponent', () => {
  let component: InfrastructuresComponent;
  let fixture: ComponentFixture<InfrastructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrastructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
