
class Solution {

    private companion object {
        const val BLOCKED_POINT = -1
    }

    private var rows: Int = 0
    private var columns: Int = 0

    fun sumRemoteness(matrix: Array<IntArray>): Long {
        rows = matrix.size
        columns = matrix[0].size

        val sumValuesPerConnectedElements: LongArray = createSumValuesPerConnectedElements(matrix)
        val unionFind = UnionFind(rows * columns, sumValuesPerConnectedElements)

        joinElementsConnectedWithPath(unionFind, matrix)
        return calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements)
    }

    private fun createSumValuesPerConnectedElements(matrix: Array<IntArray>): LongArray {
        val sumValuesPerConnectedElements = LongArray(rows * columns)

        for (r in 0..<rows) {
            for (c in 0..<columns) {
                if (matrix[r][c] != BLOCKED_POINT) {
                    val index = getIndexInFlattenedMatrix(r, c)
                    sumValuesPerConnectedElements[index] = matrix[r][c].toLong()
                }
            }
        }
        return sumValuesPerConnectedElements
    }

    private fun calculateSumRemoteness(unionFind: UnionFind, matrix: Array<IntArray>, sumValuesPerConnectedElements: LongArray): Long {
        val sumAllValuesInMatrix: Long = calculateSumAllValuesInMatrix(matrix)
        var sumRemoteness: Long = 0

        for (r in 0..<rows) {
            for (c in 0..<columns) {
                if (matrix[r][c] == BLOCKED_POINT) {
                    continue
                }
                val index = getIndexInFlattenedMatrix(r, c)
                val parent = unionFind.findParent(index)
                sumRemoteness += sumAllValuesInMatrix - sumValuesPerConnectedElements[parent]
            }
        }
        return sumRemoteness
    }

    private fun joinElementsConnectedWithPath(unionFind: UnionFind, matrix: Array<IntArray>): Unit {
        for (r in 0..<rows) {
            for (c in 0..<columns) {
                if (matrix[r][c] == BLOCKED_POINT) {
                    continue
                }
                if (r + 1 < rows && matrix[r + 1][c] != BLOCKED_POINT) {
                    val firstIndex = getIndexInFlattenedMatrix(r, c)
                    val secondIndex = getIndexInFlattenedMatrix(r + 1, c)
                    unionFind.joinByRank(firstIndex, secondIndex)
                }
                if (c + 1 < columns && matrix[r][c + 1] != BLOCKED_POINT) {
                    val firstIndex = getIndexInFlattenedMatrix(r, c)
                    val secondIndex = getIndexInFlattenedMatrix(r, c + 1)
                    unionFind.joinByRank(firstIndex, secondIndex)
                }
            }
        }
    }

    private fun getIndexInFlattenedMatrix(row: Int, column: Int): Int {
        return row * columns + column
    }

    private fun calculateSumAllValuesInMatrix(matrix: Array<IntArray>): Long {
        var sumAllValuesInMatrix: Long = 0

        for (r in 0..<rows) {
            for (c in 0..<columns) {
                if (matrix[r][c] != BLOCKED_POINT) {
                    sumAllValuesInMatrix += matrix[r][c]
                }
            }
        }
        return sumAllValuesInMatrix
    }
}

class UnionFind(private val numberOfElements: Int, private var sumValuesPerConnectedElements: LongArray) {

    private val parent = IntArray(numberOfElements) { i -> i }
    private val rank = IntArray(numberOfElements) { 1 }


    fun findParent(index: Int): Int {
        var index = index
        while (parent[index] != index) {
            index = parent[parent[index]]
        }
        return parent[index]
    }

    fun joinByRank(indexOne: Int, indexTwo: Int): Unit {
        val first = findParent(indexOne)
        val second = findParent(indexTwo)
        if (first == second) {
            return
        }

        if (rank[first] > rank[second]) {
            parent[second] = parent[first]
            rank[first] += rank[second]
            sumValuesPerConnectedElements[first] += sumValuesPerConnectedElements[second]
        } else {
            parent[first] = parent[second]
            rank[second] += rank[first]
            sumValuesPerConnectedElements[second] += sumValuesPerConnectedElements[first]
        }
    }
}
