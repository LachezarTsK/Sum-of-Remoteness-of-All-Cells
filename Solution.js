
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var sumRemoteness = function (matrix) {
    this.BLOCKED_POINT = -1;
    this.rows = matrix.length;
    this.columns = matrix[0].length;

    const sumValuesPerConnectedElements = createSumValuesPerConnectedElements(matrix);
    const unionFind = new UnionFind(rows * columns, sumValuesPerConnectedElements);

    joinElementsConnectedWithPath(unionFind, matrix);
    return calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements);
};

/**
 * @param {number[][]} matrix
 * @return {number[]} sumValuesPerConnectedElements
 */
function createSumValuesPerConnectedElements(matrix) {
    const sumValuesPerConnectedElements = new Array(this.rows * this.columns);

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

/**
 * @param {UnionFind} unionFind
 * @param {number[][]} matrix
 * @param {number[]} sumValuesPerConnectedElements
 * @return {number}
 */
function calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements) {
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

/**
 * @param {UnionFind} unionFind
 * @param {number[][]} matrix
 * @return {void}
 */
function joinElementsConnectedWithPath(unionFind, matrix) {
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

/**
 * @param {number} row
 * @param {number} column
 * @return {number}
 */
function getIndexInFlattenedMatrix(row, column) {
    return row * this.columns + column;
}

/**
 * @param {number[][]} matrix
 * @return {number}
 */
function calculateSumAllValuesInMatrix(matrix) {
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

    #parent;
    #rank;
    #sumValuesPerConnectedElements;

    /**
     * @param {number} numberOfElements
     * @param {number[]}sumValuesPerConnectedElements
     */
    constructor(numberOfElements, sumValuesPerConnectedElements) {
        this.#parent = [...new Array(numberOfElements).keys()];
        this.#rank = new Array(numberOfElements).fill(1);
        this.#sumValuesPerConnectedElements = sumValuesPerConnectedElements;
    }

    /**
     * @param {number} index
     * @return {number}
     */
    findParent(index) {
        while (this.#parent[index] !== index) {
            index = this.#parent[this.#parent[index]];
        }
        return this.#parent[index];
    }

    /**
     * @param {number} indexOne
     * @param {number} indexTwo
     * @return {void}
     */
    joinByRank(indexOne, indexTwo) {
        const first = this.findParent(indexOne);
        const second = this.findParent(indexTwo);
        if (first === second) {
            return;
        }

        if (this.#rank[first] > this.#rank[second]) {
            this.#parent[second] = this.#parent[first];
            this.#rank[first] += this.#rank[second];
            this.#sumValuesPerConnectedElements [first] += this.#sumValuesPerConnectedElements [second];
        } else {
            this.#parent[first] = this.#parent[second];
            this.#rank[second] += this.#rank[first];
            this.#sumValuesPerConnectedElements [second] += this.#sumValuesPerConnectedElements [first];
        }
    }
}
