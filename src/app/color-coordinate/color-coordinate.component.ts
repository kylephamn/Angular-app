import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  
  availableColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey', 'brown', 'black', 'teal'];
  selectedColors: string[] = [];
  selectedColorIndex = 0;
  
  rowNumbers: number[] = [];
  columnHeaders: string[] = [];
  colorSelectionTable: number[] = [];
  gridCellColors: string[][] = [];
  
  constructor(private fb: FormBuilder) {
    this.generatorForm = this.fb.group({
      rows: [5, [Validators.required, Validators.min(1), Validators.max(1000)]],
      cols: [5, [Validators.required, Validators.min(1), Validators.max(702)]],
      colors: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
      showCoordinates: [true]
    });
  }
  
  ngOnInit(): void {
  }
  
  get rowsControl() { return this.generatorForm.get('rows')!; }
  get colsControl() { return this.generatorForm.get('cols')!; }
  get colorsControl() { return this.generatorForm.get('colors')!; }
  
  generateCoordinateSheet(): void {
    if (this.generatorForm.valid) {
      const rows = this.generatorForm.value.rows;
      const cols = this.generatorForm.value.cols;
      const numColors = this.generatorForm.value.colors;
      
      this.rowNumbers = Array.from({ length: rows }, (_, i) => i + 1);
      
      this.columnHeaders = [];
      for (let i = 0; i < cols; i++) {
        this.columnHeaders.push(this.numberToExcelColumn(i));
      }
      
      this.colorSelectionTable = Array(numColors).fill(0);
      
      this.selectedColors = this.availableColors.slice(0, numColors);
      
      this.gridCellColors = Array(rows).fill(null).map(() => Array(cols).fill(''));
      
      this.isGridGenerated = true;
    }
  }
  
  numberToExcelColumn(num: number): string {
    let columnName = '';
    
    while (num >= 0) {
      columnName = String.fromCharCode(65 + (num % 26)) + columnName;
      num = Math.floor(num / 26) - 1;
    }
    
    return columnName;
  }
  
  isColorSelected(color: string): boolean {
    return this.selectedColors.indexOf(color) !== -1;
  }
  
  updateColorSelection(index: number): void {
    //index is for new color from selectedColors table
    //idea is loop through colors-tbl, split string, get cellnames
    //loop through grid, check if cell coordinate (textContent?) matches cellname
    //if match, update this.gridCellColors[rowindex][colIndex] = this.selectedColors[index]
  }
  
  cellClicked(rowIndex: number, colIndex: number, rowNumber: number, colHeader: string): void {
    if (this.selectedColorIndex >= 0 && this.selectedColorIndex < this.selectedColors.length) {
      this.gridCellColors[rowIndex][colIndex] = this.selectedColors[this.selectedColorIndex];
      let cellName = colHeader + "" + rowNumber + ",";
      var textNode = document.createTextNode(cellName);
      var table = document.getElementById("colors-tbl") as HTMLTableElement;
      for (var i = 0, row; row = table.rows[i]; i++) {
        var checkcol = row.cells[2];
        let newtext = checkcol.textContent?.replaceAll(cellName, "");
        if (checkcol.textContent != null && newtext != undefined) {
          checkcol.textContent = newtext;
        }
        var colorcol = row.cells[1];
        if (colorcol.id == this.selectedColors[this.selectedColorIndex]) {
          var rightcol = row.cells[2];
          rightcol.appendChild(textNode);
        }
      }
    }
  }
  
  getCellColor(rowIndex: number, colIndex: number): string {
    return this.gridCellColors[rowIndex][colIndex];
  }
  
  printPage(): void {
    window.print();
  }
}