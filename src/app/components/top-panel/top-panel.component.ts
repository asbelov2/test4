import { Component, EventEmitter, Output } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent {
  nickname: string = ''
  message: string = ''
  searchText: string = ''
  date!: NgbDateStruct
  time!: NgbTimeStruct
  @Output() onSave = new EventEmitter<Message>()
  @Output() onSearch = new EventEmitter<string>()

  constructor(private modalService: NgbModal, private http: HttpClient) { }

  triggerModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      if (res === 'Save') {
        this.saveMessage(new Message(this.nickname, `${String(this.date.day).padStart(2, '0')}-${String(this.date.month).padStart(2, '0')}-${this.date.year} ${String(this.time.hour).padStart(2, '0')}:${String(this.time.minute).padStart(2, '0')}:${String(this.time.second).padStart(2, '0')}`, this.message))
      } else if (res === 'Cancel') {

      }
    }, (res) => {

    });
  }

  saveMessage(data: Message) {
    this.http.post('http://localhost:3000/messages', data).subscribe(() => {
      this.onSave.emit(data)
    })
  }

  search() {
    this.onSearch.emit(this.searchText)
  }

}
