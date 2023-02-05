export class TableConfig {
  constructor(columns: Array<Column>) {
    this.columns = columns;
  }
  columns: Array<Column>;
}

export class Column {
  name: string
  alias: string
  type: string
  hidden?: boolean
  order?: number
  isSorted?: boolean
  sortOrder: number = 1

  constructor(name: string, alias: string, type: string = 'string', hidden?: boolean, order?: number, isSorted?: boolean, sortOrder: number = 1) {
    this.name = name
    this.alias = alias
    this.type = type
    this.hidden = hidden
    this.order = order
    this.isSorted = isSorted
    this.sortOrder = sortOrder
  }
}
