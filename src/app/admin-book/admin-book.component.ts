import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Book } from '../model/Book';
import { ElectrolibService } from '../electrolib.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-book',
  templateUrl: './admin-book.component.html',
  styleUrls: ['./admin-book.component.css']
})
export class AdminBookComponent {

  createBookVisible = false;
  detailsBookVisible = false;
  modifyBookVisible = false;

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
