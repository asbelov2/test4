import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ComponentRef } from '@angular/core';
import { CellComponent } from './components/content/table/cell/cell.component';
import { Message } from './models/message.model';
import { CookieService } from './services/cookie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient, private cookieService: CookieService, private cdr: ChangeDetectorRef) {
    this.activeCellId = (cookieService.getCookie('activecell') as unknown as number) - 0
    http.get('http://localhost:3000/messages').subscribe(data => {
      this.collection = data as Array<Message>
      if (!!this.activeCellId)
        this.activeCellData = this.collection.find(item => item.id === this.activeCellId)
    })
  }

  collection: Array<Message> = []
  activeCellId: number | undefined
  activeCellData: Message | undefined
  activeCellRef: ComponentRef<CellComponent> | undefined
  title = 'test';

  onSave(data: Message) {
    this.http.get('http://localhost:3000/messages').subscribe(data => {
      this.collection = data as Array<Message>
      this.cdr.detectChanges()
    })
  }

  onCellDelete(cell: ComponentRef<CellComponent>) {
    this.http.delete('http://localhost:3000/messages/' + cell.instance.data?.id).subscribe(
      () => {
        this.http.get('http://localhost:3000/messages').subscribe(data => {
          this.collection = data as Array<Message>
          this.cdr.detectChanges()
        })
      }
    )
  }

  onCellClick(cell: ComponentRef<CellComponent>) {
    if (this.activeCellRef)
      this.activeCellRef.instance.isActive = false
    this.activeCellRef = cell
    this.activeCellId = cell.instance.data?.id
    this.activeCellData = cell.instance.data
    cell.instance.isActive = true;
    this.cookieService.setCookie({ name: 'activecell', value: this.activeCellId, session: true })
    this.cdr.detectChanges()
  }

  onSidepanelUpdate() {
    this.http.get('http://localhost:3000/messages').subscribe(data => {
      this.collection = data as Array<Message>
      this.cdr.detectChanges()
    })
  }

  onSearch(searchText: string) {
    this.http.get(`http://localhost:3000/messages?q=${searchText}`).subscribe(data => {
      this.collection = data as Array<Message>
      this.cdr.detectChanges()
    })
  }

  updateData() {
    this.http.get('http://localhost:3000/messages').subscribe(data => {
      this.collection = data as Array<Message>
      this.cdr.detectChanges()
    })
  }
}
