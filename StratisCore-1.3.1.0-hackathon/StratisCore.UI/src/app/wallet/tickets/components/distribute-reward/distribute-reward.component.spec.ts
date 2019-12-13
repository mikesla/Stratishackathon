import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeRewardComponent } from './distribute-reward.component';

describe('DistributeRewardComponent', () => {
  let component: DistributeRewardComponent;
  let fixture: ComponentFixture<DistributeRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributeRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
