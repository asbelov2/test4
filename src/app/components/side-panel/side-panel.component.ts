import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnChanges {
  @Input() data: Message | undefined
  @Output() onUpdate = new EventEmitter()
  dataStructure: Array<any> | undefined
  nickname: string = ''
  message: string = ''
  date!: NgbDateStruct
  time!: NgbTimeStruct
  constructor(private modalService: NgbModal, private http: HttpClient) { }

  triggerModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      if (res === 'Save') {
        if (this.data) {
          this.data.username = this.nickname
          this.data.message = this.message
          this.data.datetime = `${String(this.date.day).padStart(2, '0')}-${String(this.date.month).padStart(2, '0')}-${this.date.year} ${String(this.time.hour).padStart(2, '0')}:${String(this.time.minute).padStart(2, '0')}:${String(this.time.second).padStart(2, '0')}`
        }
        this.uppdateMessage(this.data as Message)
      } else if (res === 'Cancel') {
      }
    }, (res) => {

    });
  }

  uppdateMessage(data: Message) {
    this.http.put('http://localhost:3000/messages/' + data.id, data).subscribe(() => {
      this.onUpdate.emit(data)
    })
  }


  ngOnChanges() {
    if (this.data) {
      this.dataStructure = Object.entries(this.data as Object)
      this.nickname = this.data.username
      this.message = this.data.message
      // example "datetime": "04-02-2023 21:51:37",
      const tmpDate = this.data.datetime.split(' ')[0]
      const tmpTime = this.data.datetime.split(' ')[1]
      this.date = { year: (tmpDate.split('-')[2] as unknown as number) - 0, month: (tmpDate.split('-')[1] as unknown as number) - 0, day: (tmpDate.split('-')[0] as unknown as number) - 0 }
      this.time = { hour: (tmpTime.split(':')[0] as unknown as number) - 0, minute: (tmpTime.split(':')[1] as unknown as number) - 0, second: (tmpTime.split(':')[2] as unknown as number) - 0 }
    }
  }
}
