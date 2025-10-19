import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePerson } from './image-person';

describe('ImagePerson', () => {
  let component: ImagePerson;
  let fixture: ComponentFixture<ImagePerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePerson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagePerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
