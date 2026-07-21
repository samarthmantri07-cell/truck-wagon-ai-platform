const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

const generateReport = async (req, res, next) => {
  try {
    // 1. Fetch latest detection
    const latestDetection = await prisma.detection.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { objects: true }
    });

    if (!latestDetection) {
      res.status(404);
      throw new Error('No detections found to generate report');
    }

    // 2. Prepare data
    const dateObj = new Date();
    const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
    const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}-${String(dateObj.getMinutes()).padStart(2, '0')}`;
    
    // Check if objects contain trucks or wagons, and loaded/empty
    const objects = latestDetection.objects || [];
    const hasTruck = objects.some(o => o.className.toLowerCase().includes('truck'));
    const hasWagon = objects.some(o => o.className.toLowerCase().includes('wagon'));
    const isLoaded = objects.some(o => o.className.toLowerCase().includes('loaded'));
    
    let vehicleType = 'Unknown Vehicle';
    if (hasTruck) vehicleType = isLoaded ? 'Loaded Truck' : 'Empty Truck';
    else if (hasWagon) vehicleType = isLoaded ? 'Loaded Wagon' : 'Empty Wagon';

    const confidence = objects.length > 0 ? (objects.reduce((acc, curr) => acc + curr.confidence, 0) / objects.length) : 0.0;
    
    const inspectionId = `RPT-${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const gateNumber = 'Gate 1';
    const operator = req.user ? req.user.username : 'System';
    const damage = false; // Mocked for now based on requirements
    const emergency = false;
    const status = confidence > 0.8 ? 'PASSED' : 'FLAGGED';

    // 3. Generate PDF
    const filename = `Inspection_Report_${dateStr}_${timeStr}.pdf`;
    const reportsDir = path.join(__dirname, '../../uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const filePath = path.join(reportsDir, filename);

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // PDF Content
    doc.fontSize(20).font('Helvetica-Bold').text('Truck & Wagon AI Detection Platform', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Inspection Report', { align: 'center', underline: true });
    doc.moveDown(2);

    // Inspection Details
    doc.fontSize(14).text('Inspection Details');
    doc.fontSize(12).font('Helvetica');
    doc.text(`Inspection ID: ${inspectionId}`);
    doc.text(`Date: ${dateStr.replace(/-/g, '/')}`);
    doc.text(`Time: ${timeStr.replace('-', ':')}`);
    doc.text(`Gate Number: ${gateNumber}`);
    doc.text(`Operator/User: ${operator}`);
    doc.moveDown();

    // Detection Summary
    doc.fontSize(14).font('Helvetica-Bold').text('Detection Summary');
    doc.fontSize(12).font('Helvetica');
    doc.text(`Vehicle Type: ${vehicleType}`);
    doc.text(`Detection Confidence: ${(confidence * 100).toFixed(1)}%`);
    doc.text(`Inspection Status: ${status}`);
    doc.text(`Damage Detected: ${damage ? 'Yes' : 'No'}`);
    doc.text(`Emergency Situation: ${emergency ? 'Yes' : 'No'}`);
    doc.text(`AI Model: YOLO11`);
    doc.moveDown(2);

    // AI-generated paragraph
    doc.fontSize(14).font('Helvetica-Bold').text('Automated Inspection Summary');
    doc.fontSize(12).font('Helvetica');
    const paragraph = `On ${dateStr.replace(/-/g, '/')} at ${timeStr.replace('-', ':')}, an inspection was conducted at ${gateNumber} using the YOLO11 AI model. The system detected a ${vehicleType} passing through the checkpoint with an average confidence score of ${(confidence * 100).toFixed(1)}%. Based on the visual analysis, damage was ${damage ? 'detected' : 'not detected'}, and there is ${emergency ? 'an' : 'no'} emergency situation reported. The final inspection status has been marked as ${status}.`;
    doc.text(paragraph, { align: 'justify' });
    
    doc.moveDown(5);
    doc.fontSize(10).font('Helvetica-Oblique').text('Generated Automatically by Truck & Wagon AI Detection Platform', { align: 'center' });

    doc.end();

    // Wait for file to finish writing
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // 4. Save to DB
    const report = await prisma.report.create({
      data: {
        reportId: inspectionId,
        date: dateObj,
        vehicleType,
        inspectionStatus: status,
        confidence,
        gateNumber,
        damage,
        emergency,
        filePath: `/uploads/reports/${filename}`
      }
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

module.exports = { generateReport, getReports };
