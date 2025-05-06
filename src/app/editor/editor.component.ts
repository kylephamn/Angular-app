import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Color, ColorService } from '../services/color.service';


@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'] 
})

export class EditorComponent implements OnInit {
  availableColors: Color[] = [];

  newColorHex: string = '#000000';
  newColorName: string = '';

  selectedRemoveId: number | null = null;

  selectedEditId: number | null = null;
  editHex: string = '#000000';
  editName: string = '';


  constructor(private colorService: ColorService) {}

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.colorService.getColors().subscribe({
      next: (colors) => {
        this.availableColors = colors;
        console.log('loadColors: Available colors loaded:', colors);

        if (this.selectedRemoveId !== null && !this.availableColors.find(c => c.id === this.selectedRemoveId)) {
          console.log(`loadColors: Selected remove color (ID: ${this.selectedRemoveId}) no longer exists. Resetting selection.`);
          this.selectedRemoveId = null;
        }
        if (this.selectedEditId !== null) {
             const colorStillExists = this.availableColors.find(c => c.id === this.selectedEditId);
            if (!colorStillExists) {
                console.log(`loadColors: Selected edit color (ID: ${this.selectedEditId}) no longer exists after reload. Resetting selection and fields.`);
                this.selectedEditId = null;
                this.editName = '';
                this.editHex = '#000000';
            } else {
                 console.log(`loadColors: Selected edit color (ID: ${this.selectedEditId}) still exists after reload. Reloading edit data.`);
                 this.loadEditColorData();
            }
        }


      },
      error: (err) => {
        console.error('loadColors: Error loading colors:', err);
        alert(`Failed to load colors: ${err.error?.error || err.message}`);
        this.availableColors = []; 
      }
    });
  }

  addColor(): void {
    const name = this.newColorName.trim();
    if (!name) {
        alert('Color name cannot be empty.');
        console.warn('addColor: Color name is empty.');
        return;
    }
    if (!this.newColorHex) {
         alert('Color hex value cannot be empty.');
         console.warn('addColor: Color hex value is empty.');
         return;
    }
     if (!/^#([0-9A-Fa-f]{6})$/.test(this.newColorHex)) {
        alert('Invalid hex value format. Must be #RRGGBB (e.g., #FF0000).');
        console.warn('addColor: Invalid hex format:', this.newColorHex);
        return;
     }

     console.log('addColor: Attempting to add color', { name: name, hex_value: this.newColorHex });

    this.colorService.addColor({ name: name, hex_value: this.newColorHex })
      .subscribe({
        next: (response) => {
          console.log('addColor: Color added successfully:', response);
          this.loadColors(); // Reload the list after successful add
          this.newColorName = '';
          this.newColorHex = '#000000';
        },
        error: (err) => {
          console.error('addColor: Error adding color:', err);
          alert(`Failed to add color: ${err.error?.error || err.message}`);
        }
      });
  }

  deleteColor(): void {
    if (this.selectedRemoveId === null) {
        console.warn('deleteColor: No color selected for removal.');
        return;
    }
    if (this.availableColors.length <= 2) {
        alert('Cannot delete color. At least 2 colors must remain for the generator.');
        console.warn('deleteColor: Attempted to delete color, but minimum color count check failed.');
        return;
    }

    if (!confirm('Are you sure you want to delete this color?')) {
        console.log('deleteColor: Color deletion cancelled by user.');
        return;
    }

     console.log('deleteColor: Attempting to delete color ID', this.selectedRemoveId);

    this.colorService.deleteColor(this.selectedRemoveId)
      .subscribe({
        next: (response) => {
          console.log('deleteColor: Color deleted successfully:', response);
          this.loadColors(); // Reload the list after successful deletion
          this.selectedRemoveId = null; // Reset the selected remove color
        },
        error: (err) => {
          console.error('deleteColor: Error deleting color:', err);
           alert(`Failed to delete color: ${err.error?.error || err.message}`);
        }
      });
  }

  loadEditColorData(): void {
      console.log('loadEditColorData called. Current selectedEditId:', this.selectedEditId, 'Current editName:', this.editName, 'Current editHex:', this.editHex);

      if (this.selectedEditId !== null) {
          console.log('loadEditColorData: Looking for color with ID', this.selectedEditId, 'in availableColors:', this.availableColors);

          const colorToEdit = this.availableColors.find(color => color.id === this.selectedEditId);

          console.log('loadEditColorData: Find result:', colorToEdit);

          if (colorToEdit) {
              this.editName = colorToEdit.name;
              this.editHex = colorToEdit.hex_value;
              console.log('loadEditColorData: Loaded data for editing:', { name: this.editName, hex: this.editHex });
               console.log('loadEditColorData: Fields should now be populated.');
          } else {
              console.warn(`loadEditColorData: Color with ID ${this.selectedEditId} not found in availableColors. Resetting edit state.`);
              this.selectedEditId = null;
              this.editName = '';
              this.editHex = '#000000';
              console.log('loadEditColorData: selectedEditId set to null, fields cleared.');
          }
      } else {
           this.editName = '';
           this.editHex = '#000000';
           this.selectedEditId = null;
           console.log('loadEditColorData: Resetting edit fields as no color is selected.');
      }
  }

  editColor(): void {
     console.log('editColor called. Current selectedEditId:', this.selectedEditId, 'Current editName:', this.editName, 'Current editHex:', this.editHex);

    
    if (this.selectedEditId === null) {
        console.warn('editColor: Cannot update, selectedEditId is null.');
        alert('Please select a color to edit before clicking Update.'); 
        return; 
    }

    
    const name = this.editName.trim();


    
     if (!name) {
         alert('Edited color name cannot be empty.');
        console.warn('editColor: Validation failed: Edited color name is empty.');
        return;
    }
    if (!this.editHex) {
        alert('Edited color hex value cannot be empty.');
        console.warn('editColor: Validation failed: Edited color hex value is empty.');
        return;
    }

     if (!/^#([0-9A-Fa-f]{6})$/.test(this.editHex)) {
        alert('Invalid hex value format for edit. Must be #RRGGBB (e.g., #FF0000).');
        console.warn('editColor: Validation failed: Invalid edited hex format:', this.editHex);
        return;
     }


     console.log('editColor: Validation passed. Attempting to update color ID', this.selectedEditId, 'with', { name: name, hex_value: this.editHex });

    
    this.colorService.updateColor(this.selectedEditId, { name: name, hex_value: this.editHex })
      .subscribe({
        next: (response) => {
          console.log('editColor: Color updated successfully:', response);
          this.loadColors(); 
          this.selectedEditId = null; 
          this.editName = '';
          this.editHex = '#000000';
           console.log('editColor: Edit state reset.');
        },
        error: (err) => {
          console.error('editColor: Error updating color:', err);
          alert(`Failed to update color: ${err.error?.error || err.message}`);
        }
      });
  }
}
