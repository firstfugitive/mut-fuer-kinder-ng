import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentHome } from './page-content-home';

describe('PageContentHome', () => {
  let component: PageContentHome;
  let fixture: ComponentFixture<PageContentHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContentHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageContentHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
