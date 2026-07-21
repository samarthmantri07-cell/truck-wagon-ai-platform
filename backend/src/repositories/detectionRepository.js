const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DetectionRepository {
  async createUpload(filePath) {
    return prisma.upload.create({
      data: { filePath }
    });
  }

  async createDetectionWithRelations(uploadId, processingTimeMs, success, objects) {
    return prisma.detection.create({
      data: {
        uploadId,
        processingTimeMs,
        success,
        objects: {
          create: objects.map(obj => ({
            className: obj.class,
            confidence: obj.confidence,
            x1: obj.bbox.x1,
            y1: obj.bbox.y1,
            x2: obj.bbox.x2,
            y2: obj.bbox.y2
          }))
        }
      },
      include: {
        objects: true,
        upload: true
      }
    });
  }

  async getDetections(page = 1, limit = 50, filters = {}, sort = { createdAt: 'desc' }) {
    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const where = {};
    if (filters.className) {
      where.objects = {
        some: { className: filters.className }
      };
    }
    if (filters.success !== undefined) {
      where.success = filters.success;
    }
    if (filters.search) {
      where.objects = {
        some: { className: { contains: filters.search, mode: 'insensitive' } }
      };
    }

    const [data, total] = await Promise.all([
      prisma.detection.findMany({
        where,
        skip,
        take: limit,
        orderBy: sort,
        include: {
          upload: true,
          objects: true
        }
      }),
      prisma.detection.count({ where })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }   // <---- THIS IS MISSING

  async createVideoMetadata(uploadId, processingTimeMs, frameCount, fps, avgConfidence, detectionSummary) {
    return prisma.videoMetadata.create({
      data: {
        uploadId,
        processingTimeMs,
        frameCount,
        fps,
        avgConfidence,
        detectionSummary
      }
    });
  }
}

module.exports = new DetectionRepository();
