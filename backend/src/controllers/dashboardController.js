const dashboardRepository = require('../repositories/dashboardRepository');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalDetections = await dashboardRepository.getTotalDetections();
    const totalLoaded = await dashboardRepository.getObjectCountByClassNames(['loaded_truck', 'loaded_wagon']);
    const totalEmpty = await dashboardRepository.getObjectCountByClassNames(['empty_truck', 'empty_wagon']);

    res.json({
      total_detections: totalDetections,
      loaded: totalLoaded,
      empty: totalEmpty,
      active_cameras: 0,
      system_uptime: "99.9%"
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = (req, res, next) => {
  try {
    // Analytics is currently mocked; could be moved to repository if table exists
    res.json([
      { time: '00:00', loaded: 12, empty: 8 },
      { time: '04:00', loaded: 20, empty: 15 },
      { time: '08:00', loaded: 45, empty: 30 },
      { time: '12:00', loaded: 60, empty: 25 },
      { time: '16:00', loaded: 55, empty: 40 },
    ]);
  } catch (error) {
    next(error);
  }
};

const getReports = (req, res, next) => {
  try {
    res.json({ message: 'Reports endpoint' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAnalytics, getReports };
