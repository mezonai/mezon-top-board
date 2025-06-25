import { INestApplication } from "@nestjs/common";

import * as express from 'express';
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { join } from "path";

import { imageMimeTypes, maxImageFileSize, maxVideoFileSize, videoMimeTypes } from "@domain/common/constants/fileMimeTypes";

import { createUploadPath, generateFilename, isMimeTypeValid } from "@libs/utils/file";

import envConfig from "./env.config";

const uploadDir = join(process.cwd(), envConfig().UPLOAD_RELATIVE_DIR);

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = createUploadPath(uploadDir);
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, generateFilename(file));
    },
  }),
  fileFilter: (req, file, cb) => {
    const isImage = isMimeTypeValid(file.mimetype, imageMimeTypes);
    const isVideo = isMimeTypeValid(file.mimetype, videoMimeTypes);
    
    if (!isImage && !isVideo) {
      return cb(new Error('Only images and videos are allowed...'), false);
    }

    const fileSize = parseInt(req.headers['content-length']);
    
    if (isImage && fileSize > maxImageFileSize) {
      return cb(new Error(`Image size must be less than 4MB`), false);
    }
    
    if (isVideo && fileSize > maxVideoFileSize) {
      return cb(new Error(`Video size must be less than 25MB`), false);
    }
    
    cb(null, true);
  },
  limits: {
    fileSize: maxVideoFileSize,
  }
};

const configStaticFiles = (app: INestApplication) => {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }
  app.use('/api/uploads', express.static(uploadDir));
};

export {
  configStaticFiles, multerConfig, uploadDir
};

