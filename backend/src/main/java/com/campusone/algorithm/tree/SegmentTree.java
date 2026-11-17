package com.campusone.algorithm.tree;

/**
 * Segment Tree with Lazy Propagation (Unit 3 - Trees & Range Queries).
 *
 * Models room interval availability across discrete academic timetable slots [1 ... S].
 * Supports O(log S) range occupancy queries and O(log S) interval updates via lazy propagation.
 *
 * Space Complexity: O(S) tree nodes (represented in flat array of size 4 * S).
 */
public class SegmentTree {

    private final int totalSlots;
    private final int[] treeBusyCount;
    private final Boolean[] lazyTag; // null = no pending tag, TRUE = mark all occupied, FALSE = mark all free

    public SegmentTree(int totalSlots) {
        if (totalSlots <= 0) {
            throw new IllegalArgumentException("Total slots must be strictly positive");
        }
        this.totalSlots = totalSlots;
        int treeSize = 4 * totalSlots + 1;
        this.treeBusyCount = new int[treeSize];
        this.lazyTag = new Boolean[treeSize];
    }

    public int getTotalSlots() {
        return totalSlots;
    }

    /**
     * Checks if all slots in the interval [queryLeft, queryRight] are completely free.
     * Time Complexity: O(log S)
     */
    public boolean isIntervalFree(int queryLeft, int queryRight) {
        validateBounds(queryLeft, queryRight);
        return queryOccupiedCount(1, 1, totalSlots, queryLeft, queryRight) == 0;
    }

    /**
     * Returns the count of occupied slots within the interval [queryLeft, queryRight].
     * Time Complexity: O(log S)
     */
    public int queryOccupiedCount(int queryLeft, int queryRight) {
        validateBounds(queryLeft, queryRight);
        return queryOccupiedCount(1, 1, totalSlots, queryLeft, queryRight);
    }

    private int queryOccupiedCount(int node, int segLeft, int segRight, int qLeft, int qRight) {
        if (qLeft <= segLeft && segRight <= qRight) {
            return treeBusyCount[node];
        }

        pushDown(node, segLeft, segRight);

        int mid = segLeft + (segRight - segLeft) / 2;
        int sum = 0;

        if (qLeft <= mid) {
            sum += queryOccupiedCount(2 * node, segLeft, mid, qLeft, qRight);
        }
        if (qRight > mid) {
            sum += queryOccupiedCount(2 * node + 1, mid + 1, segRight, qLeft, qRight);
        }

        return sum;
    }

    /**
     * Updates an entire interval of slots [updateLeft, updateRight] to occupied (true) or free (false).
     * Time Complexity: O(log S) achieved strictly via Lazy Propagation.
     */
    public void updateRange(int updateLeft, int updateRight, boolean occupy) {
        validateBounds(updateLeft, updateRight);
        updateRange(1, 1, totalSlots, updateLeft, updateRight, occupy);
    }

    private void updateRange(int node, int segLeft, int segRight, int uLeft, int uRight, boolean occupy) {
        // Complete overlap with current segment
        if (uLeft <= segLeft && segRight <= uRight) {
            applyTag(node, segLeft, segRight, occupy);
            return;
        }

        pushDown(node, segLeft, segRight);

        int mid = segLeft + (segRight - segLeft) / 2;
        if (uLeft <= mid) {
            updateRange(2 * node, segLeft, mid, uLeft, uRight, occupy);
        }
        if (uRight > mid) {
            updateRange(2 * node + 1, mid + 1, segRight, uLeft, uRight, occupy);
        }

        treeBusyCount[node] = treeBusyCount[2 * node] + treeBusyCount[2 * node + 1];
    }

    /**
     * Propagates deferred lazy tags to child nodes.
     */
    private void pushDown(int node, int segLeft, int segRight) {
        if (lazyTag[node] != null && segLeft != segRight) {
            int mid = segLeft + (segRight - segLeft) / 2;
            applyTag(2 * node, segLeft, mid, lazyTag[node]);
            applyTag(2 * node + 1, mid + 1, segRight, lazyTag[node]);
            lazyTag[node] = null;
        }
    }

    private void applyTag(int node, int segLeft, int segRight, boolean occupy) {
        treeBusyCount[node] = occupy ? (segRight - segLeft + 1) : 0;
        lazyTag[node] = occupy;
    }

    private void validateBounds(int left, int right) {
        if (left < 1 || right > totalSlots || left > right) {
            throw new IllegalArgumentException(String.format("Invalid range [%d, %d] for total slots %d", left, right, totalSlots));
        }
    }
}

