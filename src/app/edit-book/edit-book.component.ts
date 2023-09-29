import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../model/Book';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent {

  book: Book = new Book();

  constructor(private electrolibService: ElectrolibService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(id);
    if(id) {
     this.electrolibService.getBook(id).subscribe(book =>{
      this.book = book;
      console.log(this.book);
     });
    }
  }
}
