package com.campusone.lostfound.service;

import com.campusone.algorithm.bloom.BloomFilter;
import com.campusone.lostfound.model.LostFoundReport;
import com.campusone.lostfound.repository.LostFoundReportRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostFoundScreeningService {

    private final BloomFilter<String> bloomFilter;
    private final LostFoundReportRepository reportRepository;

    public LostFoundScreeningService(LostFoundReportRepository reportRepository) {
        this.reportRepository = reportRepository;
        // Optimal for 5,000 items with 1% false positive probability
        this.bloomFilter = BloomFilter.optimal(5000, 0.01);
    }

    @PostConstruct
    public void initFilterFromDatabase() {
        rebuildSync();
    }

    public synchronized void rebuildSync() {
        bloomFilter.setSynchronized(false);
        bloomFilter.clear();

        List<LostFoundReport> allReports = reportRepository.findAll();
        for (LostFoundReport r : allReports) {
            if (r.getReportId() != null) {
                bloomFilter.add(r.getReportId());
            }
        }
        bloomFilter.setSynchronized(true);
    }

    public boolean mightContain(String reportId) {
        if (reportId == null || reportId.isBlank()) return false;
        return bloomFilter.safeMightContain(reportId.trim());
    }

    public void registerReportId(String reportId) {
        if (reportId != null && !reportId.isBlank()) {
            bloomFilter.add(reportId.trim());
        }
    }

    public void invalidateSync() {
        bloomFilter.setSynchronized(false);
    }

    public boolean isSynchronized() {
        return bloomFilter.isSynchronized();
    }

    public int getElementCount() {
        return bloomFilter.getElementCount();
    }

    public double getTheoreticalFalsePositiveRate() {
        return bloomFilter.getTheoreticalFalsePositiveRate();
    }
}
