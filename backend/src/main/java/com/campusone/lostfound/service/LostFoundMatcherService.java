package com.campusone.lostfound.service;

import com.campusone.lostfound.model.LostFoundReport;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class LostFoundMatcherService {

    public static class MatchSuggestion {
        private final LostFoundReport report;
        private final int scorePercentage;
        private final String matchReason;

        public MatchSuggestion(LostFoundReport report, int scorePercentage, String matchReason) {
            this.report = report;
            this.scorePercentage = scorePercentage;
            this.matchReason = matchReason;
        }

        public LostFoundReport getReport() { return report; }
        public int getScorePercentage() { return scorePercentage; }
        public String getMatchReason() { return matchReason; }
    }

    public List<MatchSuggestion> findPotentialMatches(LostFoundReport target, List<LostFoundReport> candidates) {
        if (target == null || candidates == null || candidates.isEmpty()) {
            return Collections.emptyList();
        }

        String oppositeType = "LOST".equalsIgnoreCase(target.getReportType()) ? "FOUND" : "LOST";
        List<MatchSuggestion> suggestions = new ArrayList<>();

        for (LostFoundReport candidate : candidates) {
            if (!oppositeType.equalsIgnoreCase(candidate.getReportType())) {
                continue;
            }
            if ("HANDED_OVER".equalsIgnoreCase(candidate.getStatus()) || "WITHDRAWN".equalsIgnoreCase(candidate.getStatus())) {
                continue;
            }

            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Category Match (Weight: 35 points)
            if (target.getCategory() != null && target.getCategory().equalsIgnoreCase(candidate.getCategory())) {
                score += 35;
                reasons.add("Matching Category (" + target.getCategory() + ")");
            }

            // 2. Keyword Similarity in Title / Item Name (Weight: 35 points)
            double jaccard = calculateJaccardSimilarity(target.getItemName(), candidate.getItemName());
            if (jaccard > 0.0) {
                int keywordScore = (int) Math.round(jaccard * 35);
                score += keywordScore;
                reasons.add(String.format("Keyword overlap (%.0f%%)", jaccard * 100));
            }

            // 3. Color Equality (Weight: 15 points)
            if (target.getColor() != null && candidate.getColor() != null
                    && !target.getColor().isBlank() && !candidate.getColor().isBlank()) {
                if (target.getColor().trim().equalsIgnoreCase(candidate.getColor().trim())) {
                    score += 15;
                    reasons.add("Matching Color (" + target.getColor() + ")");
                }
            }

            // 4. Date Proximity within 14 days (Weight: 15 points)
            if (target.getEventDate() != null && candidate.getEventDate() != null) {
                try {
                    LocalDate d1 = LocalDate.parse(target.getEventDate());
                    LocalDate d2 = LocalDate.parse(candidate.getEventDate());
                    long daysDiff = Math.abs(ChronoUnit.DAYS.between(d1, d2));
                    if (daysDiff <= 3) {
                        score += 15;
                        reasons.add("Date within 3 days");
                    } else if (daysDiff <= 7) {
                        score += 10;
                        reasons.add("Date within 1 week");
                    } else if (daysDiff <= 14) {
                        score += 5;
                        reasons.add("Date within 2 weeks");
                    }
                } catch (Exception ignored) {}
            }

            // Only suggest if score is >= 35%
            if (score >= 35) {
                suggestions.add(new MatchSuggestion(candidate, score, String.join(", ", reasons)));
            }
        }

        // Sort descending by score
        suggestions.sort((a, b) -> Integer.compare(b.scorePercentage, a.scorePercentage));

        return suggestions;
    }

    private double calculateJaccardSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        Set<String> set1 = tokenize(s1);
        Set<String> set2 = tokenize(s2);

        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }

    private Set<String> tokenize(String input) {
        String[] words = input.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        Set<String> tokens = new HashSet<>();
        for (String w : words) {
            if (w.length() > 2) {
                tokens.add(w);
            }
        }
        return tokens;
    }
}
