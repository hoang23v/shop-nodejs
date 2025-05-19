import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Tạo migration cho bảng Images
async function createImagesTable() {
  try {
    // Sử dụng queryInterface để tạo bảng
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Images (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        productId INTEGER NOT NULL,
        url VARCHAR(255) NOT NULL,
        alt VARCHAR(255),
        isMain BOOLEAN NOT NULL DEFAULT false,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Đã tạo bảng Images thành công');
    return true;
  } catch (error) {
    console.error('Lỗi khi tạo bảng Images:', error);
    return false;
  }
}

// Tạo migration cho bảng DownloadFiles nếu chưa có
async function createDownloadFilesTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS DownloadFiles (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        productId INTEGER NOT NULL,
        filename VARCHAR(255) NOT NULL,
        googleDriveLink VARCHAR(255),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Đã tạo bảng DownloadFiles thành công');
    return true;
  } catch (error) {
    console.error('Lỗi khi tạo bảng DownloadFiles:', error);
    return false;
  }
}

// Chạy các migrations
async function runMigrations() {
  try {
    await createImagesTable();
    await createDownloadFilesTable();
    console.log('Migrations đã chạy thành công');
  } catch (error) {
    console.error('Lỗi khi chạy migrations:', error);
  }
}

export default runMigrations;