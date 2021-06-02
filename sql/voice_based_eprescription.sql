-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2021 at 01:20 PM
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
  `did` int(11) NOT NULL,
  `pid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`bid`, `booking_date`, `start_time`, `end_time`, `slot_no`, `did`, `pid`) VALUES
(53, '2021-05-30', '16:00:00', '17:00:00', 8, 33, 1);

-- --------------------------------------------------------

--
-- Table structure for table `consultation`
--

CREATE TABLE `consultation` (
  `cid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `cdatetime` datetime NOT NULL,
  `audio` varchar(50) NOT NULL,
  `pdf` varchar(50) NOT NULL,
  `did` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `consultation`
--

INSERT INTO `consultation` (`cid`, `pid`, `cdatetime`, `audio`, `pdf`, `did`) VALUES
(5, 41, '2021-05-24 22:15:31', 'audio-link', 'pdf-link', 1),
(6, 40, '2021-05-24 22:15:31', 'audio-link', 'pdf-link', 2),
(7, 43, '2021-05-19 11:02:57', 'link', 'link', 1),
(8, 41, '2021-05-26 09:24:04', 'audio-link', 'pdf-link', 2),
(9, 43, '2021-06-01 10:30:00', 'audio-link', 'pdf-link', 33);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `did` int(11) NOT NULL,
  `dname` varchar(25) NOT NULL,
  `dphno` varchar(12) NOT NULL,
  `demail` varchar(30) NOT NULL,
  `dpasswd` varchar(25) NOT NULL,
  `role` varchar(15) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`did`, `dname`, `dphno`, `demail`, `dpasswd`, `role`, `isAvailable`) VALUES
(1, 'john', '9123132122', 'john@email.com', '123', 'orthopedic', 1),
(2, 'ram', '8441595226', 'ram@mail.com', 'somepassword', 'neuro', 1),
(12, 'nick', '975645654', 'nick@gmail.com', '', 'OPD', 1),
(13, 'ram', '8441525226', 'ram@mail.com', 'somepassword', 'neuro', 1),
(25, 'pete', '956461232', 'pete@mail.com', '', 'dental', 1),
(26, 'ken', '945461232', 'ken@mail.com', '', 'pedia', 1),
(27, 'bob', '945451232', 'bob@mail.com', '', 'gynecologist', 1),
(29, 'mark', '985451232', 'mark@mail.com', '', 'gynecologist', 1),
(30, 'frank', '878451232', 'frank@mail.com', '', 'OPD', 1),
(31, 'Abhishek Gowda M V', '+91636159990', 'abhishek.mvg@gmail.com', '123', 'OPD', 1),
(32, 'Gowda M V', '6361599901', 'abhi@gmail.com', '123', 'dental', 1),
(33, 'colte', '9784531234', 'colte@gmail.com', '123', 'gynecology', 0),
(34, 'ross', '6187651321', 'ross@mail.com', '123', 'neurosurgeon', 1),
(35, 'kim', '9564213212', 'kim@mail.com', '123', 'psychiatrist', 1),
(36, 'bill ', '7532135412', 'bill@mail.com', '456', 'dental', 1),
(37, 'kip', '8512314651', 'kip@mail.com', '789', 'gynecology', 1),
(38, 'quin', '6421354545', 'quin@mail.com', '321', 'neurosurgeon', 1),
(40, 'tim', '7865213245', 'tim@mail.com', '321', 'gynecology', 1),
(41, 'ken', '7865213751', 'ken@mail.com', '321', 'gynecology', 1),
(43, 'ken', '7865223751', 'ken@mail.com', '321', 'gynecology', 1),
(44, 'harry', '4531215452', 'harry@mail.com', '123', 'dental', 1);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `pid` int(11) NOT NULL,
  `did` int(11) DEFAULT NULL,
  `pname` varchar(25) NOT NULL,
  `dob` date NOT NULL,
  `gender` char(1) NOT NULL,
  `pemail` varchar(30) DEFAULT NULL,
  `pphno` varchar(12) NOT NULL,
  `ppasswd` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`pid`, `did`, `pname`, `dob`, `gender`, `pemail`, `pphno`, `ppasswd`) VALUES
(1, 1, 'sam', '2021-04-21', 'M', 'sam@got.com', '9456235413', '123'),
(6, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '96541321456', 'somepassword'),
(10, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '96541321426', 'somepassword'),
(13, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '96541325526', 'somepassword'),
(28, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '84441525226', 'somepassword'),
(31, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '84541525226', 'somepassword'),
(33, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '8441525226', 'somepassword'),
(37, NULL, 'ram', '2000-01-02', 'M', 'ram@mail.com', '8441595226', 'somepassword'),
(38, NULL, 'name', '2015-03-12', 'M', 'name@email.com', '9874561232', '123'),
(39, NULL, 'user', '2021-05-20', 'M', 'user@email.com', '98465121354', 'asdf'),
(40, NULL, 'dummy', '2016-05-21', 'M', 'dummy@email.com', '9517536542', 'zxcv'),
(41, NULL, 'patient', '2015-02-12', 'M', 'patient@gmail.com', '9564512442', '123'),
(42, NULL, 'nomad ', '2000-02-12', 'M', 'nomad@gmail.com', '9123546745', '456'),
(43, NULL, 'jon', '1989-06-12', 'M', 'jon@gmail.com', '6356453122', '123'),
(44, NULL, 'carl', '2021-05-12', 'M', 'carl@gmail.com', '9784553124', '123'),
(45, NULL, 'ram', '2016-05-12', 'M', 'ram@gmail.com', '8546312214', '654'),
(47, NULL, 'ramesh', '2016-05-12', 'M', 'ramesh@gmail.com', '8546312212', '654'),
(48, NULL, '', '0000-00-00', 'M', '', '', ''),
(56, NULL, 'jen', '2018-12-13', 'M', 'name@email.com', '213456545', '654'),
(58, NULL, 'jen', '0000-00-00', 'M', 'name@email.com', '978546123', '654'),
(59, NULL, 'greg', '2018-12-13', 'M', 'greg@email.com', '9213456545', '654'),
(60, NULL, 'Abhishek Gowda M V', '2021-05-21', 'M', 'abhishek.mvg@gmail.com', '+91636159990', '123'),
(63, NULL, 'Abhishek Gowda M V', '2021-05-23', 'M', '', '9456451234', '123'),
(64, NULL, 'test', '2015-05-22', 'M', 'abhi@mail.com', '9784561234', '123'),
(65, NULL, 'pat', '1984-02-05', 'F', 'pat@mail.com', '9565421543', '123'),
(66, NULL, 'hop', '2015-02-15', 'F', 'hop@mail.com', '8654312312', '123'),
(67, NULL, 'nick', '1990-05-12', 'F', 'nick@mail.com', '7453123121', '789');

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
(1, '09:00:00', '09:45:00', 0),
(2, '09:45:00', '10:30:00', 0),
(3, '10:30:00', '11:15:00', 0),
(4, '11:15:00', '12:00:00', 0),
(5, '13:00:00', '13:45:00', 0),
(6, '13:45:00', '14:30:00', 0),
(7, '14:30:00', '15:15:00', 0),
(8, '16:00:00', '17:00:00', 1),
(9, '17:00:00', '17:45:00', 0),
(10, '17:45:00', '18:30:00', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`bid`);

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
  MODIFY `bid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `consultation`
--
ALTER TABLE `consultation`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `did` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `slots`
--
ALTER TABLE `slots`
  MODIFY `slot_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
