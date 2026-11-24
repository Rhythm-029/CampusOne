package com.campusone.lostfound.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Service
public class LostFoundImageService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    public LostFoundImageService(GridFsTemplate gridFsTemplate, GridFsOperations gridFsOperations) {
        this.gridFsTemplate = gridFsTemplate;
        this.gridFsOperations = gridFsOperations;
    }

    public String storeImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Image file size exceeds maximum permitted limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid image format: " + contentType + ". Permitted formats: JPEG, PNG, WEBP.");
        }

        String cleanOriginalName = file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_") : "item_photo";
        String filename = "lf_" + System.currentTimeMillis() + "_" + cleanOriginalName;

        ObjectId fileId = gridFsTemplate.store(file.getInputStream(), filename, contentType);
        return fileId.toHexString();
    }

    public GridFsResource retrieveImage(String imageId) {
        if (imageId == null || imageId.isBlank()) {
            return null;
        }
        try {
            ObjectId objId = new ObjectId(imageId);
            GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(objId)));
            if (gridFSFile == null) {
                return null;
            }
            return gridFsOperations.getResource(gridFSFile);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    public void deleteImage(String imageId) {
        if (imageId == null || imageId.isBlank()) return;
        try {
            ObjectId objId = new ObjectId(imageId);
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(objId)));
        } catch (Exception ignored) {}
    }
}

