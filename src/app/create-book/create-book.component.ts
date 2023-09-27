import { Component } from '@angular/core';
import { Book } from '../model/Book';
import { ElectrolibService } from '../electrolib.service';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent {

  book: Book = new Book();

  constructor(private electrolibService: ElectrolibService) { }

  onSubmit() {
    this.electrolibService.createBook(this.book).subscribe(
      createdBook => {
        console.log(createdBook);
      }
    )
  }

}
