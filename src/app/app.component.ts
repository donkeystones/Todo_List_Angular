import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Item } from './item';
import { ItemComponent } from './item/item.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, ItemComponent],
})
export class AppComponent {
  componentTitle = "My To Do List";

  filter: "all" | "active" | "done" = "all";

  allItems = [
    { description: "eat", done: false, urgent: false },
    { description: "sleep", done: false, urgent: false },
    { description: "code", done: false, urgent: false },
    { description: "repeat", done: false, urgent: true },
  ]

  get items() {
    if(this.filter === "all") {
      return this.allItems;
    }
    return this.allItems.filter((item) => 
      this.filter === "done" ? item.done : !item.done
    );
  }

  addItem(description : string){
    if(!description) return;

    this.allItems.unshift({
      description,
      done: false,
      urgent: false
    });
  }

  remove(item: Item) {
    this.allItems.splice(this.allItems.indexOf(item), 1);
  }


}