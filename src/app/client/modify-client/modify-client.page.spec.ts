import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyClientPage } from './modify-client.page';

describe('ModifyClientPage', () => {
  let component: ModifyClientPage;
  let fixture: ComponentFixture<ModifyClientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
