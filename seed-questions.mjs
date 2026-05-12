/**
 * EduRank — Seed Questions Script
 * Run: node seed-questions.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pypjvbnsmuqdssvnywxw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cGp2Ym5zbXVxZHNzdm55d3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjIyMDMsImV4cCI6MjA5NDA5ODIwM30.GdLpn9ulDVb3T878ks5ZCSdvp5ZDgsjEItuCIc0OEPU'
);

const questions = [
  // Computer Science
  { subject: 'Data Structures', department: 'Computer Science', difficulty: 'easy', question_text: 'What is the time complexity of accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct_answer: 2 },
  { subject: 'Data Structures', department: 'Computer Science', difficulty: 'medium', question_text: 'Which data structure uses LIFO (Last In First Out) principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correct_answer: 1 },
  { subject: 'Algorithms', department: 'Computer Science', difficulty: 'medium', question_text: 'What is the worst-case time complexity of Quick Sort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correct_answer: 2 },
  { subject: 'Algorithms', department: 'Computer Science', difficulty: 'hard', question_text: 'Which algorithm is used to find the shortest path in a weighted graph?', options: ['BFS', 'DFS', 'Dijkstra', 'Prim'], correct_answer: 2 },
  { subject: 'Networking', department: 'Computer Science', difficulty: 'easy', question_text: 'Which protocol is used for sending emails?', options: ['HTTP', 'FTP', 'SMTP', 'TCP'], correct_answer: 2 },
  { subject: 'Databases', department: 'Computer Science', difficulty: 'medium', question_text: 'What does ACID stand for in database systems?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integration, Data', 'Atomic, Compiled, Indexed, Distributed', 'None of the above'], correct_answer: 0 },
  { subject: 'Operating Systems', department: 'Computer Science', difficulty: 'medium', question_text: 'What is a deadlock in operating systems?', options: ['A process running infinitely', 'Two or more processes waiting for each other indefinitely', 'A process with highest priority', 'Memory overflow'], correct_answer: 1 },
  { subject: 'Programming', department: 'Computer Science', difficulty: 'easy', question_text: 'Which keyword is used to define a function in Python?', options: ['func', 'function', 'def', 'define'], correct_answer: 2 },
  
  // Electrical Engineering
  { subject: 'Circuit Theory', department: 'Electrical Engineering', difficulty: 'easy', question_text: "What is Ohm's Law?", options: ['V = IR', 'P = IV', 'V = I/R', 'R = V²/P'], correct_answer: 0 },
  { subject: 'Circuit Theory', department: 'Electrical Engineering', difficulty: 'medium', question_text: 'In a parallel circuit, what remains constant across all branches?', options: ['Current', 'Voltage', 'Resistance', 'Power'], correct_answer: 1 },
  { subject: 'Electromagnetics', department: 'Electrical Engineering', difficulty: 'medium', question_text: 'What is the unit of magnetic flux?', options: ['Tesla', 'Weber', 'Henry', 'Gauss'], correct_answer: 1 },
  { subject: 'Power Systems', department: 'Electrical Engineering', difficulty: 'hard', question_text: 'What is the typical frequency of AC power in India?', options: ['60 Hz', '50 Hz', '40 Hz', '100 Hz'], correct_answer: 1 },
  { subject: 'Electronics', department: 'Electrical Engineering', difficulty: 'easy', question_text: 'What does LED stand for?', options: ['Light Emitting Device', 'Light Emitting Diode', 'Low Energy Diode', 'Laser Emitting Diode'], correct_answer: 1 },
  { subject: 'Control Systems', department: 'Electrical Engineering', difficulty: 'medium', question_text: 'What is the Laplace transform of a unit step function?', options: ['1/s', 's', '1/s²', '1'], correct_answer: 0 },
  { subject: 'Digital Electronics', department: 'Electrical Engineering', difficulty: 'easy', question_text: 'How many bits are in a byte?', options: ['4', '8', '16', '32'], correct_answer: 1 },
  { subject: 'Machines', department: 'Electrical Engineering', difficulty: 'medium', question_text: 'Which motor has the highest starting torque?', options: ['Induction Motor', 'Synchronous Motor', 'DC Series Motor', 'DC Shunt Motor'], correct_answer: 2 },
  
  // Mechanical Engineering
  { subject: 'Thermodynamics', department: 'Mechanical Engineering', difficulty: 'easy', question_text: 'What is the first law of thermodynamics about?', options: ['Entropy', 'Conservation of Energy', 'Heat Transfer', 'Work Done'], correct_answer: 1 },
  { subject: 'Thermodynamics', department: 'Mechanical Engineering', difficulty: 'medium', question_text: 'What is the Carnot efficiency formula?', options: ['1 - T_cold/T_hot', 'T_hot/T_cold', 'T_cold - T_hot', '1 + T_cold/T_hot'], correct_answer: 0 },
  { subject: 'Fluid Mechanics', department: 'Mechanical Engineering', difficulty: 'medium', question_text: 'What does the Reynolds number indicate?', options: ['Flow velocity', 'Flow type (laminar vs turbulent)', 'Fluid density', 'Pipe diameter'], correct_answer: 1 },
  { subject: 'Mechanics', department: 'Mechanical Engineering', difficulty: 'easy', question_text: 'What is the SI unit of force?', options: ['Pascal', 'Joule', 'Newton', 'Watt'], correct_answer: 2 },
  { subject: 'Manufacturing', department: 'Mechanical Engineering', difficulty: 'medium', question_text: 'Which process is used to join metals by melting?', options: ['Casting', 'Forging', 'Welding', 'Machining'], correct_answer: 2 },
  { subject: 'Materials', department: 'Mechanical Engineering', difficulty: 'hard', question_text: "What is the Young's Modulus a measure of?", options: ['Hardness', 'Elasticity/Stiffness', 'Ductility', 'Toughness'], correct_answer: 1 },
  { subject: 'Kinematics', department: 'Mechanical Engineering', difficulty: 'easy', question_text: 'What is the acceleration due to gravity on Earth (approx)?', options: ['10.8 m/s²', '9.8 m/s²', '8.8 m/s²', '11.8 m/s²'], correct_answer: 1 },
  { subject: 'Heat Transfer', department: 'Mechanical Engineering', difficulty: 'medium', question_text: 'Which mode of heat transfer does not require a medium?', options: ['Conduction', 'Convection', 'Radiation', 'All require a medium'], correct_answer: 2 },
  
  // General Science
  { subject: 'Physics', department: 'General Science', difficulty: 'easy', question_text: 'What is the speed of light approximately?', options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'], correct_answer: 1 },
  { subject: 'Physics', department: 'General Science', difficulty: 'medium', question_text: 'What is the formula for kinetic energy?', options: ['mgh', '½mv²', 'Fd', 'mv'], correct_answer: 1 },
  { subject: 'Chemistry', department: 'General Science', difficulty: 'easy', question_text: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct_answer: 2 },
  { subject: 'Chemistry', department: 'General Science', difficulty: 'medium', question_text: 'What is the pH of pure water?', options: ['0', '7', '14', '1'], correct_answer: 1 },
  { subject: 'Mathematics', department: 'General Science', difficulty: 'easy', question_text: 'What is the value of Pi (π) to 2 decimal places?', options: ['3.41', '3.14', '3.12', '3.16'], correct_answer: 1 },
  { subject: 'Mathematics', department: 'General Science', difficulty: 'medium', question_text: 'What is the derivative of sin(x)?', options: ['cos(x)', '-sin(x)', 'tan(x)', '-cos(x)'], correct_answer: 0 },
  { subject: 'Biology', department: 'General Science', difficulty: 'easy', question_text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], correct_answer: 2 },
  { subject: 'Biology', department: 'General Science', difficulty: 'medium', question_text: 'What is the basic unit of heredity?', options: ['Cell', 'Chromosome', 'Gene', 'DNA'], correct_answer: 2 },
  
  // Electronics & Communication
  { subject: 'Analog Electronics', department: 'Electronics & Communication', difficulty: 'easy', question_text: 'What is the function of a capacitor?', options: ['Store energy in magnetic field', 'Store energy in electric field', 'Convert AC to DC', 'Amplify signals'], correct_answer: 1 },
  { subject: 'Analog Electronics', department: 'Electronics & Communication', difficulty: 'medium', question_text: 'What is the gain of a common-emitter amplifier?', options: ['Less than 1', 'Equal to 1', 'Greater than 1', 'Zero'], correct_answer: 2 },
  { subject: 'Communication', department: 'Electronics & Communication', difficulty: 'medium', question_text: 'What is the Nyquist rate for a signal with bandwidth B?', options: ['B', '2B', 'B/2', '4B'], correct_answer: 1 },
  { subject: 'Signals', department: 'Electronics & Communication', difficulty: 'hard', question_text: 'What does the Fourier Transform convert a signal to?', options: ['Time domain to frequency domain', 'Analog to digital', 'Continuous to discrete', 'Real to complex'], correct_answer: 0 },
  
  // Civil Engineering
  { subject: 'Structures', department: 'Civil Engineering', difficulty: 'easy', question_text: 'What is the strongest shape in structural engineering?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], correct_answer: 2 },
  { subject: 'Concrete', department: 'Civil Engineering', difficulty: 'medium', question_text: 'What is the standard curing period for concrete?', options: ['7 days', '14 days', '21 days', '28 days'], correct_answer: 3 },
  { subject: 'Surveying', department: 'Civil Engineering', difficulty: 'easy', question_text: 'What instrument is used to measure horizontal angles?', options: ['Level', 'Theodolite', 'Chain', 'Compass'], correct_answer: 1 },
  { subject: 'Geotechnical', department: 'Civil Engineering', difficulty: 'medium', question_text: 'What does SPT stand for in soil testing?', options: ['Standard Penetration Test', 'Soil Pressure Test', 'Standard Proctor Test', 'Soil Permeability Test'], correct_answer: 0 },
  
  // Information Technology
  { subject: 'Web Development', department: 'Information Technology', difficulty: 'easy', question_text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correct_answer: 0 },
  { subject: 'Web Development', department: 'Information Technology', difficulty: 'medium', question_text: 'Which HTTP method is idempotent?', options: ['POST', 'GET', 'PATCH', 'None'], correct_answer: 1 },
  { subject: 'Security', department: 'Information Technology', difficulty: 'medium', question_text: 'What does SQL injection exploit?', options: ['Memory buffers', 'Input validation flaws', 'Network protocols', 'File permissions'], correct_answer: 1 },
  { subject: 'Cloud', department: 'Information Technology', difficulty: 'easy', question_text: 'What does SaaS stand for?', options: ['Software as a Service', 'Storage as a Service', 'System as a Service', 'Server as a Service'], correct_answer: 0 },
];

async function seed() {
  console.log('🌱 Seeding questions...\n');
  
  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select();

  if (error) {
    console.log('❌ Seed failed:', error.message);
    // If RLS blocks insert, try upsert or show instructions
    if (error.message.includes('policy') || error.code === '42501') {
      console.log('\n⚠️  RLS is blocking inserts. Please run the INSERT statements');
      console.log('   directly in the Supabase SQL Editor from supabase/schema.sql');
      console.log('   (lines 180-262)\n');
    }
  } else {
    console.log(`✅ Successfully seeded ${data.length} questions!\n`);
    
    const depts = {};
    data.forEach(q => { depts[q.department] = (depts[q.department] || 0) + 1; });
    Object.entries(depts).sort((a,b) => b[1] - a[1]).forEach(([dept, count]) => {
      console.log(`   📚 ${dept}: ${count} questions`);
    });
  }
}

seed();
