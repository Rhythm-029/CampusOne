package com.campusone.algorithm.bloom;

import java.nio.charset.StandardCharsets;
import java.util.BitSet;

/**
 * Unit 6 / CO5: Bloom Filter Data Structure implemented from scratch in pure Java.
 *
 * Provides probabilistic set membership testing for Lost & Found Report IDs.
 *
 * Mathematical Properties:
 * - False Negatives: IMPOSSIBLE (a return value of 'false' guarantees item is NOT in filter).
 * - False Positives: POSSIBLE with theoretical probability p ~ (1 - e^(-k*n / m))^k.
 *
 * Concurrency & Synchronization Guard:
 * - Maintains an atomic 'isSynchronized' flag.
 * - If synchronization is uncertain (e.g. startup loading, recent deletions, network partition),
 *   it signals callers to bypass the filter and fall back directly to MongoDB Atlas.
 */
public class BloomFilter<T> {

    private final BitSet bitSet;
    private final int bitArraySize; // m
    private final int hashFunctionsCount; // k
    private int elementCount; // n
    private volatile boolean isSynchronized;

    /**
     * Constructs a Bloom Filter with explicit size m and k hash functions.
     *
     * @param bitArraySize m: number of bits in the bit array
     * @param hashFunctionsCount k: number of independent hash functions
     */
    public BloomFilter(int bitArraySize, int hashFunctionsCount) {
        if (bitArraySize <= 0) throw new IllegalArgumentException("Bit array size must be > 0");
        if (hashFunctionsCount <= 0) throw new IllegalArgumentException("Hash count must be > 0");

        this.bitArraySize = bitArraySize;
        this.hashFunctionsCount = hashFunctionsCount;
        this.bitSet = new BitSet(bitArraySize);
        this.elementCount = 0;
        this.isSynchronized = true;
    }

    /**
     * Constructs an optimal Bloom Filter for expected n elements and target false positive rate p.
     * m = - (n * ln(p)) / (ln(2)^2)
     * k = (m / n) * ln(2)
     */
    public static <T> BloomFilter<T> optimal(int expectedElements, double targetFalsePositiveRate) {
        if (expectedElements <= 0) expectedElements = 1000;
        if (targetFalsePositiveRate <= 0.0 || targetFalsePositiveRate >= 1.0) targetFalsePositiveRate = 0.01;

        int m = (int) Math.ceil(-1.0 * expectedElements * Math.log(targetFalsePositiveRate) / Math.pow(Math.log(2), 2));
        int k = (int) Math.round(((double) m / expectedElements) * Math.log(2));
        return new BloomFilter<>(Math.max(64, m), Math.max(1, k));
    }

    /**
     * Inserts an element into the Bloom Filter using Kirsch-Mitzenmacher double-hashing:
     * h_i(x) = (h1(x) + i * h2(x)) mod m
     */
    public synchronized void add(T element) {
        if (element == null) return;
        byte[] bytes = element.toString().getBytes(StandardCharsets.UTF_8);

        long h1 = hashMurmur3_64(bytes, 0);
        long h2 = hashFnv1a_64(bytes);

        for (int i = 0; i < hashFunctionsCount; i++) {
            long combinedHash = h1 + (long) i * h2;
            int bitIndex = (int) Math.floorMod(combinedHash, bitArraySize);
            bitSet.set(bitIndex);
        }
        elementCount++;
    }

    /**
     * Probabilistic membership query.
     *
     * @param element element to test
     * @return false: definitely not in filter (and thus not in MongoDB if synchronized)
     *         true: probably in filter (must be verified against MongoDB)
     */
    public boolean mightContain(T element) {
        if (element == null) return false;
        byte[] bytes = element.toString().getBytes(StandardCharsets.UTF_8);

        long h1 = hashMurmur3_64(bytes, 0);
        long h2 = hashFnv1a_64(bytes);

        for (int i = 0; i < hashFunctionsCount; i++) {
            long combinedHash = h1 + (long) i * h2;
            int bitIndex = (int) Math.floorMod(combinedHash, bitArraySize);
            if (!bitSet.get(bitIndex)) {
                return false; // Definitely not present
            }
        }
        return true; // Probably present (could be a false positive)
    }

    /**
     * Safe query with uncertain-synchronization fallback.
     * If synchronization is uncertain, returns true so caller queries authoritative MongoDB.
     */
    public boolean safeMightContain(T element) {
        if (!isSynchronized) {
            return true; // Force fallback to MongoDB Atlas
        }
        return mightContain(element);
    }

    /**
     * Clears the bit array and resets element count.
     */
    public synchronized void clear() {
        bitSet.clear();
        elementCount = 0;
        isSynchronized = true;
    }

    /**
     * Calculates theoretical false positive probability: p = (1 - e^(-k*n / m))^k
     */
    public double getTheoreticalFalsePositiveRate() {
        double exponent = -1.0 * hashFunctionsCount * elementCount / bitArraySize;
        return Math.pow(1.0 - Math.exp(exponent), hashFunctionsCount);
    }

    public int getBitArraySize() {
        return bitArraySize;
    }

    public int getHashFunctionsCount() {
        return hashFunctionsCount;
    }

    public int getElementCount() {
        return elementCount;
    }

    public boolean isSynchronized() {
        return isSynchronized;
    }

    public void setSynchronized(boolean aSynchronized) {
        isSynchronized = aSynchronized;
    }

    // -------------------------------------------------------------------------
    // Hash Functions (Murmur3 64-bit and FNV-1a 64-bit)
    // -------------------------------------------------------------------------

    private static long hashMurmur3_64(byte[] data, int seed) {
        long m = 0xc6a4a7935bd1e995L;
        int r = 47;
        long h = (seed & 0xffffffffL) ^ (data.length * m);

        int length8 = data.length / 8;
        for (int i = 0; i < length8; i++) {
            int i8 = i * 8;
            long k = ((long) data[i8] & 0xff)
                    | (((long) data[i8 + 1] & 0xff) << 8)
                    | (((long) data[i8 + 2] & 0xff) << 16)
                    | (((long) data[i8 + 3] & 0xff) << 24)
                    | (((long) data[i8 + 4] & 0xff) << 32)
                    | (((long) data[i8 + 5] & 0xff) << 40)
                    | (((long) data[i8 + 6] & 0xff) << 48)
                    | (((long) data[i8 + 7] & 0xff) << 56);

            k *= m;
            k ^= k >>> r;
            k *= m;

            h ^= k;
            h *= m;
        }

        int rem = data.length % 8;
        int offset = length8 * 8;
        if (rem > 0) {
            long k = 0;
            for (int i = rem - 1; i >= 0; i--) {
                k = (k << 8) | (data[offset + i] & 0xff);
            }
            h ^= k * m;
            h *= m;
        }

        h ^= h >>> r;
        h *= m;
        h ^= h >>> r;

        return h;
    }

    private static long hashFnv1a_64(byte[] data) {
        long hash = 0xcbf29ce484222325L;
        long prime = 0x100000001b3L;
        for (byte b : data) {
            hash ^= (b & 0xff);
            hash *= prime;
        }
        return hash;
    }
}

