package com.algolovers.newsletterconsole.service;

import com.google.api.client.http.ByteArrayContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleDriveService {

    private final Drive driveService;

    public String getPublicUrl(File file) {
        return "https://drive.google.com/thumbnail?id=" + file.getId();
    }

    public File uploadFile(String folderName, String fileName, String mimeType, byte[] fileBytes) {
        try {
            String folderId = getOrCreateFolderByName(folderName);
            return uploadFileToGoogleDrive(fileBytes, fileName, mimeType, folderId);
        } catch (IOException e) {
            log.error("Failed to upload file: {} for group: {}. Mime-type: {}", fileName, folderName, mimeType, e);
            throw new RuntimeException(e);
        }
    }

    public File replaceImageInFolder(String folderName, String existingImageName, byte[] newImageFileContent) throws IOException {
        // Find the existing image file in the folder
        String folderId = getOrCreateFolderByName(folderName);
        String query = "mimeType='image/jpeg' and '" + folderId + "' in parents and name='" + existingImageName + "'";
        FileList result = driveService.files().list().setQ(query).execute();
        List<File> files = result.getFiles();
        if (files != null && !files.isEmpty()) {
            // Delete the existing image file
            driveService.files().delete(files.get(0).getId()).execute();
        }
        // Upload the new image file to the same folder
        return uploadFileToGoogleDrive(newImageFileContent, existingImageName, "image/jpeg", folderId);
    }

    public String deleteFolderByName(String folderName) {
        try {
            // Find the folder by name
            String query = "mimeType='application/vnd.google-apps.folder' and name='" + folderName + "'";
            FileList result = driveService.files().list().setQ(query).execute();
            for (File file : result.getFiles()) {
                // Delete the folder
                driveService.files().delete(file.getId()).execute();
                return folderName;
            }
            return null;
        } catch (IOException e) {
            log.error("Failed to delete folder: {}", folderName, e);
            return null;
        }
    }

    private String getFolderIdByName(String folderName) throws IOException {
        String query = "mimeType='application/vnd.google-apps.folder' and name='" + folderName + "'";
        List<File> files = driveService.files().list().setQ(query).execute().getFiles();
        if (files != null && !files.isEmpty()) {
            return files.get(0).getId();
        }
        return null;
    }


    private String getOrCreateFolderByName(String folderName) throws IOException {
        String folderId = getFolderIdByName(folderName);
        if (folderId == null) {
            folderId = createFolder(folderName);
        }
        return folderId;
    }

    private String createFolder(String folderName) throws IOException {
        File folderMetadata = new File();
        folderMetadata.setName(folderName);
        folderMetadata.setMimeType("application/vnd.google-apps.folder");

        File folder = driveService.files().create(folderMetadata)
                .setFields("id")
                .execute();
        return folder.getId();
    }

    private File uploadFileToGoogleDrive(byte[] fileContent, String fileName, String mimeType, String folderId)
            throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(fileName);
        fileMetadata.setMimeType(mimeType);
        if (folderId != null) {
            fileMetadata.setParents(Collections.singletonList(folderId));
        }

        ByteArrayContent mediaContent = new ByteArrayContent(mimeType, fileContent);

        // Upload file
        File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id, name, webViewLink") // Request fields including webViewLink (public URL)
                .execute();

        // Set file visibility to public
        Permission permission = new Permission();
        permission.setType("anyone");
        permission.setRole("reader");
        driveService.permissions().create(uploadedFile.getId(), permission).execute();

        return uploadedFile;
    }

}
