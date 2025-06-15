import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDocumentModalComponent } from './delete-document-modal.component';

describe('DeleteDocumentModalComponent', () => {
  let component: DeleteDocumentModalComponent;
  let fixture: ComponentFixture<DeleteDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
