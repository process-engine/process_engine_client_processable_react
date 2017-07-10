export interface IColumnSchema {
    name: string;
    thcProps: {
        hidden?: boolean;
        dataField: string;
        isKey: boolean;
    };
    searchable: boolean;
    searchableType?: string;
}
