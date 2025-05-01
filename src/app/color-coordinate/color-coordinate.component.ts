import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Color, ColorService } from '../services/color.service';
import { Observable } from 'rxjs'; 

@Component({
  selector: 'app-color-coordinate',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './color-coordinate.component.html',
  styleUrls: ['./color-coordinate.component.css'] 
})
export class ColorCoordinateComponent implements OnInit {

  generatorForm: FormGroup; 
  isGridGenerated = false; 

  availableColors: Color[] = []; 
  selectedColors: Color[] = []; 
  selectedColorIndex = 0; 

  rowNumbers: number[] = []; 
  columnHeaders: string[] = []; 
  gridCellColors: string[][] = []; 


  private selectedColorCoordinates: { [colorId: number]: string[] } = {};

  private selectedColorsSnapshot: Color[] = [];



  get rowsControl(): AbstractControl | null { return this.generatorForm.get('rows'); }
  get colsControl(): AbstractControl | null { return this.generatorForm.get('cols'); }
  get colorsControl(): AbstractControl | null { return this.generatorForm.get('colors'); }


  constructor(
    private fb: FormBuilder, 
    private colorService: ColorService 
  ) {
    this.generatorForm = this.fb.group({
      rows: [10, [Validators.required, Validators.min(1), Validators.max(1000)]], 
      cols: [10, [Validators.required, Validators.min(1), Validators.max(702)]], 
      colors: [3, [Validators.required, Validators.min(1), Validators.max(10)]], 
      showCoordinates: [true] 
    });
  }

  ngOnInit(): void {
    this.loadAvailableColors();
  }

  loadAvailableColors(): void {
      this.colorService.getColors().subscribe({
          next: (colors) => {
              this.availableColors = colors;
              console.log('Available colors loaded:', colors);

              const maxColors = this.availableColors.length > 0 ? this.availableColors.length : 1;

              this.colorsControl?.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(maxColors) 
              ]);
              this.colorsControl?.updateValueAndValidity();

              if (this.generatorForm.value.colors > maxColors) {
                  this.generatorForm.patchValue({ colors: maxColors });
              } else if (this.availableColors.length === 0) {
                   this.generatorForm.patchValue({ colors: 1 });
              }

               
          },
          error: (err) => {
              console.error('Error loading available colors:', err);
              alert(`Failed to load available colors: ${err.message || 'Unknown error'}. Please check the Color Editor.`);
              this.availableColors = [];
               this.colorsControl?.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(1) 
              ]);
              this.colorsControl?.updateValueAndValidity();
              this.generatorForm.patchValue({ colors: 1 }); 
          }
      });
  }

  generateCoordinateSheet(): void {
    if (this.generatorForm.valid && this.availableColors.length > 0) {
      const rows = this.generatorForm.value.rows as number;
      const cols = this.generatorForm.value.cols as number;
      const numColorsToSelect = this.generatorForm.value.colors as number;

      if (this.availableColors.length < numColorsToSelect) {
          alert(`Not enough colors available (${this.availableColors.length}). Please add more colors or reduce the number of colors to select (${numColorsToSelect}).`);
          return; 
      }

      this.rowNumbers = Array.from({ length: rows }, (_, i) => i + 1);

      this.columnHeaders = [];
      for (let i = 0; i < cols; i++) {
        this.columnHeaders.push(this.numberToExcelColumn(i));
      }

      this.selectedColors = this.availableColors.slice(0, numColorsToSelect);

      this.gridCellColors = Array(rows).fill(null).map(() => Array(cols).fill(''));

      this.selectedColorCoordinates = {};
      this.selectedColors.forEach(color => {
         if (color && color.id !== undefined) {
            this.selectedColorCoordinates[color.id] = [];
         } else {
            console.error("Invalid color object in selectedColors during initialization:", color);
         }
      });

      this.isGridGenerated = true;
      this.selectedColorIndex = 0; 

      this.updateSelectedColorsSnapshot();

      this.rebuildSelectedColorCoordinates();

       console.log('Grid generated:', { rows, cols, numColorsToSelect, selectedColors: this.selectedColors });
    } else if (!this.generatorForm.valid) {
      this.generatorForm.markAllAsTouched();
      console.warn('Form is invalid. Cannot generate grid.');
    } else { 
       console.warn('No available colors loaded. Cannot generate grid.');
        alert('Cannot generate grid: No colors are available. Please add colors in the Color Editor.');
    }
  }

  numberToExcelColumn(num: number): string {
    let columnName = '';
    let dividend = num + 1; 

    while (dividend > 0) {
        const modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName; 
        dividend = Math.floor((dividend - 1) / 26);
    }

    return columnName;
  }

  cellClicked(rowIndex: number, colIndex: number, rowNumber: number, colHeader: string): void {
    if (this.selectedColorIndex >= 0 && this.selectedColorIndex < this.selectedColors.length) {
      const selectedColor = this.selectedColors[this.selectedColorIndex];

      if (!selectedColor || !selectedColor.hex_value || selectedColor.id === undefined) {
        console.warn('Selected color is invalid or missing properties. Cannot paint cell.');
        return; 
      }

     
      this.gridCellColors[rowIndex][colIndex] = selectedColor.hex_value;

      this.rebuildSelectedColorCoordinates();

    } else {
        console.warn('No color selected (radio button). Click a radio button next to a color to select it for painting.');
    }
  }

  getCellColor(rowIndex: number, colIndex: number): string {
    
    return this.gridCellColors[rowIndex][colIndex] || '';
  }

  getCoordinatesForColor(colorId: number | undefined): string {
      if (colorId === undefined || !this.selectedColorCoordinates[colorId]) {
          return ''; 
      }
      return this.selectedColorCoordinates[colorId].join(', ') || '';
  }



  onColorChange(index: number, newColor: Color): void {

      const isDuplicate = this.selectedColors.some((color, i) =>
          i !== index && color && newColor && color.id === newColor.id
      );

      if (isDuplicate) {
          alert(`"${newColor.name}" is already selected in another slot. Please choose a different color.`);

          const previousColorAtIndex = this.selectedColorsSnapshot[index];

          if (previousColorAtIndex) {
              this.selectedColors[index] = previousColorAtIndex;
              console.log(`Reverted selectedColors[${index}] to`, previousColorAtIndex);
          } else {
              console.error(`Snapshot error: Could not find previous color for index ${index}.`);
          }
          

      } else {
     
          this.rebuildSelectedColorCoordinates();
          this.updateSelectedColorsSnapshot();
           console.log(`Color at index ${index} successfully changed to`, this.selectedColors[index]);
      }
  }

   private updateSelectedColorsSnapshot(): void {
       this.selectedColorsSnapshot = this.selectedColors.map(color => color ? {...color} : color);
   }


  isColorAlreadySelected(color: Color, currentIndex: number): boolean {
    if (!color || color.id === undefined) return false;

    return this.selectedColors.some((selected, i) =>
      i !== currentIndex && selected && selected.id === color.id
    );
  }

  private rebuildSelectedColorCoordinates(): void {
      this.selectedColorCoordinates = {};

      this.selectedColors.forEach(color => {
          if (color && color.id !== undefined) {
               this.selectedColorCoordinates[color.id] = [];
          } else {
              console.error("Attempted to initialize coordinates for invalid selected color:", color);
          }
      });

      for (let r = 0; r < this.rowNumbers.length; r++) {
          for (let c = 0; c < this.columnHeaders.length; c++) {
              const cellHexColor = this.gridCellColors[r][c]; 

              if (cellHexColor) {
                  const selectedColor = this.selectedColors.find(sc => sc && sc.hex_value === cellHexColor);

                  if (selectedColor && selectedColor.id !== undefined) {
                      const cellName = this.columnHeaders[c] + "" + this.rowNumbers[r];

                      const coordsList = this.selectedColorCoordinates[selectedColor.id];

                      if (!coordsList.includes(cellName)) {
                          coordsList.push(cellName);
                      }
                  }
              }
          }
      }

      Object.values(this.selectedColorCoordinates).forEach(coords => coords.sort());

  }



  printPage(): void {
    window.print();
  }


}