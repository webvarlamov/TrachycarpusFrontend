import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListFooterComponent } from './device-list-footer.component';

describe('DeviceListFooterComponent', () => {
  let component: DeviceListFooterComponent;
  let fixture: ComponentFixture<DeviceListFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceListFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceListFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
