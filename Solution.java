
import java.util.Arrays;
import java.util.stream.IntStream;

public class Solution {

    private static final int BLOCKED_POINT = -1;

    private int rows;
    private int columns;

    public long sumRemoteness(int[][] matrix) {
        rows = matrix.length;
        columns = matrix[0].length;

        long[] sumValuesPerConnectedElements = createSumValuesPerConnectedElements(matrix);
        UnionFind unionFind = new UnionFind(rows * columns, sumValuesPerConnectedElements);

        joinElementsConnectedWithPath(unionFind, matrix);
        return calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements);
    }

    private long[] createSumValuesPerConnectedElements(int[][] matrix) {
        long[] sumValuesPerConnectedElements = new long[rows * columns];

        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (matrix[r][c] != BLOCKED_POINT) {
                    int index = getIndexInFlattenedMatrix(r, c);
                    sumValuesPerConnectedElements[index] = matrix[r][c];
                }
            }
        }
        return sumValuesPerConnectedElements;
    }

    private long calculateSumRemoteness(UnionFind unionFind, int[][] matrix, long[] sumValuesPerConnectedElements) {
        long sumAllValuesInMatrix = calculateSumAllValuesInMatrix(matrix);
        long sumRemoteness = 0;

        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (matrix[r][c] == BLOCKED_POINT) {
                    continue;
                }
                int index = getIndexInFlattenedMatrix(r, c);
                int parent = unionFind.findParent(index);
                sumRemoteness += sumAllValuesInMatrix - sumValuesPerConnectedElements[parent];
            }
        }
        return sumRemoteness;
    }

    private void joinElementsConnectedWithPath(UnionFind unionFind, int[][] matrix) {
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (matrix[r][c] == BLOCKED_POINT) {
                    continue;
                }
                if (r + 1 < rows && matrix[r + 1][c] != BLOCKED_POINT) {
                    int firstIndex = getIndexInFlattenedMatrix(r, c);
                    int secondIndex = getIndexInFlattenedMatrix(r + 1, c);
                    unionFind.joinByRank(firstIndex, secondIndex);
                }
                if (c + 1 < columns && matrix[r][c + 1] != BLOCKED_POINT) {
                    int firstIndex = getIndexInFlattenedMatrix(r, c);
                    int secondIndex = getIndexInFlattenedMatrix(r, c + 1);
                    unionFind.joinByRank(firstIndex, secondIndex);
                }
            }
        }
    }

    private int getIndexInFlattenedMatrix(int row, int column) {
        return row * columns + column;
    }

    private long calculateSumAllValuesInMatrix(int[][] matrix) {
        long sumAllValuesInMatrix = 0;

        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (matrix[r][c] != BLOCKED_POINT) {
                    sumAllValuesInMatrix += matrix[r][c];
                }
            }
        }
        return sumAllValuesInMatrix;
    }
}

class UnionFind {

    private final int[] parent;
    private final int[] rank;
    private final long[] sumValuesPerConnectedElements;

    UnionFind(int numberOfElements, long[] sumValuesPerConnectedElements) {
        parent = IntStream.range(0, numberOfElements).toArray();
        rank = new int[numberOfElements];
        Arrays.fill(rank, 1);
        this.sumValuesPerConnectedElements = sumValuesPerConnectedElements;
    }

    int findParent(int index) {
        while (parent[index] != index) {
            index = parent[parent[index]];
        }
        return parent[index];
    }

    void joinByRank(int indexOne, int indexTwo) {
        int first = findParent(indexOne);
        int second = findParent(indexTwo);
        if (first == second) {
            return;
        }

        if (rank[first] > rank[second]) {
            parent[second] = parent[first];
            rank[first] += rank[second];
            sumValuesPerConnectedElements[first] += sumValuesPerConnectedElements[second];
        } else {
            parent[first] = parent[second];
            rank[second] += rank[first];
            sumValuesPerConnectedElements[second] += sumValuesPerConnectedElements[first];
        }
    }
}
