import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

export interface TodoItem{
  id: number,
  name: string,
  isComplete: boolean
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  

  constructor(private http: HttpClient){}
  todoList : TodoItem [] = [];
  newName: string='';
  currentlyEditingValue: string = "";
  currentlyEditingId: number = -1;
  
  ngOnInit(): void {
    this.http.get<TodoItem[]>("http://localhost:5039/todoitems").subscribe(items => {if (items.length > 0) this.todoList = items})
  }

  cancelEdit(): void {
    this.currentlyEditingId = -1;
    this.currentlyEditingValue = '';
  }

  saveTodo(id: number): void {
    const todoIdx = this.todoList.findIndex(todo => todo.id === id);

  if (todoIdx === -1) {
    console.error('Todo not found!');
    return;
  }

  const updatedTodo = {
    ...this.todoList[todoIdx],
    name: this.currentlyEditingValue
  };

  this.http.put<void>(`http://localhost:5039/todoitems/${id}`, updatedTodo)
    .subscribe({
      next: () => {
        this.todoList[todoIdx] = updatedTodo;
        this.currentlyEditingId = -1;
        this.currentlyEditingValue = '';
      },
      error: (err) => {
        console.error('Failed to save todo:', err);
      }
    });
  }

  editTodo(id: number): void {
    const todo = this.todoList.find(todo => todo.id === id);
    if (todo) {
      this.currentlyEditingId = id;
      this.currentlyEditingValue = todo.name;
    }
  }
  
  addTodo(): void{ 
    if(this.newName.trim() !== ''){
      this.http
      .post<TodoItem>("http://localhost:5039/todoitems",{
        "name": this.newName,
        "isComplete": false
      }).subscribe(todo => {
        this.todoList.push(todo);
        this.newName = "";
      })
    }
  }

  completeTodo(id: number): void {
    let todoIdx = this.todoList.findIndex(todo => todo.id === id);

    if(todoIdx !== -1){
      let completedTodo = this.todoList[todoIdx];
      completedTodo.isComplete = true;
      this.http.put<TodoItem>(
        `http://localhost:5039/todoitems/${id}`,
        completedTodo
      ).subscribe(todo => {
        this.todoList[todoIdx] = completedTodo;
      })
    }
  }
  
  deleteTodo(id: number): void {
    this.http.delete(`http://localhost:5039/todoitems/${id}`).subscribe(() => console.log("Delete successfull"));
    this.todoList.splice(this.todoList.findIndex(todoItem => todoItem.id === id),1);
  }

  completeTodos(): TodoItem[] {
    return this.todoList.filter(todo => todo.isComplete)
  }


  incompleteTodos(): TodoItem[] {
    return this.todoList.filter(todo => !todo.isComplete)
  }
}
