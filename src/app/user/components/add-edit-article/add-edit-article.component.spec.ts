import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditArticleComponent } from './add-edit-article.component';

describe('AddEditArticleComponent', () => {
  let component: AddEditArticleComponent;
  let fixture: ComponentFixture<AddEditArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
