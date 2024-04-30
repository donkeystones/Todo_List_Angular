import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule]
})
export class AppComponent {
  componentTitle = "My To Do List";

  filter: "all" | "active" | "done" = "all";

  allItems = [
    { description: "eat", done: false },
    { description: "sleep", done: false },
    { description: "code", done: false },
    { description: "repeat", done: false },
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
      done: false
    });
  }
}