/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for osx10.19 (arm64)
--
-- Host: localhost    Database: shopdb
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Accounts`
--

DROP TABLE IF EXISTS `Accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `purchased_services` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`purchased_services`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `purchasedServices` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accounts`
--

LOCK TABLES `Accounts` WRITE;
/*!40000 ALTER TABLE `Accounts` DISABLE KEYS */;
INSERT INTO `Accounts` VALUES
(5,'ans','anan123456a123@gmail.com','$2b$10$xpEVC6dy540Kd/nJyVjJeeMi7KBrCXJ5enbvLv2trUPBVK9pl665a',1.00,NULL,'2025-05-19 16:27:13','[]','2025-05-19 16:27:13','2025-05-19 23:53:24');
/*!40000 ALTER TABLE `Accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DownloadFiles`
--

DROP TABLE IF EXISTS `DownloadFiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DownloadFiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `googleDriveLink` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `downloadfiles_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DownloadFiles`
--

LOCK TABLES `DownloadFiles` WRITE;
/*!40000 ALTER TABLE `DownloadFiles` DISABLE KEYS */;
INSERT INTO `DownloadFiles` VALUES
(5,22,'2025-05-18 17:03:21','2025-05-18 17:03:21','https://drive.google.com/file/d/1qLZmVjOqMuVOdued9ZF_hxMj2C1Aa8fW/view?usp=sharing'),
(6,23,'2025-05-18 17:04:34','2025-05-18 17:04:34','https://drive.google.com/file/d/1qLZmVjOqMuVOdued9ZF_hxMj2C1Aa8fW/view?usp=sharing'),
(8,26,'2025-05-18 17:27:31','2025-05-18 17:27:31','https://drive.google.com/file/d/1qLZmVjOqMuVOdued9ZF_hxMj2C1Aa8fW/view?usp=sharing');
/*!40000 ALTER TABLE `DownloadFiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Images`
--

DROP TABLE IF EXISTS `Images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Images`
--

LOCK TABLES `Images` WRITE;
/*!40000 ALTER TABLE `Images` DISABLE KEYS */;
INSERT INTO `Images` VALUES
(16,'images-1747587801622-248088582.png',22,'2025-05-18 17:03:21','2025-05-18 17:03:21'),
(17,'images-1747587874080-183177294.JPG',23,'2025-05-18 17:04:34','2025-05-18 17:04:34'),
(22,'images-1747589251119-680358626.jpeg',26,'2025-05-18 17:27:31','2025-05-18 17:27:31'),
(23,'images-1747589251120-44476678.jpeg',26,'2025-05-18 17:27:31','2025-05-18 17:27:31'),
(24,'images-1747589251120-774977611.jpeg',26,'2025-05-18 17:27:31','2025-05-18 17:27:31');
/*!40000 ALTER TABLE `Images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES
(43,1,22,'2025-05-18 17:25:37','2025-05-18 17:25:37'),
(45,1,26,'2025-05-18 17:27:43','2025-05-18 17:27:43'),
(46,1,26,'2025-05-19 16:06:34','2025-05-19 16:06:34'),
(47,1,26,'2025-05-19 16:08:38','2025-05-19 16:08:38'),
(48,1,26,'2025-05-19 16:10:40','2025-05-19 16:10:40'),
(49,1,26,'2025-05-19 16:11:30','2025-05-19 16:11:30'),
(50,1,26,'2025-05-19 16:12:12','2025-05-19 16:12:12'),
(51,1,26,'2025-05-19 16:13:19','2025-05-19 16:13:19'),
(52,1,26,'2025-05-19 16:27:24','2025-05-19 16:27:24'),
(53,1,26,'2025-05-19 16:31:07','2025-05-19 16:31:07'),
(54,5,26,'2025-05-19 16:33:03','2025-05-19 16:33:03'),
(55,5,22,'2025-05-19 16:37:06','2025-05-19 16:37:06');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` float NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES
(22,'Anti Hack','anti hack',100000,117,NULL,'2025-05-18 17:03:21','2025-05-19 16:37:06'),
(23,'backup file','',122212000,12,NULL,'2025-05-18 17:04:34','2025-05-18 17:04:34'),
(26,'Plugin Fly','dAY LA PLUGIN VIET HOA',119998,1099,NULL,'2025-05-18 17:27:31','2025-05-19 16:33:03');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-05-20  0:18:11
