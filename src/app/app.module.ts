import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { HeaderComponent } from './components/content/header/header.component';
import { TableComponent } from './components/content/table/table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { CellComponent } from './components/content/table/cell/cell.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TopPanelComponent,
    SidePanelComponent,
    HeaderComponent,
    TableComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxPaginationModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
