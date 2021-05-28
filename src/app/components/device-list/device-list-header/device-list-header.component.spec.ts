import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListHeaderComponent } from './device-list-header.component';

describe('DeviceListHeaderComponent', () => {
  let component: DeviceListHeaderComponent;
  let fixture: ComponentFixture<DeviceListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceListHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
