export const profile = {
  name: 'Christian Bantayao',
  degree: 'BSIT Student | Cybersecurity',
  year: '4th Year',
  university: 'Surigao del Norte State University',
  email: 'christianbantayao@gmail.com',
  github: 'https://github.com/christianbantayao',
  linkedin: '',
  portfolio: 'This portfolio',
};

export const sections = ['Home', 'About', 'Skills', 'Projects', 'Education', 'Contact'];

export const skills = [
  { title: 'Cybersecurity', icon: 'ShieldCheck', items: ['Threat analysis', 'Vulnerability assessment', 'Access control', 'Security policies', 'Security fundamentals'], level: 85 },
  { title: 'Network Security', icon: 'Network', items: ['VLAN configuration', 'ACL implementation', 'Routing & switching', 'Network monitoring', 'Network segmentation'], level: 80 },
  { title: 'Linux & Systems', icon: 'TerminalSquare', items: ['Ubuntu', 'Kali Linux', 'Command line', 'Apache', 'MySQL'], level: 80 },
  { title: 'Web Development', icon: 'Code2', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'PHP'], level: 75 },
  { title: 'Database Management', icon: 'Database', items: ['MySQL', 'SQL queries', 'Normalization', 'Database design', 'Data security'], level: 75 },
  { title: 'Security Tools', icon: 'Wrench', items: ['Cisco Packet Tracer', 'Wireshark', 'Burp Suite', 'Nmap', 'Git', 'GitHub'], level: 70 },
];

export const projects = [
  { number: '01', title: 'Teacher–Room Tracking System', category: 'Full stack application', description: 'Real-time teacher attendance and classroom monitoring with schedules, room assignments, attendance logs, GPS and QR validation.', tags: ['React', 'Node.js', 'MySQL', 'JavaScript', 'Bootstrap'], visual: 'schedule' },
  { number: '02', title: 'Attendance Monitoring Dashboard', category: 'Analytics dashboard', description: 'A web dashboard for attendance reports, schedules, teacher status, and clear, actionable analytics.', tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'], visual: 'dashboard' },
  { number: '03', title: 'Network Security Lab', category: 'Network simulation', description: 'A secure network simulation using VLANs, ACLs, routing, server isolation, and access policies in Cisco Packet Tracer.', tags: ['Packet Tracer', 'VLAN', 'ACL', 'Networking', 'Linux'], visual: 'network' },
];

export const certifications = [
  { name: 'Networking Fundamentals', status: 'Completed' },
  { name: 'Web Security', status: 'In progress' },
  { name: 'Linux Administration', status: 'In progress' },
  { name: 'Database Systems', status: 'Completed' },
];

export const tools = ['HTML / CSS', 'JavaScript', 'PHP', 'MySQL', 'React', 'Node.js', 'Linux', 'Packet Tracer', 'Git', 'GitHub', 'Wireshark', 'Burp Suite'];

export const projectCaseStudies = {
  'teacher-room-tracking': {
    number: '01',
    screenshotUrl: null,
    sourceUrl: null,
    demoUrl: null,
    problem: 'Teacher schedules, room assignments, and attendance records need to stay connected so staff can see who is assigned where and review attendance in one place.',
    approach: ['Organize schedules, room assignments, and attendance logs in one workflow.', 'Include QR and GPS validation in the attendance process described for the project.', 'Present current status and historical records in a dashboard for quick review.'],
    learning: 'This project brings interface design, application logic, and database records together around a real operational workflow.',
    visualCaption: 'Illustrative interface preview based on the project description. An original application screenshot has not been supplied.',
  },
  'attendance-dashboard': {
    number: '02',
    screenshotUrl: null,
    sourceUrl: null,
    demoUrl: null,
    problem: 'Attendance data is harder to use when reports, schedules, and current teacher status are spread across separate views.',
    approach: ['Bring attendance reports, schedules, and teacher status into a single dashboard.', 'Use summaries and charts to make changes and exceptions easier to notice.', 'Let a reviewer move from an overview toward individual records.'],
    learning: 'The focus is on turning stored attendance records into information a person can scan and use.',
    visualCaption: 'Illustrative dashboard preview based on the project description. An original application screenshot has not been supplied.',
  },
  'network-security-lab': {
    number: '03',
    screenshotUrl: null,
    sourceUrl: null,
    demoUrl: null,
    problem: 'A shared network needs boundaries between groups and services so access follows a deliberate policy.',
    approach: ['Split the simulated network into VLANs and define routing between them.', 'Use ACLs and access policies to control which segments can reach protected services.', 'Keep servers isolated in the topology and review traffic flow across the boundaries.'],
    learning: 'The simulation connects network design decisions with the access rules that enforce them.',
    visualCaption: 'Illustrative topology based on the project description. A Packet Tracer capture has not been supplied.',
  },
};

export const projectSlug = project => Object.keys(projectCaseStudies).find(slug => projectCaseStudies[slug].number === project.number);
