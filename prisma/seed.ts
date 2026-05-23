import { prisma } from '../src/lib/prisma';

// All 23 IITs
const iitsData = [
  { name: 'Indian Institute of Technology, Madras (IIT Madras)', city: 'Chennai', state: 'Tamil Nadu', established: 1959, ranking: 1, rating: 4.9, fees: 210000, placementMedian: 20.0, placementHighest: 120.0, cseCutoff: 148, eeCutoff: 600, meCutoff: 2200 },
  { name: 'Indian Institute of Technology, Delhi (IIT Delhi)', city: 'New Delhi', state: 'Delhi', established: 1961, ranking: 2, rating: 4.8, fees: 220000, placementMedian: 20.5, placementHighest: 150.0, cseCutoff: 115, eeCutoff: 450, meCutoff: 1800 },
  { name: 'Indian Institute of Technology, Bombay (IIT Bombay)', city: 'Mumbai', state: 'Maharashtra', established: 1958, ranking: 3, rating: 4.9, fees: 215000, placementMedian: 21.8, placementHighest: 168.0, cseCutoff: 67, eeCutoff: 290, meCutoff: 1200 },
  { name: 'Indian Institute of Technology, Kanpur (IIT Kanpur)', city: 'Kanpur', state: 'Uttar Pradesh', established: 1959, ranking: 4, rating: 4.7, fees: 212000, placementMedian: 19.5, placementHighest: 140.0, cseCutoff: 250, eeCutoff: 900, meCutoff: 2800 },
  { name: 'Indian Institute of Technology, Kharagpur (IIT Kharagpur)', city: 'Kharagpur', state: 'West Bengal', established: 1951, ranking: 6, rating: 4.7, fees: 208000, placementMedian: 18.5, placementHighest: 125.0, cseCutoff: 280, eeCutoff: 950, meCutoff: 3100 },
  { name: 'Indian Institute of Technology, Roorkee (IIT Roorkee)', city: 'Roorkee', state: 'Uttarakhand', established: 1847, ranking: 8, rating: 4.6, fees: 210000, placementMedian: 18.0, placementHighest: 130.0, cseCutoff: 410, eeCutoff: 1200, meCutoff: 3800 },
  { name: 'Indian Institute of Technology, Guwahati (IIT Guwahati)', city: 'Guwahati', state: 'Assam', established: 1994, ranking: 7, rating: 4.6, fees: 215000, placementMedian: 17.5, placementHighest: 120.0, cseCutoff: 650, eeCutoff: 1600, meCutoff: 4500 },
  { name: 'Indian Institute of Technology, Hyderabad (IIT Hyderabad)', city: 'Sangareddy', state: 'Telangana', established: 2008, ranking: 14, rating: 4.6, fees: 220000, placementMedian: 17.0, placementHighest: 90.0, cseCutoff: 670, eeCutoff: 1800, meCutoff: 4800 },
  { name: 'Indian Institute of Technology, BHU (IIT BHU)', city: 'Varanasi', state: 'Uttar Pradesh', established: 1919, ranking: 15, rating: 4.5, fees: 210000, placementMedian: 16.5, placementHighest: 115.0, cseCutoff: 1050, eeCutoff: 2600, meCutoff: 5800 },
  { name: 'Indian Institute of Technology, ISM Dhanbad (IIT ISM Dhanbad)', city: 'Dhanbad', state: 'Jharkhand', established: 1926, ranking: 17, rating: 4.4, fees: 205000, placementMedian: 15.5, placementHighest: 85.0, cseCutoff: 2900, eeCutoff: 5700, meCutoff: 10800 },
  { name: 'Indian Institute of Technology, Indore (IIT Indore)', city: 'Indore', state: 'Madhya Pradesh', established: 2009, ranking: 16, rating: 4.5, fees: 220000, placementMedian: 16.0, placementHighest: 95.0, cseCutoff: 1380, eeCutoff: 3400, meCutoff: 7200 },
  { name: 'Indian Institute of Technology, Ropar (IIT Ropar)', city: 'Rupnagar', state: 'Punjab', established: 2008, ranking: 22, rating: 4.4, fees: 220000, placementMedian: 15.0, placementHighest: 75.0, cseCutoff: 1880, eeCutoff: 4300, meCutoff: 8200 },
  { name: 'Indian Institute of Technology, Mandi (IIT Mandi)', city: 'Mandi', state: 'Himachal Pradesh', established: 2009, ranking: 33, rating: 4.4, fees: 215000, placementMedian: 14.5, placementHighest: 70.0, cseCutoff: 2950, eeCutoff: 5800, meCutoff: 12000 },
  { name: 'Indian Institute of Technology, Gandhinagar (IIT Gandhinagar)', city: 'Gandhinagar', state: 'Gujarat', established: 2008, ranking: 18, rating: 4.5, fees: 220000, placementMedian: 15.2, placementHighest: 80.0, cseCutoff: 1550, eeCutoff: 3900, meCutoff: 7800 },
  { name: 'Indian Institute of Technology, Jodhpur (IIT Jodhpur)', city: 'Jodhpur', state: 'Rajasthan', established: 2008, ranking: 30, rating: 4.4, fees: 218000, placementMedian: 14.8, placementHighest: 78.0, cseCutoff: 2400, eeCutoff: 4900, meCutoff: 9500 },
  { name: 'Indian Institute of Technology, Patna (IIT Patna)', city: 'Patna', state: 'Bihar', established: 2008, ranking: 41, rating: 4.3, fees: 218000, placementMedian: 14.0, placementHighest: 82.0, cseCutoff: 2800, eeCutoff: 5500, meCutoff: 11000 },
  { name: 'Indian Institute of Technology, Bhubaneswar (IIT Bhubaneswar)', city: 'Bhubaneswar', state: 'Odisha', established: 2008, ranking: 47, rating: 4.3, fees: 210000, placementMedian: 13.8, placementHighest: 72.0, cseCutoff: 3100, eeCutoff: 5950, meCutoff: 11500 },
  { name: 'Indian Institute of Technology, Tirupati (IIT Tirupati)', city: 'Tirupati', state: 'Andhra Pradesh', established: 2015, ranking: 59, rating: 4.2, fees: 212000, placementMedian: 12.5, placementHighest: 65.0, cseCutoff: 3900, eeCutoff: 7200, meCutoff: 13500 },
  { name: 'Indian Institute of Technology, Palakkad (IIT Palakkad)', city: 'Palakkad', state: 'Kerala', established: 2015, ranking: 68, rating: 4.2, fees: 210000, placementMedian: 12.0, placementHighest: 60.0, cseCutoff: 4500, eeCutoff: 8100, meCutoff: 14200 },
  { name: 'Indian Institute of Technology, Dharwad (IIT Dharwad)', city: 'Dharwad', state: 'Karnataka', established: 2016, ranking: 93, rating: 4.1, fees: 215000, placementMedian: 11.5, placementHighest: 55.0, cseCutoff: 4900, eeCutoff: 8800, meCutoff: 15000 },
  { name: 'Indian Institute of Technology, Bhilai (IIT Bhilai)', city: 'Raipur', state: 'Chhattisgarh', established: 2016, ranking: 81, rating: 4.1, fees: 210000, placementMedian: 11.2, placementHighest: 52.0, cseCutoff: 5500, eeCutoff: 9400, meCutoff: 16000 },
  { name: 'Indian Institute of Technology, Goa (IIT Goa)', city: 'Ponda', state: 'Goa', established: 2016, ranking: 97, rating: 4.1, fees: 215000, placementMedian: 11.0, placementHighest: 50.0, cseCutoff: 4100, eeCutoff: 8500, meCutoff: 14500 },
  { name: 'Indian Institute of Technology, Jammu (IIT Jammu)', city: 'Jammu', state: 'Jammu & Kashmir', established: 2016, ranking: 101, rating: 4.0, fees: 210000, placementMedian: 10.8, placementHighest: 48.0, cseCutoff: 5800, eeCutoff: 9900, meCutoff: 17000 }
];

// Top NITs and IIITs
const nitsIiitsData = [
  { name: 'National Institute of Technology, Tiruchirappalli (NIT Trichy)', city: 'Tiruchirappalli', state: 'Tamil Nadu', established: 1964, ranking: 9, rating: 4.5, fees: 145000, placementMedian: 12.5, placementHighest: 52.0, cseCutoff: 1500, eeCutoff: 4500, meCutoff: 7500 },
  { name: 'National Institute of Technology, Surathkal (NIT Surathkal)', city: 'Surathkal', state: 'Karnataka', established: 1960, ranking: 12, rating: 4.5, fees: 150000, placementMedian: 13.0, placementHighest: 54.0, cseCutoff: 1800, eeCutoff: 4800, meCutoff: 8000 },
  { name: 'National Institute of Technology, Warangal (NIT Warangal)', city: 'Warangal', state: 'Telangana', established: 1959, ranking: 21, rating: 4.4, fees: 140000, placementMedian: 12.0, placementHighest: 50.0, cseCutoff: 2100, eeCutoff: 5200, meCutoff: 8500 },
  { name: 'Indian Institute of Information Technology, Allahabad (IIIT Allahabad)', city: 'Allahabad', state: 'Uttar Pradesh', established: 1999, ranking: 89, rating: 4.5, fees: 180000, placementMedian: 22.0, placementHighest: 102.5, cseCutoff: 4800, eeCutoff: 8500, meCutoff: 0 },
  { name: 'Indian Institute of Information Technology, Gwalior (IIIT Gwalior)', city: 'Gwalior', state: 'Madhya Pradesh', established: 1997, ranking: 98, rating: 4.3, fees: 175000, placementMedian: 16.5, placementHighest: 65.0, cseCutoff: 6500, eeCutoff: 11000, meCutoff: 0 }
];

// All 20 operating AIIMS
const aiimsData = [
  { name: 'All India Institute of Medical Sciences, New Delhi (AIIMS)', city: 'New Delhi', state: 'Delhi', established: 1956, ranking: 1, rating: 4.9, fees: 1628, placementMedian: 18.0, placementHighest: 35.0, neetCutoff: 50 },
  { name: 'All India Institute of Medical Sciences, Bhopal (AIIMS Bhopal)', city: 'Bhopal', state: 'Madhya Pradesh', established: 2012, ranking: 31, rating: 4.7, fees: 5856, placementMedian: 13.5, placementHighest: 25.0, neetCutoff: 580 },
  { name: 'All India Institute of Medical Sciences, Bhubaneswar (AIIMS Bhubaneswar)', city: 'Bhubaneswar', state: 'Odisha', established: 2012, ranking: 17, rating: 4.7, fees: 5856, placementMedian: 14.0, placementHighest: 28.0, neetCutoff: 490 },
  { name: 'All India Institute of Medical Sciences, Jodhpur (AIIMS Jodhpur)', city: 'Jodhpur', state: 'Rajasthan', established: 2012, ranking: 13, rating: 4.8, fees: 5856, placementMedian: 14.5, placementHighest: 30.0, neetCutoff: 450 },
  { name: 'All India Institute of Medical Sciences, Patna (AIIMS Patna)', city: 'Patna', state: 'Bihar', established: 2012, ranking: 27, rating: 4.6, fees: 5856, placementMedian: 13.0, placementHighest: 24.0, neetCutoff: 1200 },
  { name: 'All India Institute of Medical Sciences, Raipur (AIIMS Raipur)', city: 'Raipur', state: 'Chhattisgarh', established: 2012, ranking: 39, rating: 4.6, fees: 5856, placementMedian: 12.8, placementHighest: 23.0, neetCutoff: 1100 },
  { name: 'All India Institute of Medical Sciences, Rishikesh (AIIMS Rishikesh)', city: 'Rishikesh', state: 'Uttarakhand', established: 2012, ranking: 22, rating: 4.7, fees: 5856, placementMedian: 13.8, placementHighest: 26.0, neetCutoff: 750 },
  { name: 'All India Institute of Medical Sciences, Nagpur (AIIMS Nagpur)', city: 'Nagpur', state: 'Maharashtra', established: 2018, ranking: 50, rating: 4.5, fees: 5856, placementMedian: 11.5, placementHighest: 20.0, neetCutoff: 950 },
  { name: 'All India Institute of Medical Sciences, Mangalagiri (AIIMS Mangalagiri)', city: 'Guntur', state: 'Andhra Pradesh', established: 2018, ranking: 60, rating: 4.5, fees: 5856, placementMedian: 11.0, placementHighest: 18.0, neetCutoff: 1400 },
  { name: 'All India Institute of Medical Sciences, Gorakhpur (AIIMS Gorakhpur)', city: 'Gorakhpur', state: 'Uttar Pradesh', established: 2019, ranking: 72, rating: 4.4, fees: 5856, placementMedian: 10.5, placementHighest: 17.0, neetCutoff: 2200 },
  { name: 'All India Institute of Medical Sciences, Kalyani (AIIMS Kalyani)', city: 'Kalyani', state: 'West Bengal', established: 2019, ranking: 65, rating: 4.4, fees: 5856, placementMedian: 10.8, placementHighest: 17.5, neetCutoff: 1900 },
  { name: 'All India Institute of Medical Sciences, Bathinda (AIIMS Bathinda)', city: 'Bathinda', state: 'Punjab', established: 2019, ranking: 78, rating: 4.4, fees: 5856, placementMedian: 10.5, placementHighest: 16.5, neetCutoff: 1800 },
  { name: 'All India Institute of Medical Sciences, Guwahati (AIIMS Guwahati)', city: 'Guwahati', state: 'Assam', established: 2020, ranking: 95, rating: 4.3, fees: 5856, placementMedian: 9.8, placementHighest: 15.0, neetCutoff: 2800 },
  { name: 'All India Institute of Medical Sciences, Rajkot (AIIMS Rajkot)', city: 'Rajkot', state: 'Gujarat', established: 2020, ranking: 85, rating: 4.3, fees: 5856, placementMedian: 10.0, placementHighest: 16.0, neetCutoff: 2500 },
  { name: 'All India Institute of Medical Sciences, Bilaspur (AIIMS Bilaspur)', city: 'Bilaspur', state: 'Himachal Pradesh', established: 2020, ranking: 90, rating: 4.3, fees: 5856, placementMedian: 9.8, placementHighest: 15.5, neetCutoff: 2700 },
  { name: 'All India Institute of Medical Sciences, Deoghar (AIIMS Deoghar)', city: 'Deoghar', state: 'Jharkhand', established: 2019, ranking: 98, rating: 4.3, fees: 5856, placementMedian: 9.5, placementHighest: 15.0, neetCutoff: 3100 },
  { name: 'All India Institute of Medical Sciences, Jammu (AIIMS Jammu)', city: 'Vijaypur', state: 'Jammu & Kashmir', established: 2020, ranking: 105, rating: 4.2, fees: 5856, placementMedian: 9.2, placementHighest: 14.5, neetCutoff: 3800 },
  { name: 'All India Institute of Medical Sciences, Madurai (AIIMS Madurai)', city: 'Madurai', state: 'Tamil Nadu', established: 2021, ranking: 120, rating: 4.1, fees: 5856, placementMedian: 9.0, placementHighest: 14.0, neetCutoff: 4500 },
  { name: 'All India Institute of Medical Sciences, Bibinagar (AIIMS Bibinagar)', city: 'Bibinagar', state: 'Telangana', established: 2019, ranking: 102, rating: 4.3, fees: 5856, placementMedian: 9.5, placementHighest: 15.0, neetCutoff: 3300 },
  { name: 'All India Institute of Medical Sciences, Rae Bareli (AIIMS Rae Bareli)', city: 'Raebareli', state: 'Uttar Pradesh', established: 2013, ranking: 80, rating: 4.4, fees: 5856, placementMedian: 10.5, placementHighest: 17.0, neetCutoff: 2400 }
];

// Top Management Colleges (IIMs, FMS, XLRI)
const managementData = [
  { name: 'Indian Institute of Management, Ahmedabad (IIM Ahmedabad)', city: 'Ahmedabad', state: 'Gujarat', established: 1961, ranking: 1, rating: 4.9, fees: 1250000, placementMedian: 31.5, placementHighest: 115.0, catCutoff: 99 },
  { name: 'Indian Institute of Management, Bangalore (IIM Bangalore)', city: 'Bengaluru', state: 'Karnataka', established: 1973, ranking: 2, rating: 4.9, fees: 1225000, placementMedian: 30.0, placementHighest: 105.0, catCutoff: 99 },
  { name: 'Indian Institute of Management, Calcutta (IIM Calcutta)', city: 'Kolkata', state: 'West Bengal', established: 1961, ranking: 3, rating: 4.8, fees: 1200000, placementMedian: 31.0, placementHighest: 110.0, catCutoff: 99 },
  { name: 'Indian Institute of Management, Lucknow (IIM Lucknow)', city: 'Lucknow', state: 'Uttar Pradesh', established: 1984, ranking: 6, rating: 4.7, fees: 1075000, placementMedian: 28.0, placementHighest: 85.0, catCutoff: 98 },
  { name: 'Indian Institute of Management, Kozhikode (IIM Kozhikode)', city: 'Kozhikode', state: 'Kerala', established: 1996, ranking: 5, rating: 4.7, fees: 1025000, placementMedian: 26.5, placementHighest: 72.8, catCutoff: 97 },
  { name: 'Indian Institute of Management, Indore (IIM Indore)', city: 'Indore', state: 'Madhya Pradesh', established: 1996, ranking: 8, rating: 4.6, fees: 1050000, placementMedian: 25.8, placementHighest: 70.0, catCutoff: 97 },
  { name: 'XLRI - Xavier School of Management (XLRI Jamshedpur)', city: 'Jamshedpur', state: 'Jharkhand', established: 1949, ranking: 9, rating: 4.7, fees: 1290000, placementMedian: 28.0, placementHighest: 78.2, catCutoff: 96 },
  { name: 'Faculty of Management Studies, Delhi University (FMS Delhi)', city: 'New Delhi', state: 'Delhi', established: 1954, ranking: 35, rating: 4.8, fees: 100000, placementMedian: 30.0, placementHighest: 58.0, catCutoff: 98 }
];

const engineeringCovers = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80'
];

const medicalCovers = [
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80'
];

const managementCovers = [
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80'
];

async function main() {
  console.log('Clearing database...');
  await prisma.discussionAnswer.deleteMany({});
  await prisma.discussionQuestion.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cutoff.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.resource.deleteMany({});

  console.log('Seeding IITs...');
  for (let i = 0; i < iitsData.length; i++) {
    const iit = iitsData[i];
    await prisma.college.create({
      data: {
        name: iit.name,
        logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=60',
        coverUrl: engineeringCovers[i % engineeringCovers.length],
        city: iit.city,
        state: iit.state,
        established: iit.established,
        type: 'Government',
        rating: iit.rating,
        fees: iit.fees,
        placementMedian: iit.placementMedian,
        placementHighest: iit.placementHighest,
        ranking: iit.ranking,
        domain: 'Engineering',
        overview: `${iit.name} is a premier public technical and research university located in ${iit.city}, ${iit.state}. Established in ${iit.established}, it is recognized globally for its academic excellence, cutting-edge research, and strong placement records, attracting top ranks from JEE Advanced every year.`,
        courses: {
          create: [
            { name: 'B.Tech Computer Science and Engineering', duration: '4 Years', fees: iit.fees + 5000, eligibility: 'Class 12 with 75% marks + JEE Advanced Rank' },
            { name: 'B.Tech Electrical Engineering', duration: '4 Years', fees: iit.fees + 5000, eligibility: 'Class 12 with 75% marks + JEE Advanced Rank' },
            { name: 'B.Tech Mechanical Engineering', duration: '4 Years', fees: iit.fees + 5000, eligibility: 'Class 12 with 75% marks + JEE Advanced Rank' }
          ]
        },
        placements: {
          create: [
            { year: 2024, averagePackage: Math.round(iit.placementMedian * 1.15 * 10) / 10, highestPackage: iit.placementHighest, topRecruiters: 'Google, Microsoft, Goldman Sachs, Uber, Apple, McKinsey, Texas Instruments' }
          ]
        },
        reviews: {
          create: [
            { userName: 'Aravind K.', rating: iit.rating, comment: `Phenomenal exposure and competitive coding culture at ${iit.city} campus. Highly recommended!` },
            { userName: 'Rohit Sharma', rating: iit.rating - 0.2, comment: 'Academic coursework is rigorous but placement cell prep prepares you extremely well.' }
          ]
        },
        cutoffs: {
          create: [
            { exam: 'JEE Advanced', category: 'General', quota: 'All India', courseName: 'Computer Science and Engineering', closingRank: iit.cseCutoff },
            { exam: 'JEE Advanced', category: 'General', quota: 'All India', courseName: 'Electrical Engineering', closingRank: iit.eeCutoff },
            { exam: 'JEE Advanced', category: 'General', quota: 'All India', courseName: 'Mechanical Engineering', closingRank: iit.meCutoff }
          ]
        },
        scholarships: {
          create: [
            { name: 'Merit-cum-Means (MCM) Scholarship', amount: 50000, description: 'Tuition fee waiver and monthly allowance for students with parental income below Rs. 4.5 LPA.' },
            { name: 'Institute Free Studentship', amount: 90000, description: '100% tuition fee exemption for SC/ST/PwD engineering students.' }
          ]
        }
      }
    });
  }

  console.log('Seeding NITs and IIITs...');
  for (let i = 0; i < nitsIiitsData.length; i++) {
    const nit = nitsIiitsData[i];
    await prisma.college.create({
      data: {
        name: nit.name,
        logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=60',
        coverUrl: engineeringCovers[(i + 3) % engineeringCovers.length],
        city: nit.city,
        state: nit.state,
        established: nit.established,
        type: 'Government',
        rating: nit.rating,
        fees: nit.fees,
        placementMedian: nit.placementMedian,
        placementHighest: nit.placementHighest,
        ranking: nit.ranking,
        domain: 'Engineering',
        overview: `${nit.name} is a top-tier public technical institution in ${nit.city}, ${nit.state}. Renowned for high academic standards and consistent performance in placements, it remains a prime choice for students qualifying through JEE Mains.`,
        courses: {
          create: [
            { name: 'B.Tech Computer Science and Engineering', duration: '4 Years', fees: nit.fees + 5000, eligibility: 'Class 12 with 75% marks + JEE Main Rank' },
            { name: 'B.Tech Electronics and Communication Engineering', duration: '4 Years', fees: nit.fees + 5000, eligibility: 'Class 12 with 75% marks + JEE Main Rank' }
          ]
        },
        placements: {
          create: [
            { year: 2024, averagePackage: Math.round(nit.placementMedian * 1.12 * 10) / 10, highestPackage: nit.placementHighest, topRecruiters: 'Amazon, Microsoft, Qualcomm, Nvidia, Oracle, Samsung, Cisco' }
          ]
        },
        reviews: {
          create: [
            { userName: 'Aditya Sen', rating: nit.rating, comment: 'Sprawling campus, excellent sports facilities, and strong coding environment.' }
          ]
        },
        cutoffs: {
          create: [
            { exam: 'JEE Main', category: 'General', quota: 'All India', courseName: 'Computer Science and Engineering', closingRank: nit.cseCutoff },
            { exam: 'JEE Main', category: 'General', quota: 'All India', courseName: 'Electronics and Communication Engineering', closingRank: nit.eeCutoff }
          ]
        },
        scholarships: {
          create: [
            { name: 'OP Jindal Engineering Scholarship', amount: 80000, description: 'Awarded to top merit rank holders across disciplines based on academic criteria.' }
          ]
        }
      }
    });
  }

  console.log('Seeding AIIMS...');
  for (let i = 0; i < aiimsData.length; i++) {
    const med = aiimsData[i];
    await prisma.college.create({
      data: {
        name: med.name,
        logoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=60',
        coverUrl: medicalCovers[i % medicalCovers.length],
        city: med.city,
        state: med.state,
        established: med.established,
        type: 'Government',
        rating: med.rating,
        fees: med.fees,
        placementMedian: med.placementMedian,
        placementHighest: med.placementHighest,
        ranking: med.ranking,
        domain: 'Medical',
        overview: `${med.name} is a premier public medical institution and hospital located in ${med.city}, ${med.state}. Established in ${med.established}, it offers elite clinical exposure, heavily subsidized educational fees, and high-standard medical training under NEET counselling.`,
        courses: {
          create: [
            { name: 'MBBS (Bachelor of Medicine and Bachelor of Surgery)', duration: '5.5 Years', fees: med.fees, eligibility: 'Class 12 with PCB 50% + NEET Rank' }
          ]
        },
        placements: {
          create: [
            { year: 2024, averagePackage: Math.round(med.placementMedian * 1.1 * 10) / 10, highestPackage: med.placementHighest, topRecruiters: 'Apollo Hospitals, Fortis Healthcare, Max Healthcare, Medanta, AIIMS Residency Programs' }
          ]
        },
        reviews: {
          create: [
            { userName: 'Dr. Vivek Roy', rating: med.rating, comment: `Unbeatable clinical experience. The patient flow at ${med.city} provides unmatched learning.` }
          ]
        },
        cutoffs: {
          create: [
            { exam: 'NEET', category: 'General', quota: 'All India', courseName: 'MBBS', closingRank: med.neetCutoff }
          ]
        },
        scholarships: {
          create: [
            { name: 'Need-based Financial Exemption', amount: 1600, description: '100% waiver of tuition and hostel fees for candidates from low-income families.' }
          ]
        }
      }
    });
  }

  console.log('Seeding Management Colleges...');
  for (let i = 0; i < managementData.length; i++) {
    const mba = managementData[i];
    await prisma.college.create({
      data: {
        name: mba.name,
        logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=60',
        coverUrl: managementCovers[i % managementCovers.length],
        city: mba.city,
        state: mba.state,
        established: mba.established,
        type: mba.name.includes('XLRI') ? 'Private' : 'Government',
        rating: mba.rating,
        fees: mba.fees,
        placementMedian: mba.placementMedian,
        placementHighest: mba.placementHighest,
        ranking: mba.ranking,
        domain: 'Management',
        overview: `${mba.name} is a premier post-graduate management school located in ${mba.city}, ${mba.state}. Founded in ${mba.established}, it represents the pinnacle of business leadership, research, and corporate consulting in India, admitting candidates through CAT/XAT.`,
        courses: {
          create: [
            { name: 'MBA / Post Graduate Programme in Management (PGP)', duration: '2 Years', fees: mba.fees, eligibility: 'Graduate Degree with 50% marks + CAT Percentile Cutoff' },
            { name: 'Executive MBA (PGPX)', duration: '1 Year', fees: mba.fees + 200000, eligibility: 'Graduation + 5 Years work experience + GMAT/GRE' }
          ]
        },
        placements: {
          create: [
            { year: 2024, averagePackage: Math.round(mba.placementMedian * 1.1 * 10) / 10, highestPackage: mba.placementHighest, topRecruiters: 'McKinsey, BCG, Brain & Co, Goldman Sachs, JP Morgan, TAS, HUL, Microsoft' }
          ]
        },
        reviews: {
          create: [
            { userName: 'Ananya Goel', rating: mba.rating, comment: 'World-class case-based learning. Peer group is exceptional, placements are legendary.' }
          ]
        },
        cutoffs: {
          create: [
            { exam: 'CAT', category: 'General', quota: 'All India', courseName: 'MBA / Post Graduate Programme in Management (PGP)', closingRank: mba.catCutoff }
          ]
        },
        scholarships: {
          create: [
            { name: 'Need-Based Financial Assistance (NBFA)', amount: 400000, description: 'Partial or full tuition fee waivers for MBA candidates based on family financial profiles.' },
            { name: 'Aditya Birla Scholarship', amount: 175000, description: 'Merit scholarship awarded to top PGP students on entering selected top management institutes.' }
          ]
        }
      }
    });
  }

  console.log('Seeding other prominent colleges (BITS, DTU, VIT)...');
  
  // BITS Pilani
  await prisma.college.create({
    data: {
      name: 'Birla Institute of Technology and Science, Pilani (BITS Pilani)',
      logoUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=150&auto=format&fit=crop&q=60',
      coverUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80',
      city: 'Pilani',
      state: 'Rajasthan',
      established: 1964,
      type: 'Private',
      rating: 4.6,
      fees: 550000,
      placementMedian: 16.5,
      placementHighest: 60.7,
      ranking: 25,
      domain: 'Engineering',
      overview: 'BITS Pilani is a private deemed university focused primarily on higher education and research in engineering and sciences. Operating on a unique "Zero Attendance Policy" and featuring a dual degree system, BITS Pilani commands a stellar reputation on par with the top IITs.',
      courses: {
        create: [
          { name: 'B.E. Computer Science', duration: '4 Years', fees: 560000, eligibility: 'Class 12 with PCM 75% + BITSAT Score' },
          { name: 'B.E. Electronics and Communication', duration: '4 Years', fees: 560000, eligibility: 'Class 12 with PCM 75% + BITSAT Score' }
        ]
      },
      placements: {
        create: [
          { year: 2024, averagePackage: 18.2, highestPackage: 60.7, topRecruiters: 'Uber, Nutanix, Cisco, Oracle, Apple, Barclays, DE Shaw' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Varun Joshi', rating: 4.7, comment: 'No attendance policy gives you the ultimate freedom to learn and pursue side projects, startups, or coding. Alumni network is incredible.' }
        ]
      },
      cutoffs: {
        create: [
          { exam: 'BITSAT', category: 'General', quota: 'All India', courseName: 'Computer Science', closingRank: 320 },
          { exam: 'BITSAT', category: 'General', quota: 'All India', courseName: 'Electronics and Communication', closingRank: 285 }
        ]
      },
      scholarships: {
        create: [
          { name: 'BITS Merit-cum-Need (MCN) Scholarship', amount: 150000, description: 'Up to 80% tuition fee waiver for candidates with CGPA above 6.0 and family income criteria.' }
        ]
      }
    }
  });

  // DTU
  await prisma.college.create({
    data: {
      name: 'Delhi Technological University (DTU)',
      logoUrl: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=150&auto=format&fit=crop&q=60',
      coverUrl: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=1200&auto=format&fit=crop&q=80',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1941,
      type: 'Government',
      rating: 4.4,
      fees: 219000,
      placementMedian: 13.0,
      placementHighest: 82.5,
      ranking: 29,
      domain: 'Engineering',
      overview: 'Delhi Technological University (formerly Delhi College of Engineering - DCE) is a premier state government university in Delhi. It is historic and highly regarded for engineering, with high placement packages and a massive campus in Rohini, Delhi.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science and Engineering', duration: '4 Years', fees: 229000, eligibility: 'Class 12 with 60% + JEE Main Rank' },
          { name: 'B.Tech Software Engineering', duration: '4 Years', fees: 229000, eligibility: 'Class 12 with 60% + JEE Main Rank' }
        ]
      },
      placements: {
        create: [
          { year: 2024, averagePackage: 15.1, highestPackage: 82.5, topRecruiters: 'Microsoft, Amazon, Adobe, Paytm, Sprinklr, Salesforce' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Nikhil Goel', rating: 4.5, comment: 'DTU has an amazing brand value in Delhi. Placements for tech branches are almost 100%. Hostels are decent, and college life is fun.' }
        ]
      },
      cutoffs: {
        create: [
          { exam: 'JEE Main', category: 'General', quota: 'Home State', courseName: 'Computer Science and Engineering', closingRank: 12000 },
          { exam: 'JEE Main', category: 'General', quota: 'Other State', courseName: 'Computer Science and Engineering', closingRank: 6000 }
        ]
      },
      scholarships: {
        create: [
          { name: 'Delhi State Post Matric Scholarship', amount: 50000, description: 'Tuition fees reimbursement for students belonging to minority backgrounds under state rules.' }
        ]
      }
    }
  });

  // VIT Vellore
  await prisma.college.create({
    data: {
      name: 'Vellore Institute of Technology, Vellore (VIT Vellore)',
      logoUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=150&auto=format&fit=crop&q=60',
      coverUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=1200&auto=format&fit=crop&q=80',
      city: 'Vellore',
      state: 'Tamil Nadu',
      established: 1984,
      type: 'Private',
      rating: 4.2,
      fees: 198000,
      placementMedian: 9.0,
      placementHighest: 102.0,
      ranking: 11,
      domain: 'Engineering',
      overview: 'Vellore Institute of Technology (VIT) is a top private research deemed university in Vellore, Tamil Nadu. Known for its massive student intake, excellent infrastructure, and strong placement cell, it offers various engineering programs with flexible credit systems.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science and Engineering', duration: '4 Years', fees: 198000, eligibility: 'Class 12 with 60% + VITEEE Rank' }
        ]
      },
      placements: {
        create: [
          { year: 2024, averagePackage: 9.5, highestPackage: 102.0, topRecruiters: 'Cognizant, Wipro, TCS, Infosys, Intel, Amazon' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Anjali Nair', rating: 4.0, comment: 'The campus is huge and has all modern amenities. Placement opportunities are abundant, although competition is fierce due to the high student strength.' }
        ]
      },
      cutoffs: {
        create: [
          { exam: 'VITEEE', category: 'General', quota: 'All India', courseName: 'Computer Science and Engineering', closingRank: 2000 }
        ]
      },
      scholarships: {
        create: [
          { name: 'VIT Ignited Minds Scholarship', amount: 100000, description: '100% tuition waiver for central/state board rank holders and top VITEEE scorers.' }
        ]
      }
    }
  });

  console.log('Seeding Exams table...');
  const exams = [
    {
      name: 'JEE Main',
      description: 'Joint Entrance Examination Main (JEE Main) is the premier national-level test for admissions to undergraduate engineering courses in NITs, IIITs, DTU, and other state-sponsored institutions.',
      registrationDate: 'November 2026 - January 2027',
      examDate: 'January 2027 (Session 1), April 2027 (Session 2)',
      eligibility: 'Class 12 qualification with Physics, Chemistry, and Mathematics (PCM). Minimum 75% marks required for NIT/IIIT admissions.',
      syllabus: 'Physics, Chemistry, and Mathematics (based on Class 11 and 12 NCERT curriculum).'
    },
    {
      name: 'JEE Advanced',
      description: 'Joint Entrance Examination Advanced is the entrance test for admissions to undergraduate engineering courses at all 23 IITs. Candidates must qualify JEE Main and rank in the top 2.5 Lakhs.',
      registrationDate: 'April 2027',
      examDate: 'May 2027',
      eligibility: 'Top 2,50,000 qualifiers of JEE Main, holding PCM in Class 12 and passing with required marks.',
      syllabus: 'Advanced-level Physics, Chemistry, and Mathematics concepts.'
    },
    {
      name: 'NEET',
      description: 'National Eligibility cum Entrance Test (NEET) is the single entrance examination for admission to MBBS, BDS, and other medical courses across government and private medical schools, including AIIMS.',
      registrationDate: 'February 2027 - March 2027',
      examDate: 'May 2027',
      eligibility: 'Class 12 with Physics, Chemistry, Biology/Biotechnology (PCB) and English. Minimum 50% aggregate marks for General category.',
      syllabus: 'Physics, Chemistry, and Biology (Zoology & Botany) topics based on Class 11 & 12 NCERT.'
    },
    {
      name: 'CAT',
      description: 'Common Admission Test (CAT) is a computer-based management aptitude test conducted annually for admission to MBA, PGDM, and other post-graduate management programs in all 21 IIMs and other top institutions.',
      registrationDate: 'August 2026 - September 2026',
      examDate: 'November 2026',
      eligibility: 'Graduation degree in any stream with a minimum of 50% marks (45% for SC/ST/PwD). Final-year candidates can also apply.',
      syllabus: 'Quantitative Aptitude, Data Interpretation & Logical Reasoning (DILR), and Verbal Ability & Reading Comprehension (VARC).'
    },
    {
      name: 'BITSAT',
      description: 'BITS Admission Test (BITSAT) is a university-level computer-based online test conducted by BITS Pilani for admissions to integrated first-degree engineering programs across its 3 campuses.',
      registrationDate: 'January 2027 - April 2027',
      examDate: 'May 2027 (Session 1), June 2027 (Session 2)',
      eligibility: 'Class 12 with Physics, Chemistry, Mathematics (PCM) and English, obtaining at least 75% in PCM aggregate with 60% in each subject.',
      syllabus: 'Physics, Chemistry, Mathematics, English Proficiency, and Logical Reasoning.'
    }
  ];

  for (const exam of exams) {
    await prisma.exam.create({ data: exam });
  }

  console.log('Seeding Resources table...');
  const resources = [
    {
      title: 'A Comprehensive Study Guide to Crack JEE Advanced Physics',
      category: 'Preparation Guide',
      description: 'Master mechanics, electrodynamics, and modern physics with curated books recommendations, daily mock schedules, and dynamic formula sheets.',
      link: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=100'
    },
    {
      title: 'NEET 2027 Biology: Key Revision Chapters and Cheat-sheets',
      category: 'Revision Material',
      description: 'A summary checklist covering human physiology, genetics, ecology, and plant kingdoms, focusing on high-weightage topics from NCERT.',
      link: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100'
    },
    {
      title: 'CAT DILR Mock Test Booklet & Answer Explanations',
      category: 'Practice Tests',
      description: 'Includes 10 sectional tests on data interpretation and logical reasoning (puzzles, grid arrangements, matrix sets) with stepwise solutions.',
      link: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100'
    },
    {
      title: 'Guide to Scholarships and Financial Aid in Top Indian Universities',
      category: 'Financial Guide',
      description: 'Walks through state and central portals (NSP, INSPIRE, MCM) to check eligibility criteria and check checklist items for document submissions.',
      link: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100'
    }
  ];

  for (const res of resources) {
    await prisma.resource.create({ data: res });
  }

  console.log('Seeding discussions board...');

  const q1 = await prisma.discussionQuestion.create({
    data: {
      userName: 'Aman Verma',
      title: 'Is BITS Pilani CSE worth the high fees compared to NIT Trichy CSE?',
      content: 'I got BITS Pilani CSE in iterations and also have NIT Trichy CSE. BITS fees are around 25 Lakhs total, while NIT is around 6-7 Lakhs. Is it worth paying the extra amount for BITS?',
      answers: {
        create: [
          {
            userName: 'Siddharth Rao',
            content: 'If you have a strong financial background, BITS Pilani CSE is definitely worth it for the zero attendance policy, start-up culture, and stellar alumni network. However, NIT Trichy CSE is an incredible option at a fraction of the price. If it requires a heavy education loan, go for NIT Trichy.'
          },
          {
            userName: 'Amit Mishra',
            content: 'NIT Trichy CSE is the #1 NIT, and recruiters treat it at par with top IITs. Unless you are specifically looking for the BITS startup ecosystem and can easily afford it, NIT Trichy is a smarter financial choice.'
          }
        ]
      }
    }
  });

  const q2 = await prisma.discussionQuestion.create({
    data: {
      userName: 'Preeti Das',
      title: 'What is the minimum JEE Advanced rank required for IIT Bombay CSE?',
      content: 'I am aiming for IIT Bombay CSE. I am a female candidate from the General category. What closing ranks should I target in JEE Advanced?',
      answers: {
        create: [
          {
            userName: 'IITian Alok',
            content: 'For the General (Male) category, the closing rank is usually under 60-70. For the General (Female) category, because of female supernumerary seats, the closing rank extends to around 250-300. Target a score of 280+ out of 360 to be safe.'
          }
        ]
      }
    }
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
