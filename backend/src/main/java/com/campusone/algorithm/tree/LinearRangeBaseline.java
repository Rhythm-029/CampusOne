package com.campusone.algorithm.tree;

/**
 * Linear Scan Baseline for Interval Availability Queries.
 *
 * Maintains a flat boolean array of slot states [1 ... S].
 * Range queries and interval updates require O(S) linear traversal.
 *
 * Used as an empirical baseline to measure where Segment Trees achieve
 * theoretical asymptotic superiority as slot resolution S scales up.
 */
public class LinearRangeBaseline {

    private final int totalSlots;
    private final boolean[] occupied; // 1-indexed

    public LinearRangeBaseline(int totalSlots) {
        if (totalSlots <= 0) {
            throw new IllegalArgumentException("Total slots must be strictly positive");
        }
        this.totalSlots = totalSlots;
        this.occupied = new boolean[totalSlots + 1];
    }

    public boolean isIntervalFree(int queryLeft, int queryRight) {
        validateBounds(queryLeft, queryRight);
        for (int i = queryLeft; i <= queryRight; i++) {
            if (occupied[i]) {
                return false;
            }
        }
        return true;
    }

    public int queryOccupiedCount(int queryLeft, int queryRight) {
        validateBounds(queryLeft, queryRight);
        int count = 0;
        for (int i = queryLeft; i <= queryRight; i++) {
            if (occupied[i]) {
                count++;
            }
        }
        return count;
    }

    public void updateRange(int updateLeft, int updateRight, boolean occupy) {
        validateBounds(updateLeft, updateRight);
        for (int i = updateLeft; i <= updateRight; i++) {
            occupied[i] = occupy;
        }
    }

    private void validateBounds(int left, int right) {
        if (left < 1 || right > totalSlots || left > right) {
            throw new IllegalArgumentException(String.format("Invalid range [%d, %d] for total slots %d", left, right, totalSlots));
        }
    }
}
