import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DoubtDetailPage } from './doubt-detail.page';

describe('DoubtDetailPage', () => {
  let component: DoubtDetailPage;
  let fixture: ComponentFixture<DoubtDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubtDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DoubtDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
