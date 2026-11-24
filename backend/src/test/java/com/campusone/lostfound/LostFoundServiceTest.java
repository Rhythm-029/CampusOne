package com.campusone.lostfound;

import com.campusone.lostfound.model.LostFoundClaim;
import com.campusone.lostfound.model.LostFoundReport;
import com.campusone.lostfound.repository.ItemVocabularyRepository;
import com.campusone.lostfound.repository.LostFoundClaimRepository;
import com.campusone.lostfound.repository.LostFoundReportRepository;
import com.campusone.lostfound.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LostFoundServiceTest {

    @Mock
    private LostFoundReportRepository reportRepository;

    @Mock
    private LostFoundClaimRepository claimRepository;

    @Mock
    private LostFoundImageService imageService;

    @Mock
    private ItemVocabularyRepository itemVocabularyRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    private LostFoundAutocompleteService autocompleteService;
    private LostFoundScreeningService screeningService;
    private LostFoundMatcherService matcherService;
    private LostFoundService lostFoundService;

    @BeforeEach
    void setUp() {
        autocompleteService = new LostFoundAutocompleteService(itemVocabularyRepository, reportRepository);
        screeningService = new LostFoundScreeningService(reportRepository);
        matcherService = new LostFoundMatcherService();
        lostFoundService = new LostFoundService(
                reportRepository,
                claimRepository,
                imageService,
                autocompleteService,
                screeningService,
                matcherService,
                mongoTemplate
        );
    }

    @Test
    @DisplayName("Report Creation: Generates ID, Updates Bloom Filter & Trie, and Persists")
    void testCreateReport() throws IOException {
        when(reportRepository.count()).thenReturn(10L);
        when(reportRepository.save(any(LostFoundReport.class))).thenAnswer(inv -> inv.getArgument(0));

        LostFoundReport report = lostFoundService.createReport(
                "LOST",
                "Sony WH-1000XM4 Headphones",
                "Electronics",
                "Black over-ear headphones in hard case",
                "Central Library 2nd Floor",
                "2026-02-23",
                "14:30",
                "Black",
                "Scratch near right hinge",
                "",
                null,
                "ananya.student@atlasskilltech.university",
                "Ananya Sharma"
        );

        assertNotNull(report);
        assertEquals("LF-2026-011", report.getReportId());
        assertEquals("OPEN", report.getStatus());

        // Verify Bloom Filter knows about report
        assertTrue(screeningService.mightContain("LF-2026-011"));

        // Verify Trie knows about item name
        List<String> autocomplete = autocompleteService.autocomplete("sony", 5);
        assertFalse(autocomplete.isEmpty());
        assertTrue(autocomplete.get(0).toLowerCase().contains("sony"));
    }

    @Test
    @DisplayName("Bloom Filter Screening: Non-Existent ID is Rejected Before Database Call")
    void testScreeningRejection() {
        Optional<LostFoundReport> result = lostFoundService.getReportById(
                "NON-EXISTENT-ID-99999",
                "student@atlasskilltech.university",
                false
        );

        assertTrue(result.isEmpty(), "Screening must return empty for non-existent IDs without querying MongoDB");
        verify(reportRepository, never()).findByReportId("NON-EXISTENT-ID-99999");
    }

    @Test
    @DisplayName("Ownership Claims: Self-Claiming Own Item is Disallowed")
    void testDisallowSelfClaim() {
        LostFoundReport report = new LostFoundReport();
        report.setReportId("LF-2026-001");
        report.setReportedByUserId("ananya.student@atlasskilltech.university");
        when(reportRepository.findByReportId("LF-2026-001")).thenReturn(Optional.of(report));

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                lostFoundService.submitClaim(
                        "LF-2026-001",
                        "Invoice #123",
                        "Secret engraving",
                        "ananya.student@atlasskilltech.university",
                        "Ananya Sharma",
                        "CS"
                )
        );
        assertTrue(ex.getMessage().contains("personally reported"));
    }

    @Test
    @DisplayName("Potential Match Engine: Computes High Similarity for Matching Attributes")
    void testPotentialMatchCalculation() {
        LostFoundReport lost = new LostFoundReport();
        lost.setReportId("LF-LOST-1");
        lost.setReportType("LOST");
        lost.setItemName("Hydro Flask Water Bottle Blue");
        lost.setCategory("Accessories");
        lost.setColor("Blue");
        lost.setEventDate("2026-02-20");

        LostFoundReport found = new LostFoundReport();
        found.setReportId("LF-FOUND-1");
        found.setReportType("FOUND");
        found.setItemName("Hydro Flask Insulated Steel Bottle");
        found.setCategory("Accessories");
        found.setColor("Blue");
        found.setEventDate("2026-02-21");

        List<LostFoundMatcherService.MatchSuggestion> matches = matcherService.findPotentialMatches(lost, List.of(found));
        assertFalse(matches.isEmpty());
        assertTrue(matches.get(0).getScorePercentage() >= 60, "Expected high confidence match for overlapping attributes");
    }
}
