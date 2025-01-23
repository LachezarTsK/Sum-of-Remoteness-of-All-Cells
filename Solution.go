
package main

const BLOCKED_POINT = -1

var rows int
var columns int

func sumRemoteness(matrix [][]int) int64 {
    rows = len(matrix)
    columns = len(matrix[0])

    var sumValuesPerConnectedElements []int64 = createSumValuesPerConnectedElements(matrix)
    var unionFind = NewUnionFind(rows*columns, sumValuesPerConnectedElements)

    joinElementsConnectedWithPath(unionFind, matrix)

    return calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements)
}

func createSumValuesPerConnectedElements(matrix [][]int) []int64 {
    sumValuesPerConnectedElements := make([]int64, rows*columns)

    for r := range rows {
        for c := range columns {
            if matrix[r][c] != BLOCKED_POINT {
                index := getIndexInFlattenedMatrix(r, c)
                sumValuesPerConnectedElements[index] = int64(matrix[r][c])
            }
        }
    }
    return sumValuesPerConnectedElements
}

func calculateSumRemoteness(unionFind *UnionFind, matrix [][]int, sumValuesPerConnectedElements []int64) int64 {
    var sumAllValuesInMatrix int64 = calculateSumAllValuesInMatrix(matrix)
    var sumRemoteness int64 = 0

    for r := range rows {
        for c := range columns {
            if matrix[r][c] == BLOCKED_POINT {
                continue
            }
            index := getIndexInFlattenedMatrix(r, c)
            parent := unionFind.findParent(index)
            sumRemoteness += sumAllValuesInMatrix - sumValuesPerConnectedElements[parent]
        }
    }
    return sumRemoteness
}

func joinElementsConnectedWithPath(unionFind *UnionFind, matrix [][]int) {
    for r := range rows {
        for c := range columns {
            if matrix[r][c] == BLOCKED_POINT {
                continue
            }
            if r+1 < rows && matrix[r+1][c] != BLOCKED_POINT {
                firstIndex := getIndexInFlattenedMatrix(r, c)
                secondIndex := getIndexInFlattenedMatrix(r+1, c)
                unionFind.joinByRank(firstIndex, secondIndex)
            }
            if c+1 < columns && matrix[r][c+1] != BLOCKED_POINT {
                firstIndex := getIndexInFlattenedMatrix(r, c)
                secondIndex := getIndexInFlattenedMatrix(r, c+1)
                unionFind.joinByRank(firstIndex, secondIndex)
            }
        }
    }
}

func getIndexInFlattenedMatrix(row int, column int) int {
    return row*columns + column
}

func calculateSumAllValuesInMatrix(matrix [][]int) int64 {
    var sumAllValuesInMatrix int64 = 0

    for r := range rows {
        for c := range columns {
            if matrix[r][c] != BLOCKED_POINT {
                sumAllValuesInMatrix += int64(matrix[r][c])
            }
        }
    }
    return sumAllValuesInMatrix
}

type UnionFind struct {
    parent                        []int
    rank                          []int
    sumValuesPerConnectedElements []int64
}

func NewUnionFind(numberOfElements int, sumValuesPerConnectedElements []int64) *UnionFind {
    unionFind := &UnionFind{
        parent: make([]int, numberOfElements),
        rank:   make([]int, numberOfElements),
    }
    for i := 0; i < numberOfElements; i++ {
        unionFind.parent[i] = i
        unionFind.rank[i] = 1
    }
    unionFind.sumValuesPerConnectedElements = sumValuesPerConnectedElements
    return unionFind
}

func (this *UnionFind) findParent(index int) int {
    for this.parent[index] != index {
        index = this.parent[this.parent[index]]
    }
    return this.parent[index]
}

func (this *UnionFind) joinByRank(indexOne int, indexTwo int) {
    first := this.findParent(indexOne)
    second := this.findParent(indexTwo)
    if first == second {
        return
    }

    if this.rank[first] > this.rank[second] {
        this.parent[second] = this.parent[first]
        this.rank[first] += this.rank[second]
        this.sumValuesPerConnectedElements[first] += this.sumValuesPerConnectedElements[second]
    } else {
        this.parent[first] = this.parent[second]
        this.rank[second] += this.rank[first]
        this.sumValuesPerConnectedElements[second] += this.sumValuesPerConnectedElements[first]
    }
}
