import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/app/models/message.model';
import { TableConfig } from 'src/app/models/table-config.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  constructor(private modalService: NgbModal) { }
  @Input() data: Message | undefined
  @Input() isActive: boolean | undefined = false
  @Input() tableConfig: TableConfig | undefined
  @Output() onDelete = new EventEmitter()
  @Output() onClick = new EventEmitter<Message>()

  isDeleteButtonHidden: boolean = true;


  onDeleteButtonClick(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      if (res === 'OK') {
        this.onDelete.emit()
      } else if (res === 'Cancel') {
      }
    }, (res) => {

    });
  }
  onCellClick() {
    this.onClick.emit(this.data)
  }

  onCellHover() {
    this.isDeleteButtonHidden = false
  }

  onCellLeave() {
    this.isDeleteButtonHidden = true
  }

  getProperty(object: any, prop: string) {
    if (prop === 'datetime')
      return object?.datetime?.replaceAll('-', '.')
    if (prop === 'message')
      return this.limitText(object.message, 100)
    return object[prop]
  }

  limitText(text: string, limit: number) {
    let options = {
      ending: '...'  // что дописать после обрыва
      , trim: true     // обрезать пробелы в начале/конце?
      , words: true    // уважать ли целостность слов? 
    }
      , lastSpace
      ;

    // убрать пробелы в начале /конце
    if (options.trim) text = text.trim();

    if (text.length <= limit) return text;    // по длине вписываемся и так

    text = text.slice(0, limit); // тупо отрезать по лимиту
    lastSpace = text.lastIndexOf(" ");
    if (options.words && lastSpace > 0) {  // урезать ещё до границы целого слова
      text = text.substring(0, lastSpace);
    }
    return text + options.ending;
  }
}