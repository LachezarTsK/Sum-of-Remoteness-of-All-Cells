
using System;
using System.Linq;

public class Solution
{
    private static readonly int BLOCKED_POINT = -1;

    private int rows;
    private int columns;

    public long SumRemoteness(int[][] matrix)
    {
        rows = matrix.Length;
        columns = matrix[0].Length;

        long[] sumValuesPerConnectedElements = CreateSumValuesPerConnectedElements(matrix);
        UnionFind unionFind = new UnionFind(rows * columns, sumValuesPerConnectedElements);

        JoinElementsConnectedWithPath(unionFind, matrix);
        return CalculateSumRemoteness(unionFind, matrix, sumValuesPerConnectedElements);
    }

    private long[] CreateSumValuesPerConnectedElements(int[][] matrix)
    {
        long[] sumValuesPerConnectedElements = new long[rows * columns];

        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (matrix[r][c] != BLOCKED_POINT)
                {
                    int index = GetIndexInFlattenedMatrix(r, c);
                    sumValuesPerConnectedElements[index] = matrix[r][c];
                }
            }
        }
        return sumValuesPerConnectedElements;
    }

    private long CalculateSumRemoteness(UnionFind unionFind, int[][] matrix, long[] sumValuesPerConnectedElements)
    {
        long sumAllValuesInMatrix = CalculateSumAllValuesInMatrix(matrix);
        long sumRemoteness = 0;

        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (matrix[r][c] == BLOCKED_POINT)
                {
                    continue;
                }
                int index = GetIndexInFlattenedMatrix(r, c);
                int parent = unionFind.FindParent(index);
                sumRemoteness += sumAllValuesInMatrix - sumValuesPerConnectedElements[parent];
            }
        }
        return sumRemoteness;
    }

    private void JoinElementsConnectedWithPath(UnionFind unionFind, int[][] matrix)
    {
        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (matrix[r][c] == BLOCKED_POINT)
                {
                    continue;
                }
                if (r + 1 < rows && matrix[r + 1][c] != BLOCKED_POINT)
                {
                    int firstIndex = GetIndexInFlattenedMatrix(r, c);
                    int secondIndex = GetIndexInFlattenedMatrix(r + 1, c);
                    unionFind.JoinByRank(firstIndex, secondIndex);
                }
                if (c + 1 < columns && matrix[r][c + 1] != BLOCKED_POINT)
                {
                    int firstIndex = GetIndexInFlattenedMatrix(r, c);
                    int secondIndex = GetIndexInFlattenedMatrix(r, c + 1);
                    unionFind.JoinByRank(firstIndex, secondIndex);
                }
            }
        }
    }

    private int GetIndexInFlattenedMatrix(int row, int column)
    {
        return row * columns + column;
    }

    private long CalculateSumAllValuesInMatrix(int[][] matrix)
    {
        long sumAllValuesInMatrix = 0;

        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (matrix[r][c] != BLOCKED_POINT)
                {
                    sumAllValuesInMatrix += matrix[r][c];
                }
            }
        }
        return sumAllValuesInMatrix;
    }
}

class UnionFind
{

    private readonly int[] parent;
    private readonly int[] rank;
    private readonly long[] sumValuesPerConnectedElements;

    public UnionFind(int numberOfElements, long[] sumValuesPerConnectedElements)
    {
        parent = Enumerable.Range(0, numberOfElements).ToArray();
        rank = new int[numberOfElements];
        Array.Fill(rank, 1);
        this.sumValuesPerConnectedElements = sumValuesPerConnectedElements;
    }

    public int FindParent(int index)
    {
        while (parent[index] != index)
        {
            index = parent[parent[index]];
        }
        return parent[index];
    }

    public void JoinByRank(int indexOne, int indexTwo)
    {
        int first = FindParent(indexOne);
        int second = FindParent(indexTwo);
        if (first == second)
        {
            return;
        }

        if (rank[first] > rank[second])
        {
            parent[second] = parent[first];
            rank[first] += rank[second];
            sumValuesPerConnectedElements[first] += sumValuesPerConnectedElements[second];
        }
        else
        {
            parent[first] = parent[second];
            rank[second] += rank[first];
            sumValuesPerConnectedElements[second] += sumValuesPerConnectedElements[first];
        }
    }
}
