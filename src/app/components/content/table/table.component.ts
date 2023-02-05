import { ChangeDetectorRef, Component, ComponentRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from 'src/app/models/message.model';
import { Column, TableConfig } from 'src/app/models/table-config.model';
import { CookieService } from 'src/app/services/cookie.service';
import { CellComponent } from './cell/cell.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @ViewChild('cellContainer', { read: ViewContainerRef, static: false }) cells: ViewContainerRef | undefined
  _messages: Array<Message> = []
  @Input()
  set messages(collection: Array<Message>) {
    this._messages = collection
    this.tableConfig.columns.forEach(column => {
      if (column.isSorted) {
        if (column.type === 'number') {
          this._messages.sort((a: any, b: any) => column?.sortOrder * (a[column.alias] - b[column.alias]))
        } else if (column.type === 'string') {
          this._messages.sort((a: any, b: any) => (a[column.alias] < b[column.alias]) ? column?.sortOrder : ((a[column.alias] > b[column.alias]) ? -column?.sortOrder : 0))
        }
      }
    })
    this.cells?.clear()
    for (let i = (this.page - 1) * this.itemsPerPage; i < this.page * this.itemsPerPage; i++) {
      if (this.messages[i])
        this.addCell(this.messages[i])
    }
  }
  get messages() {
    return this._messages
  }
  @Input() activeCellId: number | undefined
  @Output() onCellDelete = new EventEmitter<ComponentRef<CellComponent>>()
  @Output() onCellClick = new EventEmitter<ComponentRef<CellComponent>>()
  @Output() updateData = new EventEmitter()

  constructor(private http: HttpClient, private cookieService: CookieService, private cdr: ChangeDetectorRef) {
    this.tableConfig.columns.sort((a, b) => (a.order as number - 0) - (b.order as number - 0))
    this.page = cookieService.getCookie('tablepage') as unknown as number
    if (!this.page)
      this.page = 1
  }

  page: number = 1
  itemsPerPage: number = 9
  tableConfig: TableConfig = {
    columns: [
      new Column('ID', 'id', 'number', false, 1, true, 1),
      new Column('Ник', 'username', 'string', false, 2, false, -1),
      new Column('Сообщение', 'message', 'string', false, 3, false),
      new Column('Дата и время', 'datetime', 'string', false, 4, false)
    ]
  }

  addCell(message: Message) {
    const componentRef = this.cells?.createComponent(CellComponent)
    if (componentRef?.instance) {
      componentRef?.setInput('data', message)
      componentRef?.setInput('tableConfig', this.tableConfig)
      componentRef?.instance.onDelete.subscribe(() => {
        this.onCellDelete.emit(componentRef)
      })
      componentRef?.instance.onClick.subscribe(() => {
        this.onCellClick.emit(componentRef)
      })
      componentRef.changeDetectorRef.detectChanges()
    }

    this.cdr.detectChanges()
  }

  pChange(e: any) {
    this.page = e
    this.cookieService.setCookie({ name: 'tablepage', value: this.page, session: true })
    this.cells?.clear()
    for (let i = (this.page - 1) * this.itemsPerPage; i < this.page * this.itemsPerPage; i++) {
      if (this.messages[i])
        this.addCell(this.messages[i])
    }
  }

  onHeaderClick(alias: string) {
    let tmpColumn = this.tableConfig.columns.find(column => column.alias === alias)
    this.tableConfig.columns.forEach(column => {
      if (column.alias === alias) {
        if (tmpColumn?.isSorted && tmpColumn.sortOrder === -1) {
          tmpColumn.isSorted = false
          tmpColumn.sortOrder = 1
        } else if (tmpColumn?.isSorted && tmpColumn.sortOrder === 1) {
          tmpColumn.sortOrder = -1
        } else if (tmpColumn) {
          tmpColumn.isSorted = true
          tmpColumn.sortOrder = 1
        }
      }
    })
    this.updateData.emit()
    console.log(this.tableConfig)
  }
}