import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DoubtsPage } from './doubts.page';

describe('DoubtsPage', () => {
  let component: DoubtsPage;
  let fixture: ComponentFixture<DoubtsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubtsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DoubtsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
