import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { ColorService } from '../services/color.service';
import { of } from 'rxjs';

const mockAvailableColors = [
  { id: 1, name: 'Red', hex_value: '#FF0000' },
  { id: 2, name: 'Blue', hex_value: '#0000FF' },
  { id: 3, name: 'Green', hex_value: '#00FF00' },
  { id: 4, name: 'Yellow', hex_value: '#FFFF00' },
];

class MockColorService {
  getColors() {
    return of(mockAvailableColors);
  }
  addColor(color: any) { return of({ ...color, id: 5 }); } 
  deleteColor(id: number) { return of({}); } 
  updateColor(id: number, color: any) { return of({ ...color, id: id }); } 
}


describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let mockColorService: MockColorService;

  beforeEach(async () => {
    mockColorService = new MockColorService();

    await TestBed.configureTestingModule({
      imports: [
        EditorComponent,
        FormsModule, 
        ReactiveFormsModule, 
        CommonModule,
      ],
      providers: [
        { provide: ColorService, useValue: mockColorService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available colors on init', () => {
     expect(component.availableColors.length).toBe(mockAvailableColors.length);
     expect(component.availableColors).toEqual(mockAvailableColors);
  });

  it('should populate edit fields when a color is selected for editing', () => {
      const colorToSelect = mockAvailableColors[0]; 
      component.selectedEditId = colorToSelect.id;

      component.loadEditColorData();
      fixture.detectChanges(); 

      expect(component.editName).toBe(colorToSelect.name);
      expect(component.editHex).toBe(colorToSelect.hex_value);

  
      const editDiv = fixture.nativeElement.querySelector('form') 
                      .querySelector('div[ngIf]'); 

      expect(editDiv).not.toBeNull(); 
      const nameInput = editDiv.querySelector('#editcolorname');
      const hexInput = editDiv.querySelector('#editcolorval');
      const updateButton = editDiv.querySelector('#update-btn');

      expect(nameInput).not.toBeNull();
      expect(hexInput).not.toBeNull();
      expect(updateButton).not.toBeNull();

      expect(nameInput.value).toBe(colorToSelect.name);
      expect(hexInput.value).toBe(colorToSelect.hex_value);
  });

  it('should clear edit fields when "Select a color to edit" is chosen', () => {
       const colorToSelect = mockAvailableColors[0];
       component.selectedEditId = colorToSelect.id;
       component.loadEditColorData();
       fixture.detectChanges();

       expect(component.editName).toBe(colorToSelect.name);
       expect(component.editHex).toBe(colorToSelect.hex_value);
       expect(component.selectedEditId).toBe(colorToSelect.id);

       component.selectedEditId = null;
       component.loadEditColorData();
       fixture.detectChanges();

       expect(component.editName).toBe('');
       expect(component.editHex).toBe('#000000');
       expect(component.selectedEditId).toBeNull(); 

       
       const editDiv = fixture.nativeElement.querySelector('form')
                       .querySelector('div[ngIf]');

       expect(editDiv).toBeNull(); 
  });


  it('should call colorService.updateColor when edit form is submitted', () => {
      spyOn(mockColorService, 'updateColor').and.callThrough();

      
      const colorToEdit = mockAvailableColors[0];
      component.selectedEditId = colorToEdit.id;
      component.loadEditColorData();
      fixture.detectChanges();

      
      component.editName = 'Updated Red';
      component.editHex = '#AA0000';
      fixture.detectChanges(); 

      component.editColor();

      expect(mockColorService.updateColor).toHaveBeenCalledWith(colorToEdit.id, {
          name: 'Updated Red',
          hex_value: '#AA0000'
      });

      expect(component.selectedEditId).toBeNull();
      expect(component.editName).toBe('');
      expect(component.editHex).toBe('#000000');
  });

   it('should disable update button if name or hex is empty', () => {
       const colorToEdit = mockAvailableColors[0];
       component.selectedEditId = colorToEdit.id;
       component.loadEditColorData();
       fixture.detectChanges();

       const editDiv = fixture.nativeElement.querySelector('form').querySelector('div[ngIf]');
       const updateButton: HTMLButtonElement = editDiv.querySelector('#update-btn');

       
       expect(component.editName).toBe(colorToEdit.name); 
       expect(component.editHex).toBe(colorToEdit.hex_value); 
       expect(updateButton.disabled).toBeFalse();


       component.editName = '';
       fixture.detectChanges(); 

       expect(updateButton.disabled).toBeTrue();

       component.editName = colorToEdit.name; 
       component.editHex = ''; 
       fixture.detectChanges();

       expect(updateButton.disabled).toBeTrue();

       component.editName = '';
       component.editHex = '';
       fixture.detectChanges();

       expect(updateButton.disabled).toBeTrue();

       component.editName = colorToEdit.name;
       component.editHex = colorToEdit.hex_value;
       fixture.detectChanges();

       expect(updateButton.disabled).toBeFalse();
   });

    it('should not call updateColor if fields are empty on submit', () => {
        spyOn(mockColorService, 'updateColor'); 

        component.selectedEditId = mockAvailableColors[0].id;
        component.loadEditColorData();
        fixture.detectChanges();

        component.editName = '';
        component.editHex = '';
        fixture.detectChanges();

        component.editColor();

        expect(mockColorService.updateColor).not.toHaveBeenCalled();
    });

});