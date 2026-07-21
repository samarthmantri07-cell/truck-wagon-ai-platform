const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DashboardRepository {
  async getTotalDetections() {
    return prisma.detection.count();
  }

  async getObjectCountByClassNames(classNames) {
    return prisma.detectionObject.count({
      where: {
        className: { in: classNames }
      }
    });
  }
}

module.exports = new DashboardRepository();
