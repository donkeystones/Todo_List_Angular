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
  imports: [RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  

  constructor(private http: HttpClient){}
  todoList : TodoItem [] = [];
  completedTodos : TodoItem [] = [];
  newName: string='';
  
  ngOnInit(): void {
    this.http.get<TodoItem[]>("http://localhost:5039/todoitems").subscribe(items => {if (items.length > 0) this.todoList = items})
    this.http.get<TodoItem[]>("http://localhost:5039/todoitems/complete").subscribe(items => {if (items.length > 0) this.completedTodos = items})
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
    let completeTodo = this.todoList.find(todo => todo.id === id);

    if(completeTodo !== undefined){
      completeTodo.isComplete = true;
    this.http.put<TodoItem>(
      `http://localhost:5039/todoitems/${id}`,
      completeTodo
    ).subscribe(todo => {
      this.completedTodos.push(completeTodo);
      this.todoList.splice(this.todoList.findIndex(todoItem => todoItem.id === id),1);
    })
    }
  }
  
  deleteTodo(id: number): void {
    this.http.delete(`http://localhost:5039/todoitems/${id}`).subscribe(() => console.log("Delete successfull"));
    this.todoList.splice(this.todoList.findIndex(todoItem => todoItem.id === id),1);
  }

  deleteCompletedTodo(id: number): void {
    this.http.delete(`http://localhost:5039/todoitems/${id}`).subscribe(() => console.log("Delete successfull"));
    this.completedTodos.splice(this.completedTodos.findIndex(todoItem => todoItem.id === id),1);
  }
}
