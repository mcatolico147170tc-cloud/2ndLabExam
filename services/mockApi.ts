export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  studentId: string;
  course: string;
};

export type MockStudent = {
  id: string;
  name: string;
  email: string;
  course: string;
};

const MOCK_USER: MockUser = {
  id: 'u001',
  name: 'Mark Joseph P. Catolico',
  email: 'm.catolico.147170.tc@umindanao.edu.ph',
  role: 'student',
  studentId: 'STU-1001',
  course: 'BS Information Technology',
};

const MOCK_STUDENTS: MockStudent[] = [
  { id: '1', name: 'Mark Joseph P. Catolico', email: 'm.catolico.147170.tc@umindanao.edu.ph', course: 'BS Information Technology' },
  { id: '2', name: 'John Catolico', email: 'John@university.edu', course: 'BS Information Technology' },
  { id: '3', name: 'Anthony Catolico', email: 'Anthony@university.edu', course: 'BS Computer Science' },
  { id: '4', name: 'Nel Jhon Peteros', email: 'Nel@university.edu', course: 'BS Information Technology' },
];

const DEMO_PASSWORD_HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

const hashPassword = async (password: string) => {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

const makeToken = (user: MockUser) => {
  const payload = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 300000 }));
  return `mockHeader.${payload}.signature`;
};

const parseToken = (token: string) => {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

export const MockApi = {
  login: async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const hash = await hashPassword(password);
    if (email.toLowerCase().trim() !== MOCK_USER.email || hash !== DEMO_PASSWORD_HASH) {
      throw new Error('Invalid email or password.');
    }
    return { accessToken: makeToken(MOCK_USER), user: MOCK_USER };
  },

  getProfile: async (token: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const decoded = parseToken(token);
    if (!decoded || Date.now() > decoded.exp) throw { status: 401, message: 'Token expired.' };
    return { user: MOCK_USER };
  },

  getStudents: async () => {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_STUDENTS;
  },

  getStudent: async (id: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const student = MOCK_STUDENTS.find((s) => s.id === id);
    if (!student) throw { status: 404, message: 'Student not found.' };
    return student;
  },
};