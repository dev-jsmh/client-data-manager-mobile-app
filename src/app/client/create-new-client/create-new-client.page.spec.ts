import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewClientPage } from './create-new-client.page';

describe('CreateNewClientPage', () => {
  let component: CreateNewClientPage;
  let fixture: ComponentFixture<CreateNewClientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
