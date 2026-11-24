package com.campusone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

@SpringBootApplication
public class CampusOneApplication {

    public static void main(String[] args) {
        loadEnvIfPresent();
        SpringApplication.run(CampusOneApplication.class, args);
    }

    public static void loadEnvIfPresent() {
        if (System.getenv("MONGODB_URI") == null && System.getProperty("MONGODB_URI") == null) {
            File[] candidates = { new File(".env"), new File("backend/.env"), new File("../.env") };
            for (File file : candidates) {
                if (file.exists() && file.isFile()) {
                    try (FileInputStream fis = new FileInputStream(file)) {
                        Properties props = new Properties();
                        props.load(fis);
                        for (String key : props.stringPropertyNames()) {
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, props.getProperty(key).trim());
                            }
                        }
                        break;
                    } catch (Exception ignored) {}
                }
            }
        }
    }
}
