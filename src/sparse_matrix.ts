class SparseMatrix {
    private row: number[] = [];
    private column: number[] = [];
    private value: number[] = [];

    getValue(row: number, column: number) {
        let rowCandidates = this.row.filter(r => r === row);
        let columnCandidates = this.column.filter(c => c === column);
    }

}

const m = [
    [0,0],
    [0,1],
];