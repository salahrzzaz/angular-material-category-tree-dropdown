import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryTreeSelectComponent } from '../category-tree-select/category-tree-select.component';
import { mockCategories } from '../category-tree-select/mock-categories';

@Component({
  selector: 'app-parent-component',
  templateUrl: './parent-component.component.html',
  styleUrls: ['./parent-component.component.scss'],
  standalone: true, // Make it a standalone component
  imports: [CommonModule, ReactiveFormsModule, CategoryTreeSelectComponent]
})
export class ParentComponent implements OnInit {
  categoryControl = new FormControl();
  categories: any[] = [];

  ngOnInit(): void {
    this.categories = mockCategories; // Use the static mock data
  }
}
