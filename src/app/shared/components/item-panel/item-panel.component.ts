import { Component, EventEmitter, Input, Output } from '@angular/core';

export type PanelItem<T = any> = T & {
  selected?: boolean;
};

export interface Panel<T = any> {
  showCheckBox?: boolean;
  title: Cell<T>;
  description: Cell<T>;
  status?: Cell<T>;
  content: Cell<T>[];
}

interface Cell<T> {
  name: keyof T;
  displayName?: string;
}

@Component({
  selector: 'app-item-panel',
  templateUrl: './item-panel.component.html',
  styleUrls: ['./item-panel.component.scss'],
})
export class ItemPanelComponent {
  @Input() public panelSettings!: Panel;
  @Input() public items!: PanelItem[];
  @Output() public checkSomeChange = new EventEmitter<boolean>();

  public updateCheck(isChecked: boolean, item: PanelItem): void {
    item.selected = isChecked;
    const selected = this.items.find((item) => item.selected);
    this.checkSomeChange.emit(!!selected);
  }
}
