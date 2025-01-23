
function sumRemoteness(matrix: number[][]): number {
    this.BLOCKED_POINT = -1;
    this.rows = matrix.length;
    this.columns = matrix[0].length;

    const sumValuesPerConnectedElements = createSumValuesPerConnectedElements(matrix);
    const unionFind = new UnionFind(this.rows * this.columns, sumValuesPerConnectedElements);

    joinElementsConnectedWithPath(unionFind, matrix);
    return calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements);
};

function createSumValuesPerConnectedElements(matrix: number[][]): number[] {
    const sumValuesPerConnectedElements: number[] = new Array(this.rows * this.columns);

    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (matrix[r][c] !== this.BLOCKED_POINT) {
                const index = getIndexInFlattenedMatrix(r, c);
                sumValuesPerConnectedElements[index] = matrix[r][c];
            }
        }
    }
    return sumValuesPerConnectedElements;
}

function calculateSumRemoteness(unionFind: UnionFind, matrix: number[][], sumValuesPerConnectedElements: number[]): number {
    const sumAllValuesInMatrix = calculateSumAllValuesInMatrix(matrix);
    let sumRemoteness = 0;

    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (matrix[r][c] === this.BLOCKED_POINT) {
                continue;
            }
            const index = getIndexInFlattenedMatrix(r, c);
            const parent = unionFind.findParent(index);
            sumRemoteness += sumAllValuesInMatrix - sumValuesPerConnectedElements[parent];
        }
    }
    return sumRemoteness;
}

function joinElementsConnectedWithPath(unionFind: UnionFind, matrix: number[][]): void {
    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (matrix[r][c] === this.BLOCKED_POINT) {
                continue;
            }
            if (r + 1 < this.rows && matrix[r + 1][c] !== this.BLOCKED_POINT) {
                const firstIndex = getIndexInFlattenedMatrix(r, c);
                const secondIndex = getIndexInFlattenedMatrix(r + 1, c);
                unionFind.joinByRank(firstIndex, secondIndex);
            }
            if (c + 1 < this.columns && matrix[r][c + 1] !== this.BLOCKED_POINT) {
                const firstIndex = getIndexInFlattenedMatrix(r, c);
                const secondIndex = getIndexInFlattenedMatrix(r, c + 1);
                unionFind.joinByRank(firstIndex, secondIndex);
            }
        }
    }
}

function getIndexInFlattenedMatrix(row: number, column: number): number {
    return row * this.columns + column;
}

function calculateSumAllValuesInMatrix(matrix: number[][]): number {
    let sumAllValuesInMatrix = 0;

    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (matrix[r][c] !== this.BLOCKED_POINT) {
                sumAllValuesInMatrix += matrix[r][c];
            }
        }
    }
    return sumAllValuesInMatrix;
}

class UnionFind {

    private parent: number[];
    private rank: number[];
    private sumValuesPerConnectedElements: number[];

    constructor(numberOfElements: number, sumValuesPerConnectedElements: number[]) {
        this.parent = [...new Array(numberOfElements).keys()];
        this.rank = new Array(numberOfElements).fill(1);
        this.sumValuesPerConnectedElements = sumValuesPerConnectedElements;
    }


    findParent(index: number): number {
        while (this.parent[index] !== index) {
            index = this.parent[this.parent[index]];
        }
        return this.parent[index];
    }

    joinByRank(indexOne: number, indexTwo: number): void {
        const first = this.findParent(indexOne);
        const second = this.findParent(indexTwo);
        if (first === second) {
            return;
        }

        if (this.rank[first] > this.rank[second]) {
            this.parent[second] = this.parent[first];
            this.rank[first] += this.rank[second];
            this.sumValuesPerConnectedElements[first] += this.sumValuesPerConnectedElements[second];
        } else {
            this.parent[first] = this.parent[second];
            this.rank[second] += this.rank[first];
            this.sumValuesPerConnectedElements[second] += this.sumValuesPerConnectedElements[first];
        }
    }
}
