import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenericModalPage } from './generic-modal.page';

describe('GenericModalPage', () => {
  let component: GenericModalPage;
  let fixture: ComponentFixture<GenericModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
