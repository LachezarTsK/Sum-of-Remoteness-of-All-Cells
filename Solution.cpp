
#include <span>
#include <vector>
using namespace std;

class UnionFind {

    vector<int> parent;
    vector<int> rank;
    vector<long long>& sumValuesPerConnectedElements;

public:
    UnionFind(int numberOfElements, vector<long long>& sumValuesPerConnectedElements)
        : sumValuesPerConnectedElements{ sumValuesPerConnectedElements } {

        parent.resize(numberOfElements);
        // prior to C++20: iota(parent.begin(), parent.end(), 0);
        ranges::iota(parent, 0);
        rank.assign(numberOfElements, 1);
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
        }
        else {
            parent[first] = parent[second];
            rank[second] += rank[first];
            sumValuesPerConnectedElements[second] += sumValuesPerConnectedElements[first];
        }
    }
};


class Solution {

    static const int BLOCKED_POINT = -1;

    int rows{};
    int columns{};

public:
    long long sumRemoteness(const vector<vector<int>>& matrix) {
        rows = matrix.size();
        columns = matrix[0].size();

        vector<long long> sumValuesPerConnectedElements = createSumValuesPerConnectedElements(matrix);
        UnionFind unionFind(rows * columns, sumValuesPerConnectedElements);

        joinElementsConnectedWithPath(unionFind, matrix);
        return calculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements);
    }

private:
    vector<long long> createSumValuesPerConnectedElements(span<const vector<int>> matrix) const {
        vector<long long> sumValuesPerConnectedElements(rows * columns);

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

    long long calculateSumRemoteness(UnionFind& unionFind, span<const vector<int>> matrix, span<const long long> sumValuesPerConnectedElements) const {
        long long sumAllValuesInMatrix = calculateSumAllValuesInMatrix(matrix);
        long long sumRemoteness = 0;

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

    void joinElementsConnectedWithPath(UnionFind& unionFind, span<const vector<int>> matrix) const {
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

    int getIndexInFlattenedMatrix(int row, int column) const {
        return row * columns + column;
    }

    long long calculateSumAllValuesInMatrix(span<const vector<int>> matrix) const {
        long long sumAllValuesInMatrix = 0;

        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (matrix[r][c] != BLOCKED_POINT) {
                    sumAllValuesInMatrix += matrix[r][c];
                }
            }
        }
        return sumAllValuesInMatrix;
    }
};
