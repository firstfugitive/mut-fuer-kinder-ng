import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentStandard } from './page-content-standard';

describe('PageContentStandard', () => {
  let component: PageContentStandard;
  let fixture: ComponentFixture<PageContentStandard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContentStandard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageContentStandard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
