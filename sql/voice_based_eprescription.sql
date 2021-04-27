-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2021 at 10:57 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `voice_based_eprescription`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `bid` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `slot_no` int(11) NOT NULL,
  `pid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`bid`, `booking_date`, `start_time`, `end_time`, `slot_no`, `pid`) VALUES
(1, '2021-04-24', '09:50:23', '11:00:00', 2, 1),
(2, '2021-04-24', '11:00:00', '12:00:00', 3, 1),
(3, '2021-04-25', '09:00:00', '10:00:00', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `consultation`
--

CREATE TABLE `consultation` (
  `cid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `cdate` date NOT NULL,
  `audio` varchar(50) NOT NULL,
  `pdf` varchar(50) NOT NULL,
  `did` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `consultation`
--

INSERT INTO `consultation` (`cid`, `pid`, `cdate`, `audio`, `pdf`, `did`) VALUES
(3, 1, '2021-04-21', '', '', NULL),
(4, 1, '2021-04-21', 'NULL', 'NULL', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `did` int(11) NOT NULL,
  `dname` varchar(25) NOT NULL,
  `dphno` varchar(12) NOT NULL,
  `demail` varchar(30) NOT NULL,
  `dpasswd` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`did`, `dname`, `dphno`, `demail`, `dpasswd`) VALUES
(1, 'john', '9123132122', 'john@email.com', '123'),
(2, 'ram', '8441595226', 'ram@mail.com', 'somepassword');

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `pid` int(11) NOT NULL,
  `did` int(11) DEFAULT NULL,
  `pname` varchar(25) NOT NULL,
  `dob` date NOT NULL,
  `pemail` varchar(30) DEFAULT NULL,
  `pphno` varchar(12) NOT NULL,
  `ppasswd` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`pid`, `did`, `pname`, `dob`, `pemail`, `pphno`, `ppasswd`) VALUES
(1, 1, 'sam', '2021-04-21', 'sam@got.com', '9456235413', '123'),
(6, NULL, 'ram', '2000-01-02', 'ram@mail.com', '96541321456', 'somepassword'),
(10, NULL, 'ram', '2000-01-02', 'ram@mail.com', '96541321426', 'somepassword'),
(13, NULL, 'ram', '2000-01-02', 'ram@mail.com', '96541325526', 'somepassword'),
(28, NULL, 'ram', '2000-01-02', 'ram@mail.com', '84441525226', 'somepassword'),
(31, NULL, 'ram', '2000-01-02', 'ram@mail.com', '84541525226', 'somepassword'),
(33, NULL, 'ram', '2000-01-02', 'ram@mail.com', '8441525226', 'somepassword'),
(37, NULL, 'ram', '2000-01-02', 'ram@mail.com', '8441595226', 'somepassword');

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `slot_no` int(11) NOT NULL,
  `slot_start` time NOT NULL,
  `slot_end` time NOT NULL,
  `isBooked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slots`
--

INSERT INTO `slots` (`slot_no`, `slot_start`, `slot_end`, `isBooked`) VALUES
(1, '09:00:00', '10:00:00', 1),
(2, '10:00:00', '11:00:00', 0),
(3, '11:00:00', '12:00:00', 0),
(4, '12:00:00', '13:00:00', 0),
(5, '14:00:00', '15:00:00', 0),
(6, '15:00:00', '16:00:00', 0),
(7, '16:00:00', '17:00:00', 0),
(8, '17:00:00', '18:00:00', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`bid`),
  ADD KEY `pid` (`pid`);

--
-- Indexes for table `consultation`
--
ALTER TABLE `consultation`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `pid` (`pid`),
  ADD KEY `did` (`did`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`did`),
  ADD UNIQUE KEY `dphno` (`dphno`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`pid`),
  ADD UNIQUE KEY `pphno` (`pphno`),
  ADD KEY `did` (`did`);

--
-- Indexes for table `slots`
--
ALTER TABLE `slots`
  ADD PRIMARY KEY (`slot_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `bid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `consultation`
--
ALTER TABLE `consultation`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `did` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `slots`
--
ALTER TABLE `slots`
  MODIFY `slot_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`slot_no`) REFERENCES `slots` (`slot_no`);

--
-- Constraints for table `consultation`
--
ALTER TABLE `consultation`
  ADD CONSTRAINT `consultation_ibfk_1` FOREIGN KEY (`did`) REFERENCES `doctor` (`did`),
  ADD CONSTRAINT `pid` FOREIGN KEY (`pid`) REFERENCES `patient` (`pid`);

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `did` FOREIGN KEY (`did`) REFERENCES `doctor` (`did`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
