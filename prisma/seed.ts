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

// Unsplash cover photos rotation for engineering and medical
const engineeringCovers = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607237138185-eedd996e5b09?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80'
];

const medicalCovers = [
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80'
];

async function main() {
  console.log('Clearing database...');
  await prisma.discussionAnswer.deleteMany({});
  await prisma.discussionQuestion.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cutoff.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});

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
            { exam: 'JEE Advanced', category: 'General', quota: 'All India', courseName: 'Mechanical Engineering', closingRank: iit.meCutoff },
            { exam: 'JEE Advanced', category: 'OBC', quota: 'All India', courseName: 'Computer Science and Engineering', closingRank: Math.round(iit.cseCutoff * 0.7) }
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
            { userName: 'Dr. Vivek Roy', rating: med.rating, comment: `Unbeatable clinical experience. The patient flow at ${med.city} provides unmatched learning.` },
            { userName: 'Dr. Shruti Sen', rating: med.rating - 0.1, comment: 'Extremely good research environment and peer group. Hostel facilities are top notch.' }
          ]
        },
        cutoffs: {
          create: [
            { exam: 'NEET', category: 'General', quota: 'All India', courseName: 'MBBS', closingRank: med.neetCutoff },
            { exam: 'NEET', category: 'OBC', quota: 'All India', courseName: 'MBBS', closingRank: Math.round(med.neetCutoff * 1.5) }
          ]
        }
      }
    });
  }

  console.log('Seeding other prominent colleges (NIT, BITS, DTU, VIT)...');
  
  // NIT Trichy
  await prisma.college.create({
    data: {
      name: 'National Institute of Technology, Tiruchirappalli (NIT Trichy)',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=60',
      coverUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      established: 1964,
      type: 'Government',
      rating: 4.5,
      fees: 145000,
      placementMedian: 12.5,
      placementHighest: 52.0,
      ranking: 9,
      overview: 'National Institute of Technology Tiruchirappalli is a public technical university of national importance. It is consistently ranked as the #1 NIT in India, renowned for its academic rigor, sprawling 800-acre campus, and exceptional placement statistics across all engineering departments.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science and Engineering', duration: '4 Years', fees: 150000, eligibility: 'Class 12 with 75% + JEE Main Rank' },
          { name: 'B.Tech Electronics and Communication Engineering', duration: '4 Years', fees: 150000, eligibility: 'Class 12 with 75% + JEE Main Rank' }
        ]
      },
      placements: {
        create: [
          { year: 2024, averagePackage: 15.6, highestPackage: 52.0, topRecruiters: 'Amazon, Microsoft, Nvidia, Qualcomm, Morgan Stanley, L&T' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Kartik Iyer', rating: 4.4, comment: 'Festember and Pragyan are two of the biggest festivals in South India. Campus life is amazing, though weather gets hot!' }
        ]
      },
      cutoffs: {
        create: [
          { exam: 'JEE Main', category: 'General', quota: 'Other State', courseName: 'Computer Science and Engineering', closingRank: 1500 },
          { exam: 'JEE Main', category: 'General', quota: 'Home State', courseName: 'Computer Science and Engineering', closingRank: 4500 },
          { exam: 'JEE Main', category: 'OBC', quota: 'Other State', courseName: 'Computer Science and Engineering', closingRank: 600 }
        ]
      }
    }
  });

  // BITS Pilani
  await prisma.college.create({
    data: {
      name: 'Birla Institute of Technology and Science, Pilani (BITS Pilani)',
      logoUrl: 'https://images.unsplash.com/photo-1607237138185-eedd996e5b09?w=150&auto=format&fit=crop&q=60',
      coverUrl: 'https://images.unsplash.com/photo-1607237138185-eedd996e5b09?w=1200&auto=format&fit=crop&q=80',
      city: 'Pilani',
      state: 'Rajasthan',
      established: 1964,
      type: 'Private',
      rating: 4.6,
      fees: 550000,
      placementMedian: 16.5,
      placementHighest: 60.7,
      ranking: 25,
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
      }
    }
  });

  // DTU
  await prisma.college.create({
    data: {
      name: 'Delhi Technological University (DTU)',
      logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=60',
      coverUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1941,
      type: 'Government',
      rating: 4.4,
      fees: 219000,
      placementMedian: 13.0,
      placementHighest: 82.5,
      ranking: 29,
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
      }
    }
  });

  console.log('Seeding discussion board...');

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
