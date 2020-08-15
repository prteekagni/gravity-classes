import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LectureDetailPage } from './lecture-detail.page';

describe('LectureDetailPage', () => {
  let component: LectureDetailPage;
  let fixture: ComponentFixture<LectureDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LectureDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
