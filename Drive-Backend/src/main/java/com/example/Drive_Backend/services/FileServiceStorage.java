package com.example.Drive_Backend.services;

import com.example.Drive_Backend.entity.FileEntity;
import com.example.Drive_Backend.repo.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileServiceStorage {


    @Value("${file.upload-dir}")
    private String uploadDir;

    private final FileRepository fileRepository;

    public FileServiceStorage(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }


    public String saveFile(MultipartFile file,Long parentFolderId) throws IOException
    {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        //file name
        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        //meta data for DB

        FileEntity fileEntity = new FileEntity();
        fileEntity.setName(fileName);
        fileEntity.setPath(filePath.toString());
        fileEntity.setSize(String.valueOf(file.getSize()));
        fileEntity.setType("file");
        fileEntity.setParentFolderId(parentFolderId);
        fileEntity.setCreatedAt(LocalDateTime.now());

        fileRepository.save(fileEntity);

        return "File uploaded Successfully!";
    }

    public List<FileEntity> getFilesInFolder(Long parentFolderId)
    {
        if (parentFolderId == null)
        {
            return fileRepository.findAll()
                    .stream()
                    .filter(file -> file.getParentFolderId() == null)
                    .collect(Collectors.toList());
        }
           else {
               return fileRepository.findAll()
                       .stream()
                       .filter(file -> parentFolderId.equals(file.getParentFolderId()))
                       .collect(Collectors.toList());
        }
    }

    public FileEntity getFileById(Long id)
    {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public void deleteFile(Long id)
    {
        FileEntity fileEntity = getFileById(id);
        fileRepository.delete(fileEntity);
    }
}
