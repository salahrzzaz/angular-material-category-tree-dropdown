import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { TodoItemFlatNode, TodoItemNode } from './check-list-database';

@Component({
  selector: 'app-category-tree-select',
  templateUrl: './category-tree-select.component.html',
  styleUrls: ['./category-tree-select.component.scss'],
  standalone: true, // Make it a standalone component
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class CategoryTreeSelectComponent implements OnInit {

  @Input() categoryControl: FormControl = new FormControl();
  @Input() categories: any[] = []; 
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  dropdownOpen = false;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    const formattedData = this.formatDataForTree(this.categories);
    this.dataSource.data = formattedData;
  }

  formatDataForTree(categories: any[]): TodoItemNode[] {
    const convertToNodes = (items: any[]): TodoItemNode[] => {
      return items.map(item => {
        const node = new TodoItemNode();
        node.id = item.id ?? 0;
        node.item = item.categoryName ?? "";
        node.children = item.categories && item.categories.length > 0 
          ? convertToNodes(item.categories) 
          : [];
        return node;
      });
    };

    return convertToNodes(categories);
  }

  transformer = (node: TodoItemNode, level: number) => {
    const flatNode = new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.id = node.id;
    return flatNode;
  };

  getLevel = (node: TodoItemFlatNode) => node.level ?? 0;

  isExpandable = (node: TodoItemFlatNode) => node.expandable ?? false;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children ?? [];

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    this.updateSelectedCategories();
  }

  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.updateSelectedCategories();
  }

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.some(child => this.checklistSelection.isSelected(child)) && !this.descendantsAllSelected(node);
  }

  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  updateSelectedCategories(): void {
    const selectedIds = this.checklistSelection.selected.map(node => node.id);
    this.categoryControl.setValue(selectedIds);
  }

  displaySelectedCategories(): string {
    const selected = this.checklistSelection.selected.map(node => node.item);
    return selected.length > 0 ? selected.join(', ') : '';
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
