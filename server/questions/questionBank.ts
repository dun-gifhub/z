import { Question, MathCategory, MathLevel } from '../../shared/types.ts';

// Helper random functions
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// Curated 150 Challenging Math Questions Repository
// Đầy đủ 10 chủ đề, tăng độ khó tư duy, câu hỏi chuẩn xác, đa dạng và không trùng lặp
export const CURATED_QUESTIONS: Question[] = [
  {
    "id": "NT_01",
    "question": "Số nguyên tố nào sau đây là số nguyên tố lớn nhất có 2 chữ số?",
    "formula": "p < 100, \\; p \\text{ lớn nhất}",
    "options": [
      "91",
      "93",
      "97",
      "99"
    ],
    "answer": "97",
    "explanation": "97 là số nguyên tố lớn nhất có 2 chữ số (91 = 7 × 13, 93 = 3 × 31, 99 = 9 × 11 đều là hợp số).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_02",
    "question": "Tổng của hai số nguyên tố bằng 999. Tích của hai số nguyên tố đó bằng bao nhiêu?",
    "formula": "p_1 + p_2 = 999 \\implies p_1 \\times p_2 = ?",
    "options": [
      "1994",
      "1996",
      "1998",
      "2000"
    ],
    "answer": "1994",
    "explanation": "Vì tổng là 999 (số lẻ), nên một trong hai số nguyên tố bắt buộc phải là số nguyên tố chẵn duy nhất là 2. Số còn lại là 999 - 2 = 997 (số nguyên tố). Tích là 2 × 997 = 1994.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_03",
    "question": "Phân tích số 180 ra thừa số nguyên tố có kết quả là:",
    "formula": "180 = a^x \\cdot b^y \\cdot c^z",
    "options": [
      "2² × 3² × 5",
      "2³ × 3 × 5",
      "2 × 3³ × 5",
      "2² × 3 × 5²"
    ],
    "answer": "2² × 3² × 5",
    "explanation": "180 = 18 × 10 = (2 × 3²) × (2 × 5) = 2² × 3² × 5.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_04",
    "question": "Có bao nhiêu số nguyên tố nằm trong khoảng từ 20 đến 40?",
    "formula": "20 < p < 40",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "4",
    "explanation": "Các số nguyên tố trong khoảng (20, 40) là: 23, 29, 31, 37. Tổng cộng có đúng 4 số.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_05",
    "question": "Tìm số tự nhiên k để (3k + 1) là số nguyên tố chẵn?",
    "formula": "3k + 1 = 2 \\implies k = ?",
    "options": [
      "k = 0",
      "k = 1",
      "k = 2",
      "Không tồn tại số tự nhiên k"
    ],
    "answer": "Không tồn tại số tự nhiên k",
    "explanation": "Số nguyên tố chẵn duy nhất là 2. Nếu 3k + 1 = 2 thì 3k = 1 suy ra k = 1/3 không phải là số tự nhiên.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_06",
    "question": "Cặp số nguyên tố sinh đôi là hai số nguyên tố hơn kém nhau 2 đơn vị. Cặp nào sau đây KHÔNG phải là số nguyên tố sinh đôi?",
    "formula": "p_2 - p_1 = 2",
    "options": [
      "11 và 13",
      "17 và 19",
      "21 và 23",
      "29 và 31"
    ],
    "answer": "21 và 23",
    "explanation": "21 = 3 × 7 là hợp số, không phải số nguyên tố. Do đó cặp (21, 23) không phải là cặp số nguyên tố sinh đôi.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_07",
    "question": "Số 73 có phải là số nguyên tố không? Để kiểm tra ta chỉ cần thử chia 73 cho các số nguyên tố nhỏ hơn số nào?",
    "formula": "p \\le \\sqrt{73}",
    "options": [
      "5",
      "7",
      "9",
      "11"
    ],
    "answer": "9",
    "explanation": "Vì √73 ≈ 8.54, ta chỉ cần thử chia cho các số nguyên tố nhỏ hơn 9 (tức là 2, 3, 5, 7). 73 không chia hết cho số nào nên 73 là số nguyên tố.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_08",
    "question": "Tìm số nguyên tố p sao cho p + 2 và p + 4 đều là các số nguyên tố?",
    "formula": "p, \\; p+2, \\; p+4 \\text{ đều là số nguyên tố}",
    "options": [
      "p = 2",
      "p = 3",
      "p = 5",
      "p = 7"
    ],
    "answer": "p = 3",
    "explanation": "Với p = 3 thì p+2=5 và p+4=7 đều là số nguyên tố. Với mọi p > 3, trong 3 số luôn có 1 số chia hết cho 3 lớn hơn 3 nên p = 3 là đáp án duy nhất.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_09",
    "question": "Số nào sau đây là số nguyên tố?",
    "formula": "p \\in \\{51, 67, 87, 91\\}",
    "options": [
      "51",
      "67",
      "87",
      "91"
    ],
    "answer": "67",
    "explanation": "51 = 3 × 17; 87 = 3 × 29; 91 = 7 × 13 là hợp số. Chỉ có 67 là số nguyên tố.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_10",
    "question": "Tổng của ba số nguyên tố liên tiếp bằng 31. Tích của ba số đó bằng bao nhiêu?",
    "formula": "p_1 + p_2 + p_3 = 31",
    "options": [
      "935",
      "1001",
      "1005",
      "1155"
    ],
    "answer": "1001",
    "explanation": "Ba số nguyên tố liên tiếp là 7, 11, 13 (7 + 11 + 13 = 31). Tích của chúng là 7 × 11 × 13 = 1001.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_11",
    "question": "Ước nguyên tố lớn nhất của số 143 là số nào?",
    "formula": "143 = p_1 \\times p_2",
    "options": [
      "11",
      "13",
      "17",
      "19"
    ],
    "answer": "13",
    "explanation": "143 = 11 × 13. Cả 11 và 13 đều là số nguyên tố, ước nguyên tố lớn nhất là 13.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_12",
    "question": "Biết n là số tự nhiên. Biểu thức n² + n luôn là số gì?",
    "formula": "A = n^2 + n = n(n + 1)",
    "options": [
      "Luôn là số nguyên tố",
      "Luôn là số lẻ",
      "Luôn là số chẵn",
      "Luôn là số chính phương"
    ],
    "answer": "Luôn là số chẵn",
    "explanation": "n² + n = n(n + 1) là tích của hai số tự nhiên liên tiếp nên luôn chia hết cho 2 (luôn chẵn).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_13",
    "question": "Cho p là số nguyên tố lớn hơn 3. Dư khi chia p² cho 3 luôn bằng bao nhiêu?",
    "formula": "p^2 \\pmod 3 \\; (p > 3)",
    "options": [
      "0",
      "1",
      "2",
      "Không xác định"
    ],
    "answer": "1",
    "explanation": "Vì p là số nguyên tố lớn hơn 3 nên p không chia hết cho 3 (p = 3k ± 1). Do đó p² = (3k ± 1)² = 9k² ± 6k + 1 chia 3 luôn dư 1.",
    "timeLimit": 60,
    "difficulty": 3,
    "category": "NGUYEN_TO",
    "level": "THCS"
  },
  {
    "id": "NT_14",
    "question": "Có bao nhiêu số nguyên tố có 1 chữ số?",
    "formula": "p \\in \\{2, 3, 5, 7\\}",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "4",
    "explanation": "Các số nguyên tố có 1 chữ số là: 2, 3, 5, 7 (tổng cộng có đúng 4 số).",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "NGUYEN_TO",
    "level": "CO_BAN"
  },
  {
    "id": "NT_15",
    "question": "Tích của số nguyên tố nhỏ nhất và số nguyên tố lẻ nhỏ nhất là:",
    "formula": "p_{\\min} \\times p_{\\text{lẻ}\\min} = ?",
    "options": [
      "4",
      "6",
      "10",
      "15"
    ],
    "answer": "6",
    "explanation": "Số nguyên tố nhỏ nhất là 2, số nguyên tố lẻ nhỏ nhất là 3. Tích 2 × 3 = 6.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "NGUYEN_TO",
    "level": "CO_BAN"
  },
  {
    "id": "CP_01",
    "question": "Giá trị của 17² (17 bình phương) bằng bao nhiêu?",
    "formula": "17^2 = ?",
    "options": [
      "269",
      "279",
      "289",
      "299"
    ],
    "answer": "289",
    "explanation": "17² = 17 × 17 = 289.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_02",
    "question": "Chữ số tận cùng của một số chính phương KHÔNG THỂ là chữ số nào sau đây?",
    "formula": "n^2 \\not\\equiv c \\pmod{10}",
    "options": [
      "1",
      "4",
      "7",
      "9"
    ],
    "answer": "7",
    "explanation": "Số chính phương chỉ có thể tận cùng bằng 0, 1, 4, 5, 6, 9. Không thể tận cùng bằng 2, 3, 7, 8.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_03",
    "question": "Tính nhanh giá trị của biểu thức hiệu hai bình phương: 65² - 35² = ?",
    "formula": "65^2 - 35^2 = (65 - 35)(65 + 35) = ?",
    "options": [
      "2400",
      "2800",
      "3000",
      "3200"
    ],
    "answer": "3000",
    "explanation": "Áp dụng hằng đẳng thức a² - b² = (a - b)(a + b) = (65 - 35)(65 + 35) = 30 × 100 = 3000.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_04",
    "question": "Có bao nhiêu số chính phương nằm giữa 50 và 150?",
    "formula": "50 < k^2 < 150",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "5",
    "explanation": "Các số chính phương là: 8² = 64, 9² = 81, 10² = 100, 11² = 121, 12² = 144. Có tất cả 5 số.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_05",
    "question": "Giá trị của 25² bằng bao nhiêu?",
    "formula": "25^2 = ?",
    "options": [
      "525",
      "615",
      "625",
      "650"
    ],
    "answer": "625",
    "explanation": "Mẹo nhẩm tận cùng 5: 2 × (2 + 1) = 6 ghép với 25 thành 625.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_06",
    "question": "Tìm số tự nhiên n nhỏ nhất khác 0 sao cho 12 × n là một số chính phương?",
    "formula": "12n = k^2, \\; n \\in \\mathbb{N}^*_{\\min}",
    "options": [
      "2",
      "3",
      "4",
      "6"
    ],
    "answer": "3",
    "explanation": "12 = 2² × 3. Để 12n là số chính phương thì số mũ các thừa số nguyên tố phải chẵn, do đó cần nhân thêm 3: 12 × 3 = 36 = 6².",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_07",
    "question": "Giá trị của 19² - 18² bằng bao nhiêu?",
    "formula": "19^2 - 18^2 = ?",
    "options": [
      "1",
      "37",
      "39",
      "41"
    ],
    "answer": "37",
    "explanation": "Hiệu hai bình phương liên tiếp: (n + 1)² - n² = 2n + 1 = 19 + 18 = 37.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_08",
    "question": "Số nào sau đây là số chính phương?",
    "formula": "x = k^2 \\; (k \\in \\mathbb{N})",
    "options": [
      "2022",
      "2023",
      "2025",
      "2027"
    ],
    "answer": "2025",
    "explanation": "2025 = 45² (4 × 5 = 20 ghép 25). Các số tận cùng 2, 3, 7 không thể là số chính phương.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_09",
    "question": "Tổng 1 + 3 + 5 + 7 + 9 + 11 + 13 bằng bình phương của số nào?",
    "formula": "S = \\sum_{i=1}^n (2i-1) = n^2",
    "options": [
      "6²",
      "7²",
      "8²",
      "9²"
    ],
    "answer": "7²",
    "explanation": "Tổng của n số lẻ đầu tiên luôn bằng n². Ở đây có 7 số lẻ nên tổng bằng 7² = 49.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_10",
    "question": "Tìm x dương thỏa mãn: x² - 16 = 33?",
    "formula": "x^2 - 16 = 33 \\implies x = ?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "7",
    "explanation": "x² = 33 + 16 = 49. Vì x > 0 nên x = √49 = 7.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_11",
    "question": "Giá trị của 14² bằng bao nhiêu?",
    "formula": "14^2 = ?",
    "options": [
      "166",
      "186",
      "196",
      "206"
    ],
    "answer": "196",
    "explanation": "14² = 14 × 14 = 196.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHINH_PHUONG",
    "level": "CO_BAN"
  },
  {
    "id": "CP_12",
    "question": "Một số chính phương khi chia cho 4 có thể có số dư là bao nhiêu?",
    "formula": "n^2 \\pmod 4",
    "options": [
      "Chỉ có thể dư 0 hoặc 1",
      "Chỉ có thể dư 1 hoặc 2",
      "Chỉ có thể dư 2 hoặc 3",
      "Có thể dư 0, 1, 2, 3"
    ],
    "answer": "Chỉ có thể dư 0 hoặc 1",
    "explanation": "Nếu n chẵn: (2k)² = 4k² (chia hết cho 4, dư 0). Nếu n lẻ: (2k + 1)² = 4k² + 4k + 1 (chia 4 dư 1).",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_13",
    "question": "Giá trị của biểu thức 101² - 99² bằng bao nhiêu?",
    "formula": "101^2 - 99^2 = (101 - 99)(101 + 99)",
    "options": [
      "200",
      "300",
      "400",
      "500"
    ],
    "answer": "400",
    "explanation": "101² - 99² = (101 - 99)(101 + 99) = 2 × 200 = 400.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "CHINH_PHUONG",
    "level": "THCS"
  },
  {
    "id": "CP_14",
    "question": "Số chính phương nhỏ nhất có 3 chữ số là:",
    "formula": "k^2 \\ge 100, \\; k \\in \\mathbb{N}_{\\min}",
    "options": [
      "100",
      "121",
      "144",
      "169"
    ],
    "answer": "100",
    "explanation": "10² = 100 là số chính phương nhỏ nhất có 3 chữ số.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHINH_PHUONG",
    "level": "CO_BAN"
  },
  {
    "id": "CP_15",
    "question": "Số chính phương lớn nhất có 2 chữ số là:",
    "formula": "k^2 < 100, \\; k \\text{ lớn nhất}",
    "options": [
      "64",
      "81",
      "96",
      "99"
    ],
    "answer": "81",
    "explanation": "9² = 81 là số chính phương 2 chữ số lớn nhất (10² = 100 có 3 chữ số).",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHINH_PHUONG",
    "level": "CO_BAN"
  },
  {
    "id": "DS_01",
    "question": "Tìm x biết phương trình: 3(x - 2) + 5 = 2x + 7",
    "formula": "3(x - 2) + 5 = 2x + 7 \\implies x = ?",
    "options": [
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "8",
    "explanation": "3x - 6 + 5 = 2x + 7 <=> 3x - 1 = 2x + 7 <=> x = 8.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_02",
    "question": "Hệ phương trình { x + y = 14 ; x - y = 4 } có nghiệm (x ; y) là:",
    "formula": "\\begin{cases} x + y = 14 \\\\ x - y = 4 \\end{cases}",
    "options": [
      "(8; 6)",
      "(9; 5)",
      "(10; 4)",
      "(7; 7)"
    ],
    "answer": "(9; 5)",
    "explanation": "Cộng hai phương trình: 2x = 18 => x = 9. Thay vào: y = 14 - 9 = 5.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_03",
    "question": "Khai triển hằng đẳng thức (2x - 3)² ta được:",
    "formula": "(2x - 3)^2 = ?",
    "options": [
      "4x² - 12x + 9",
      "4x² - 6x + 9",
      "4x² + 12x + 9",
      "4x² - 9"
    ],
    "answer": "4x² - 12x + 9",
    "explanation": "(2x - 3)² = (2x)² - 2(2x)(3) + 3² = 4x² - 12x + 9.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_04",
    "question": "Phân tích đa thức x² - 5x + 6 thành nhân tử được kết quả là:",
    "formula": "x^2 - 5x + 6 = (x - a)(x - b)",
    "options": [
      "(x - 2)(x - 3)",
      "(x + 2)(x + 3)",
      "(x - 1)(x - 6)",
      "(x + 1)(x - 6)"
    ],
    "answer": "(x - 2)(x - 3)",
    "explanation": "x² - 5x + 6 = x² - 2x - 3x + 6 = x(x - 2) - 3(x - 2) = (x - 2)(x - 3).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_05",
    "question": "Cho x + 1/x = 4. Tính giá trị của biểu thức P = x² + 1/x²?",
    "formula": "x + \\frac{1}{x} = 4 \\implies x^2 + \\frac{1}{x^2} = ?",
    "options": [
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "14",
    "explanation": "Bình phương hai vế: (x + 1/x)² = x² + 2 + 1/x² = 16 => x² + 1/x² = 16 - 2 = 14.",
    "timeLimit": 60,
    "difficulty": 3,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_06",
    "question": "Nghiệm của phương trình: 5x - (3x + 4) = 10 là:",
    "formula": "5x - (3x + 4) = 10 \\implies x = ?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "7",
    "explanation": "5x - 3x - 4 = 10 <=> 2x = 14 <=> x = 7.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_07",
    "question": "Tìm x biết: (x - 4)(x + 4) = 9",
    "formula": "x^2 - 16 = 9 \\implies x = ?",
    "options": [
      "x = ±5",
      "x = ±4",
      "x = ±3",
      "x = 5"
    ],
    "answer": "x = ±5",
    "explanation": "(x - 4)(x + 4) = x² - 16 = 9 => x² = 25 => x = ±5.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_08",
    "question": "Giá trị nhỏ nhất của biểu thức A = (x - 3)² + 5 đạt được khi x bằng bao nhiêu?",
    "formula": "A = (x - 3)^2 + 5 \\ge 5",
    "options": [
      "x = 0",
      "x = 3",
      "x = -3",
      "x = 5"
    ],
    "answer": "x = 3",
    "explanation": "Vì (x - 3)² ≥ 0 với mọi x nên A ≥ 5. Dấu \"=\" xảy ra khi x - 3 = 0 <=> x = 3.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_09",
    "question": "Tìm hai số biết tổng của chúng bằng 20 và tích của chúng bằng 96?",
    "formula": "x + y = 20, \\; xy = 96",
    "options": [
      "8 và 12",
      "6 và 14",
      "7 và 13",
      "5 và 15"
    ],
    "answer": "8 và 12",
    "explanation": "8 + 12 = 20 và 8 × 12 = 96. Phương trình t² - 20t + 96 = 0 có nghiệm là 8 và 12.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_10",
    "question": "Phương trình 2x² - 8 = 0 có tập nghiệm là:",
    "formula": "2x^2 - 8 = 0 \\implies x = ?",
    "options": [
      "{2}",
      "{-2}",
      "{-2; 2}",
      "{4}"
    ],
    "answer": "{-2; 2}",
    "explanation": "2x² = 8 <=> x² = 4 <=> x = ±2.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "DAI_SO",
    "level": "CO_BAN"
  },
  {
    "id": "DS_11",
    "question": "Rút gọn biểu thức B = (x + 2)² - (x - 2)² ta được:",
    "formula": "(x + 2)^2 - (x - 2)^2 = ?",
    "options": [
      "4x",
      "8x",
      "16",
      "2x² + 8"
    ],
    "answer": "8x",
    "explanation": "Áp dụng hiệu hai bình phương: [(x+2) - (x-2)][(x+2) + (x-2)] = 4 × (2x) = 8x.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_12",
    "question": "Nếu 3x - y = 7 và y = 2, thì x bằng:",
    "formula": "3x - 2 = 7 \\implies x = ?",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "3",
    "explanation": "3x - 2 = 7 <=> 3x = 9 <=> x = 3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "DAI_SO",
    "level": "CO_BAN"
  },
  {
    "id": "DS_13",
    "question": "Giải phương trình: (x - 1)/2 + (x - 1)/3 = 5",
    "formula": "\\frac{x - 1}{2} + \\frac{x - 1}{3} = 5 \\implies x = ?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "7",
    "explanation": "(x - 1)(1/2 + 1/3) = (x - 1) × 5/6 = 5 => x - 1 = 6 => x = 7.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_14",
    "question": "Đa thức P(x) = x³ - 4x có bao nhiêu nghiệm thực?",
    "formula": "x(x^2 - 4) = 0",
    "options": [
      "1",
      "2",
      "3",
      "Vô nghiệm"
    ],
    "answer": "3",
    "explanation": "x³ - 4x = x(x - 2)(x + 2) = 0 có 3 nghiệm thực là x = 0, x = 2, x = -2.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "DAI_SO",
    "level": "THCS"
  },
  {
    "id": "DS_15",
    "question": "Tìm x biết: 4x + 12 = 0",
    "formula": "4x = -12 \\implies x = ?",
    "options": [
      "-3",
      "3",
      "-4",
      "4"
    ],
    "answer": "-3",
    "explanation": "4x = -12 <=> x = -12 / 4 = -3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "DAI_SO",
    "level": "CO_BAN"
  },
  {
    "id": "KC_01",
    "question": "Rút gọn biểu thức căn thức: √72 = ?",
    "formula": "\\sqrt{72} = \\sqrt{36 \\times 2} = ?",
    "options": [
      "6√2",
      "8√2",
      "3√8",
      "12√2"
    ],
    "answer": "6√2",
    "explanation": "√72 = √(36 × 2) = √36 × √2 = 6√2.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_02",
    "question": "Tính giá trị biểu thức: √50 - √18 = ?",
    "formula": "\\sqrt{50} - \\sqrt{18} = ?",
    "options": [
      "√32",
      "2√2",
      "3√2",
      "4√2"
    ],
    "answer": "2√2",
    "explanation": "√50 = 5√2 và √18 = 3√2. Vậy √50 - √18 = 5√2 - 3√2 = 2√2.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_03",
    "question": "Trục căn thức ở mẫu số của biểu thức 4 / √2 ta được:",
    "formula": "\\frac{4}{\\sqrt{2}} = ?",
    "options": [
      "2",
      "2√2",
      "4√2",
      "√2"
    ],
    "answer": "2√2",
    "explanation": "4 / √2 = (4 × √2) / (√2 × √2) = 4√2 / 2 = 2√2.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_04",
    "question": "Rút gọn biểu thức căn lồng: √(4 + 2√3) = ?",
    "formula": "\\sqrt{4 + 2\\sqrt{3}} = \\sqrt{(\\sqrt{3} + 1)^2} = ?",
    "options": [
      "√3 + 1",
      "√3 - 1",
      "2 + √3",
      "1 + 2√3"
    ],
    "answer": "√3 + 1",
    "explanation": "4 + 2√3 = 3 + 2√3 + 1 = (√3 + 1)². Do đó √(4 + 2√3) = |√3 + 1| = √3 + 1.",
    "timeLimit": 60,
    "difficulty": 3,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_05",
    "question": "Giá trị của căn bậc ba: ∛125 bằng bao nhiêu?",
    "formula": "\\sqrt[3]{125} = ?",
    "options": [
      "5",
      "15",
      "25",
      "35"
    ],
    "answer": "5",
    "explanation": "5³ = 5 × 5 × 5 = 125 nên ∛125 = 5.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "KHAI_CAN",
    "level": "CO_BAN"
  },
  {
    "id": "KC_06",
    "question": "Tìm điều kiện xác định của biểu thức √(2x - 6):",
    "formula": "\\sqrt{2x - 6} \\; \\text{có nghĩa khi nào?}",
    "options": [
      "x ≥ 3",
      "x > 3",
      "x ≤ 3",
      "x ≥ 6"
    ],
    "answer": "x ≥ 3",
    "explanation": "Biểu thức dưới căn bậc hai phải không âm: 2x - 6 ≥ 0 <=> 2x ≥ 6 <=> x ≥ 3.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_07",
    "question": "Tính giá trị của (√5 - 2)(√5 + 2) = ?",
    "formula": "(\\sqrt{5} - 2)(\\sqrt{5} + 2) = ?",
    "options": [
      "1",
      "2",
      "3",
      "5"
    ],
    "answer": "1",
    "explanation": "Hằng đẳng thức: (√5)² - 2² = 5 - 4 = 1.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_08",
    "question": "Tìm x biết: √(x + 3) = 5",
    "formula": "\\sqrt{x + 3} = 5 \\implies x = ?",
    "options": [
      "22",
      "25",
      "28",
      "32"
    ],
    "answer": "22",
    "explanation": "Bình phương hai vế: x + 3 = 25 <=> x = 22.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_09",
    "question": "Giá trị của biểu thức √(144) + √(81) - √(25) bằng:",
    "formula": "\\sqrt{144} + \\sqrt{81} - \\sqrt{25} = ?",
    "options": [
      "14",
      "16",
      "18",
      "20"
    ],
    "answer": "16",
    "explanation": "√144 = 12, √81 = 9, √25 = 5. Vậy 12 + 9 - 5 = 16.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "KHAI_CAN",
    "level": "CO_BAN"
  },
  {
    "id": "KC_10",
    "question": "Tính giá trị: √(0.04) = ?",
    "formula": "\\sqrt{0.04} = ?",
    "options": [
      "0.02",
      "0.2",
      "0.002",
      "2"
    ],
    "answer": "0.2",
    "explanation": "(0.2)² = 0.04 nên √0.04 = 0.2.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "KHAI_CAN",
    "level": "CO_BAN"
  },
  {
    "id": "KC_11",
    "question": "Rút gọn: √(48) / √(3) = ?",
    "formula": "\\frac{\\sqrt{48}}{\\sqrt{3}} = \\sqrt{\\frac{48}{3}} = ?",
    "options": [
      "3",
      "4",
      "12",
      "16"
    ],
    "answer": "4",
    "explanation": "√(48) / √(3) = √(48 / 3) = √16 = 4.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_12",
    "question": "So sánh 2√3 và 3√2:",
    "formula": "2\\sqrt{3} \\; \\text{và} \\; 3\\sqrt{2}",
    "options": [
      "2√3 > 3√2",
      "2√3 < 3√2",
      "2√3 = 3√2",
      "Không so sánh được"
    ],
    "answer": "2√3 < 3√2",
    "explanation": "2√3 = √(4 × 3) = √12. Trong khi 3√2 = √(9 × 2) = √18. Vì 12 < 18 nên 2√3 < 3√2.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_13",
    "question": "Giá trị của biểu thức ∛(-64) là:",
    "formula": "\\sqrt[3]{-64} = ?",
    "options": [
      "-4",
      "4",
      "-8",
      "Không tồn tại"
    ],
    "answer": "-4",
    "explanation": "(-4)³ = (-4) × (-4) × (-4) = -64 nên căn bậc ba của -64 bằng -4.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "KC_14",
    "question": "Tính giá trị: √(25 × 36) = ?",
    "formula": "\\sqrt{25 \\times 36} = \\sqrt{25} \\times \\sqrt{36} = ?",
    "options": [
      "25",
      "30",
      "35",
      "40"
    ],
    "answer": "30",
    "explanation": "√(25 × 36) = √25 × √36 = 5 × 6 = 30.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "KHAI_CAN",
    "level": "CO_BAN"
  },
  {
    "id": "KC_15",
    "question": "Rút gọn biểu thức √(x²) với x < 0:",
    "formula": "\\sqrt{x^2} \\; (x < 0)",
    "options": [
      "x",
      "-x",
      "x²",
      "±x"
    ],
    "answer": "-x",
    "explanation": "√(x²) = |x|. Vì x < 0 nên |x| = -x.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "KHAI_CAN",
    "level": "THCS"
  },
  {
    "id": "LT_01",
    "question": "Tính giá trị của 2⁷ = ?",
    "formula": "2^7 = ?",
    "options": [
      "64",
      "128",
      "256",
      "512"
    ],
    "answer": "128",
    "explanation": "2⁶ = 64 => 2⁷ = 64 × 2 = 128.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_02",
    "question": "Tìm số tự nhiên x biết: 2ˣ × 2³ = 256",
    "formula": "2^{x + 3} = 256 = 2^8 \\implies x = ?",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "5",
    "explanation": "2ˣ⁺³ = 256 = 2⁸ => x + 3 = 8 => x = 5.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_03",
    "question": "Rút gọn biểu thức: (3⁴ × 3⁵) / 3⁷ = ?",
    "formula": "\\frac{3^4 \\times 3^5}{3^7} = 3^{4+5-7} = ?",
    "options": [
      "3",
      "9",
      "27",
      "81"
    ],
    "answer": "9",
    "explanation": "3⁴⁺⁵⁻⁷ = 3² = 9.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_04",
    "question": "Giá trị của biểu thức 2⁻³ bằng phân số nào sau đây?",
    "formula": "2^{-3} = \\frac{1}{2^3} = ?",
    "options": [
      "-8",
      "-6",
      "1/8",
      "1/6"
    ],
    "answer": "1/8",
    "explanation": "a⁻ⁿ = 1 / aⁿ => 2⁻³ = 1 / 2³ = 1/8.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_05",
    "question": "So sánh hai lũy thừa: 2³⁰ và 3²⁰:",
    "formula": "2^{30} = (2^3)^{10} \\; \\text{và} \\; 3^{20} = (3^2)^{10}",
    "options": [
      "2³⁰ > 3²⁰",
      "2³⁰ < 3²⁰",
      "2³⁰ = 3²⁰",
      "Không so sánh được"
    ],
    "answer": "2³⁰ < 3²⁰",
    "explanation": "2³⁰ = (2³)¹⁰ = 8¹⁰. Trong khi 3²⁰ = (3²)¹⁰ = 9¹⁰. Vì 8 < 9 nên 8¹⁰ < 9¹⁰, tức 2³⁰ < 3²⁰.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_06",
    "question": "Chữ số tận cùng của 2²⁰²⁴ là chữ số nào?",
    "formula": "2^{2024} = (2^4)^{506} = 16^{506} \\pmod{10}",
    "options": [
      "2",
      "4",
      "6",
      "8"
    ],
    "answer": "6",
    "explanation": "Lũy thừa của 2 có chu kỳ tận cùng 4 số: 2, 4, 8, 6. Vì 2024 chia hết cho 4 nên 2²⁰²⁴ có tận cùng là 6.",
    "timeLimit": 60,
    "difficulty": 3,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_07",
    "question": "Giá trị của 3⁴ bằng bao nhiêu?",
    "formula": "3^4 = ?",
    "options": [
      "12",
      "27",
      "81",
      "243"
    ],
    "answer": "81",
    "explanation": "3⁴ = 3 × 3 × 3 × 3 = 81.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "LUY_THUA",
    "level": "CO_BAN"
  },
  {
    "id": "LT_08",
    "question": "Tính giá trị của (2³)² = ?",
    "formula": "(2^3)^2 = 2^{3 \\times 2} = ?",
    "options": [
      "32",
      "64",
      "128",
      "256"
    ],
    "answer": "64",
    "explanation": "(2³)² = 2⁶ = 64.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "LUY_THUA",
    "level": "CO_BAN"
  },
  {
    "id": "LT_09",
    "question": "Tìm x biết: 5^(2x - 1) = 125",
    "formula": "5^{2x - 1} = 5^3 \\implies x = ?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "2",
    "explanation": "5^(2x - 1) = 5³ => 2x - 1 = 3 => 2x = 4 => x = 2.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_10",
    "question": "Giá trị của biểu thức 10⁰ + 0¹⁰ bằng bao nhiêu?",
    "formula": "10^0 + 0^{10} = ?",
    "options": [
      "0",
      "1",
      "10",
      "Không xác định"
    ],
    "answer": "1",
    "explanation": "Mọi số khác 0 có lũy thừa 0 bằng 1: 10⁰ = 1. Còn 0¹⁰ = 0. Tổng 1 + 0 = 1.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "LUY_THUA",
    "level": "CO_BAN"
  },
  {
    "id": "LT_11",
    "question": "Rút gọn biểu thức: (4⁵ × 9⁴) / (2¹⁰ × 3⁷) = ?",
    "formula": "\\frac{(2^2)^5 \\times (3^2)^4}{2^{10} \\times 3^7} = ?",
    "options": [
      "1",
      "2",
      "3",
      "6"
    ],
    "answer": "3",
    "explanation": "4⁵ = 2¹⁰, 9⁴ = 3⁸. Biểu thức bằng (2¹⁰ × 3⁸) / (2¹⁰ × 3⁷) = 3¹ = 3.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_12",
    "question": "Tính: (-2)⁵ = ?",
    "formula": "(-2)^5 = ?",
    "options": [
      "32",
      "-32",
      "10",
      "-10"
    ],
    "answer": "-32",
    "explanation": "Số âm nâng lên lũy thừa lẻ cho kết quả âm: (-2)⁵ = -32.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "LUY_THUA",
    "level": "CO_BAN"
  },
  {
    "id": "LT_13",
    "question": "Tính giá trị của 5³ - 5² = ?",
    "formula": "5^3 - 5^2 = 5^2(5 - 1) = ?",
    "options": [
      "25",
      "75",
      "100",
      "125"
    ],
    "answer": "100",
    "explanation": "5³ - 5² = 125 - 25 = 100 (hoặc 5² × (5 - 1) = 25 × 4 = 100).",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_14",
    "question": "Có bao nhiêu chữ số 0 tận cùng trong kết quả của 2⁴ × 5³?",
    "formula": "2^4 \\times 5^3 = 2 \\times (2 \\times 5)^3 = 2 \\times 10^3",
    "options": [
      "2",
      "3",
      "4",
      "7"
    ],
    "answer": "3",
    "explanation": "2⁴ × 5³ = 2 × (2³ × 5³) = 2 × 10³ = 2000 (có 3 chữ số 0 tận cùng).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "LT_15",
    "question": "Tính giá trị: (1/2)⁻⁴ = ?",
    "formula": "\\left(\\frac{1}{2}\\right)^{-4} = 2^4 = ?",
    "options": [
      "1/16",
      "8",
      "16",
      "32"
    ],
    "answer": "16",
    "explanation": "(1/2)⁻⁴ = 2⁴ = 16.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "LUY_THUA",
    "level": "THCS"
  },
  {
    "id": "AS_01",
    "question": "Tính giá trị của biểu thức: (-4) × (-7) - (-12) = ?",
    "formula": "(-4) \\times (-7) - (-12) = ?",
    "options": [
      "16",
      "28",
      "40",
      "-40"
    ],
    "answer": "40",
    "explanation": "(-4) × (-7) = 28; 28 - (-12) = 28 + 12 = 40.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_02",
    "question": "Tính: (-3)³ + (-2)⁴ = ?",
    "formula": "(-3)^3 + (-2)^4 = ?",
    "options": [
      "-11",
      "11",
      "-43",
      "43"
    ],
    "answer": "-11",
    "explanation": "(-3)³ = -27; (-2)⁴ = 16. Tổng: -27 + 16 = -11.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_03",
    "question": "Thực hiện phép tính: (-72) : (-8) + (-5) × 3 = ?",
    "formula": "(-72) : (-8) + (-5) \\times 3 = ?",
    "options": [
      "-6",
      "6",
      "-24",
      "24"
    ],
    "answer": "-6",
    "explanation": "(-72) : (-8) = 9; (-5) × 3 = -15; 9 + (-15) = -6.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_04",
    "question": "Tìm x nguyên biết: 15 - 2x = -7",
    "formula": "15 - 2x = -7 \\implies x = ?",
    "options": [
      "-11",
      "4",
      "11",
      "-4"
    ],
    "answer": "11",
    "explanation": "2x = 15 - (-7) = 22 => x = 11.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_05",
    "question": "Tính giá trị của S = 1 - 2 + 3 - 4 + 5 - 6 + ... + 99 - 100 = ?",
    "formula": "S = \\sum_{k=1}^{50} [(2k-1) - 2k] = ?",
    "options": [
      "-50",
      "50",
      "-100",
      "0"
    ],
    "answer": "-50",
    "explanation": "Nhóm 2 số liên tiếp: (1 - 2) + (3 - 4) + ... + (99 - 100). Có 50 cặp, mỗi cặp bằng -1. Tổng là 50 × (-1) = -50.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_06",
    "question": "Kết quả của phép tính: -5² và (-5)² lần lượt là:",
    "formula": "-5^2 \\; \\text{và} \\; (-5)^2",
    "options": [
      "-25 và 25",
      "25 và 25",
      "-25 và -25",
      "25 và -25"
    ],
    "answer": "-25 và 25",
    "explanation": "-5² = -(5²) = -25. Còn (-5)² = (-5) × (-5) = 25.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_07",
    "question": "Tính giá trị: (-1)¹⁰⁰ + (-1)¹⁰¹ = ?",
    "formula": "(-1)^{100} + (-1)^{101} = ?",
    "options": [
      "-2",
      "0",
      "2",
      "1"
    ],
    "answer": "0",
    "explanation": "(-1)¹⁰⁰ = 1 và (-1)¹⁰¹ = -1. Tổng 1 + (-1) = 0.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "AM_SO",
    "level": "CO_BAN"
  },
  {
    "id": "AS_08",
    "question": "Tập hợp các số nguyên x thỏa mãn -3 < x ≤ 2 có bao nhiêu phần tử?",
    "formula": "-3 < x \\le 2, \\; x \\in \\mathbb{Z}",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "5",
    "explanation": "Các số nguyên x là: -2, -1, 0, 1, 2. Tổng cộng có 5 phần tử.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_09",
    "question": "Tính giá trị: -18 - (-25) + (-17) = ?",
    "formula": "-18 + 25 - 17 = ?",
    "options": [
      "-10",
      "10",
      "-26",
      "26"
    ],
    "answer": "-10",
    "explanation": "-18 + 25 = 7; 7 + (-17) = -10.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "AM_SO",
    "level": "CO_BAN"
  },
  {
    "id": "AS_10",
    "question": "Tích của 5 số nguyên âm và 2 số nguyên dương mang dấu gì?",
    "formula": "(-)^5 \\times (+)^2 = ?",
    "options": [
      "Dấu âm",
      "Dấu dương",
      "Bằng 0",
      "Tùy giá trị"
    ],
    "answer": "Dấu âm",
    "explanation": "Lẻ thừa số âm (5 số âm) nhân lại ra số âm, nhân tiếp với các số dương vẫn mang dấu âm.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "AM_SO",
    "level": "CO_BAN"
  },
  {
    "id": "AS_11",
    "question": "Tìm số nguyên x sao cho x + (-8) = -20?",
    "formula": "x - 8 = -20 \\implies x = ?",
    "options": [
      "-28",
      "-12",
      "12",
      "28"
    ],
    "answer": "-12",
    "explanation": "x = -20 - (-8) = -20 + 8 = -12.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "AM_SO",
    "level": "CO_BAN"
  },
  {
    "id": "AS_12",
    "question": "Tính: [(-15) + (-5)] : (-4) = ?",
    "formula": "\\frac{(-15) + (-5)}{-4} = ?",
    "options": [
      "-5",
      "5",
      "-4",
      "4"
    ],
    "answer": "5",
    "explanation": "(-15) + (-5) = -20; (-20) : (-4) = 5.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "AM_SO",
    "level": "CO_BAN"
  },
  {
    "id": "AS_13",
    "question": "Tính tổng tất cả các số nguyên x thỏa mãn: -5 ≤ x ≤ 4",
    "formula": "S = \\sum_{x=-5}^4 x = ?",
    "options": [
      "-5",
      "-4",
      "0",
      "4"
    ],
    "answer": "-5",
    "explanation": "Các cặp đối nhau từ -4 đến 4 triệt tiêu hết thành 0. Còn lại duy nhất số -5.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_14",
    "question": "Cho a < 0 và b > 0. Khẳng định nào sau đây luôn ĐÚNG?",
    "formula": "a < 0 < b",
    "options": [
      "a - b > 0",
      "ab > 0",
      "a / b < 0",
      "a + b < 0"
    ],
    "answer": "a / b < 0",
    "explanation": "Thương của số âm và số dương luôn là số âm (a / b < 0).",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "AM_SO",
    "level": "THCS"
  },
  {
    "id": "AS_15",
    "question": "Tính: (-2) × (-3) × (-4) = ?",
    "formula": "(-2) \\times (-3) \\times (-4) = ?",
    "options": [
      "24",
      "-24",
      "12",
      "-12"
    ],
    "answer": "-24",
    "explanation": "Ba số âm nhân với nhau ra kết quả âm: 2 × 3 × 4 = 24 => kết quả là -24.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "AM_SO",
    "level": "CO_BAN"
  },
  {
    "id": "CH_01",
    "question": "Điền chữ số thích hợp vào dấu * để số 35* chia hết cho cả 2 và 3:",
    "formula": "35* \\; \\vdots \\; 6",
    "options": [
      "1",
      "4",
      "7",
      "8"
    ],
    "answer": "4",
    "explanation": "Để chia hết cho 2, * phải là số chẵn. Để chia hết cho 3, tổng chữ số 3 + 5 + * = 8 + * phải chia hết cho 3. Với * chẵn thì * = 4 (8 + 4 = 12 chia hết cho 3).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_02",
    "question": "Số dư khi chia 10²⁰²⁴ cho 9 bằng bao nhiêu?",
    "formula": "10^{2024} \\pmod 9 = ?",
    "options": [
      "0",
      "1",
      "4",
      "7"
    ],
    "answer": "1",
    "explanation": "10 chia 9 dư 1 nên 10²⁰²⁴ ≡ 1²⁰²⁴ ≡ 1 (mod 9). Số dư luôn là 1.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_03",
    "question": "Số nào sau đây chia hết cho 11?",
    "formula": "n \\; \\vdots \\; 11",
    "options": [
      "1234",
      "1353",
      "1452",
      "1564"
    ],
    "answer": "1452",
    "explanation": "Dấu hiệu chia hết cho 11: Hiệu giữa tổng các chữ số ở vị trí lẻ và vị trí chẵn chia hết cho 11. Với 1452: (1 + 5) - (4 + 2) = 6 - 6 = 0 chia hết cho 11.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_04",
    "question": "Dấu hiệu chia hết cho 4 là số tạo bởi hai chữ số tận cùng phải chia hết cho 4. Số nào sau đây chia hết cho 4?",
    "formula": "n \\; \\vdots \\; 4",
    "options": [
      "1054",
      "2038",
      "3172",
      "4258"
    ],
    "answer": "3172",
    "explanation": "Hai chữ số tận cùng là 72, chia hết cho 4 (72 / 4 = 18).",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_05",
    "question": "Số nào sau đây chia hết cho cả 5 và 9?",
    "formula": "n \\; \\vdots \\; 45",
    "options": [
      "1340",
      "2475",
      "3580",
      "4125"
    ],
    "answer": "2475",
    "explanation": "2475 tận cùng bằng 5 (chia hết cho 5). Tổng chữ số: 2 + 4 + 7 + 5 = 18 chia hết cho 9.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_06",
    "question": "Số dư khi chia tổng S = 1 + 2 + 3 + ... + 20 cho 5 là bao nhiêu?",
    "formula": "S = \\frac{20 \\times 21}{2} = 210 \\pmod 5",
    "options": [
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": "0",
    "explanation": "S = (20 × 21) / 2 = 210. 210 tận cùng bằng 0 nên chia hết cho 5, dư 0.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_07",
    "question": "Cho số A = 7a2b chia hết cho cả 2, 5 và 9. Giá trị của a + b bằng:",
    "formula": "A = 7a2b \\; \\vdots \\; 2, 5, 9",
    "options": [
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "9",
    "explanation": "A chia hết cho cả 2 và 5 nên b = 0. Khi đó A = 7a20 chia hết cho 9 => 7 + a + 2 + 0 = 9 + a chia hết cho 9 => a = 0 hoặc 9. Để A lớn hơn 0 và đúng ta có a = 9 (hoặc a=0 thì a+b=0). Trong các lựa chọn có 9 (a=9, b=0).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_08",
    "question": "Dấu hiệu chia hết cho 8 là ba chữ số tận cùng chia hết cho 8. Số nào sau đây chia hết cho 8?",
    "formula": "n \\; \\vdots \\; 8",
    "options": [
      "1124",
      "2160",
      "3142",
      "4156"
    ],
    "answer": "2160",
    "explanation": "Ba chữ số tận cùng là 160 chia hết cho 8 (160 / 8 = 20).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_09",
    "question": "Tìm số dư khi chia 2023 cho 9:",
    "formula": "2023 \\pmod 9 = ?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "7",
    "explanation": "Tổng chữ số của 2023 là 2 + 0 + 2 + 3 = 7. Vậy 2023 chia 9 dư 7.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHIA_HET",
    "level": "CO_BAN"
  },
  {
    "id": "CH_10",
    "question": "Số tự nhiên n thỏa mãn (n + 5) chia hết cho (n + 1). Giá trị lớn nhất của n là:",
    "formula": "(n + 5) \\; \\vdots \\; (n + 1)",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "3",
    "explanation": "(n + 5) = (n + 1) + 4. Để (n + 5) chia hết cho (n + 1) thì 4 phải chia hết cho (n + 1). Ước lớn nhất của 4 là 4 => n + 1 = 4 => n = 3.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_11",
    "question": "Tích của ba số tự nhiên liên tiếp n(n + 1)(n + 2) luôn chia hết cho số nào sau đây?",
    "formula": "P = n(n + 1)(n + 2) \\; \\vdots \\; ?",
    "options": [
      "4",
      "5",
      "6",
      "8"
    ],
    "answer": "6",
    "explanation": "Trong 3 số tự nhiên liên tiếp luôn có ít nhất 1 số chẵn (chia hết cho 2) và 1 số chia hết cho 3. Vì ƯCLN(2, 3) = 1 nên tích luôn chia hết cho 2 × 3 = 6.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_12",
    "question": "Một số chia cho 7 dư 3, chia cho 7 dư 5 khi cộng lại thì tổng chia cho 7 dư bao nhiêu?",
    "formula": "(7k_1 + 3) + (7k_2 + 5) \\pmod 7",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "1",
    "explanation": "Tổng số dư là 3 + 5 = 8. 8 chia 7 dư 1.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_13",
    "question": "Có bao nhiêu số có 2 chữ số chia hết cho 5?",
    "formula": "10 \\le 5k \\le 95",
    "options": [
      "17",
      "18",
      "19",
      "20"
    ],
    "answer": "18",
    "explanation": "Các số từ 10 đến 95: (95 - 10) / 5 + 1 = 18 số.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "CHIA_HET",
    "level": "THCS"
  },
  {
    "id": "CH_14",
    "question": "Số 123456 có chia hết cho 9 không?",
    "formula": "123456 \\; \\vdots \\; 9 \\; ?",
    "options": [
      "Không, dư 3",
      "Có chia hết",
      "Không, dư 6",
      "Không, dư 1"
    ],
    "answer": "Không, dư 3",
    "explanation": "Tổng chữ số: 1+2+3+4+5+6 = 21. 21 chia 9 dư 3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHIA_HET",
    "level": "CO_BAN"
  },
  {
    "id": "CH_15",
    "question": "Nếu a chia hết cho 3 và b chia hết cho 3 thì a + b có chia hết cho 3 không?",
    "formula": "a \\; \\vdots \\; 3, \\; b \\; \\vdots \\; 3 \\implies (a + b) \\; \\vdots \\; 3",
    "options": [
      "Luôn luôn chia hết",
      "Không bao giờ chia hết",
      "Chỉ chia hết khi a > b",
      "Tùy thuộc giá trị"
    ],
    "answer": "Luôn luôn chia hết",
    "explanation": "Tính chất chia hết của một tổng: a = 3m, b = 3n => a + b = 3(m + n) luôn chia hết cho 3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "CHIA_HET",
    "level": "CO_BAN"
  },
  {
    "id": "PS_01",
    "question": "Tính giá trị biểu thức phân số: 2/3 + 3/4 = ?",
    "formula": "\\frac{2}{3} + \\frac{3}{4} = ?",
    "options": [
      "5/7",
      "17/12",
      "13/12",
      "19/12"
    ],
    "answer": "17/12",
    "explanation": "Quy đồng mẫu số chung là 12: 8/12 + 9/12 = 17/12.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_02",
    "question": "Rút gọn phân số: (3/5) × (10/9) = ?",
    "formula": "\\frac{3}{5} \\times \\frac{10}{9} = ?",
    "options": [
      "1/3",
      "2/3",
      "3/2",
      "5/6"
    ],
    "answer": "2/3",
    "explanation": "(3 × 10) / (5 × 9) = 30 / 45 = 2/3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "PHAN_SO",
    "level": "CO_BAN"
  },
  {
    "id": "PS_03",
    "question": "Thực hiện phép chia phân số: (7/8) : (14/16) = ?",
    "formula": "\\frac{7}{8} : \\frac{14}{16} = ?",
    "options": [
      "1/2",
      "1",
      "2",
      "49/64"
    ],
    "answer": "1",
    "explanation": "14/16 rút gọn là 7/8. Hai phân số bằng nhau chia cho nhau ra kết quả 1.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "PHAN_SO",
    "level": "CO_BAN"
  },
  {
    "id": "PS_04",
    "question": "Tìm x biết: (2/5)x = 6",
    "formula": "\\frac{2}{5}x = 6 \\implies x = ?",
    "options": [
      "12",
      "15",
      "18",
      "20"
    ],
    "answer": "15",
    "explanation": "x = 6 : (2/5) = 6 × (5/2) = 15.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_05",
    "question": "Tính giá trị của S = 1/(1×2) + 1/(2×3) + 1/(3×4) + ... + 1/(9×10) = ?",
    "formula": "S = \\sum_{i=1}^9 \\frac{1}{i(i+1)} = 1 - \\frac{1}{10}",
    "options": [
      "9/10",
      "10/11",
      "8/9",
      "1"
    ],
    "answer": "9/10",
    "explanation": "1/(n(n+1)) = 1/n - 1/(n+1). Triệt tiêu liên tiếp: 1 - 1/10 = 9/10.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_06",
    "question": "Phân số nào sau đây lớn nhất?",
    "formula": "\\frac{a}{b} \\; \\text{lớn nhất}",
    "options": [
      "3/4",
      "4/5",
      "5/6",
      "6/7"
    ],
    "answer": "6/7",
    "explanation": "Hiệu giữa mẫu và tử đều bằng 1 (1 - 3/4 = 1/4; 1 - 4/5 = 1/5; ...; 1 - 6/7 = 1/7). Vì phần bù 1/7 nhỏ nhất nên phân số 6/7 lớn nhất.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_07",
    "question": "Tính: 5/6 - 1/4 = ?",
    "formula": "\\frac{5}{6} - \\frac{1}{4} = ?",
    "options": [
      "7/12",
      "4/2",
      "1/3",
      "2/5"
    ],
    "answer": "7/12",
    "explanation": "Mẫu chung 12: 10/12 - 3/12 = 7/12.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_08",
    "question": "Rút gọn phân số 48/72 về phân số tối giản:",
    "formula": "\\frac{48}{72} = ?",
    "options": [
      "2/3",
      "3/4",
      "4/6",
      "6/9"
    ],
    "answer": "2/3",
    "explanation": "ƯCLN(48, 72) = 24. Chia cả tử và mẫu cho 24: (48:24) / (72:24) = 2/3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "PHAN_SO",
    "level": "CO_BAN"
  },
  {
    "id": "PS_09",
    "question": "Biết rằng 3/4 của một số là 24. Số đó bằng bao nhiêu?",
    "formula": "\\frac{3}{4} N = 24 \\implies N = ?",
    "options": [
      "18",
      "28",
      "32",
      "36"
    ],
    "answer": "32",
    "explanation": "N = 24 : (3/4) = 24 × (4/3) = 32.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_10",
    "question": "Chuyển hỗn số 3 2/5 thành phân số được kết quả là:",
    "formula": "3\\frac{2}{5} = \\frac{3 \\times 5 + 2}{5} = ?",
    "options": [
      "11/5",
      "13/5",
      "17/5",
      "19/5"
    ],
    "answer": "17/5",
    "explanation": "3 × 5 + 2 = 17 => 17/5.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "PHAN_SO",
    "level": "CO_BAN"
  },
  {
    "id": "PS_11",
    "question": "Tỉ số phần trăm của 15 và 60 là bao nhiêu?",
    "formula": "\\frac{15}{60} \\times 100\\% = ?",
    "options": [
      "20%",
      "25%",
      "30%",
      "35%"
    ],
    "answer": "25%",
    "explanation": "15 / 60 = 1/4 = 0.25 = 25%.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "PHAN_SO",
    "level": "CO_BAN"
  },
  {
    "id": "PS_12",
    "question": "Tìm x trong tỉ lệ thức: x / 6 = 15 / 18",
    "formula": "\\frac{x}{6} = \\frac{15}{18} \\implies x = ?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "5",
    "explanation": "15/18 = 5/6 => x / 6 = 5 / 6 => x = 5.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_13",
    "question": "Tính giá trị: 1 - 1/2 + 1/4 - 1/8 + 1/8 = ?",
    "formula": "1 - \\frac{1}{2} + \\frac{1}{4} = ?",
    "options": [
      "1/2",
      "3/4",
      "5/8",
      "7/8"
    ],
    "answer": "3/4",
    "explanation": "Hai số -1/8 và +1/8 triệt tiêu. Còn 1 - 1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_14",
    "question": "Một lớp học có 40 học sinh, trong đó 3/5 là học sinh nữ. Số học sinh nam là:",
    "formula": "N_{\\text{nam}} = 40 \\times \\left(1 - \\frac{3}{5}\\right) = ?",
    "options": [
      "14",
      "16",
      "24",
      "26"
    ],
    "answer": "16",
    "explanation": "Số nữ là 40 × 3/5 = 24. Số nam là 40 - 24 = 16.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "PHAN_SO",
    "level": "THCS"
  },
  {
    "id": "PS_15",
    "question": "Nghịch đảo của phân số -3/7 là:",
    "formula": "\\left(-\\frac{3}{7}\\right)^{-1} = ?",
    "options": [
      "3/7",
      "-7/3",
      "7/3",
      "-3/7"
    ],
    "answer": "-7/3",
    "explanation": "Nghịch đảo của a/b là b/a. Do đó nghịch đảo của -3/7 là -7/3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "PHAN_SO",
    "level": "CO_BAN"
  },
  {
    "id": "TD_01",
    "question": "Giải phương trình trị tuyệt đối: |2x - 3| = 7",
    "formula": "|2x - 3| = 7 \\implies x \\in \\{?}",
    "options": [
      "{5}",
      "{-2}",
      "{-2; 5}",
      "{-5; 2}"
    ],
    "answer": "{-2; 5}",
    "explanation": "TH1: 2x - 3 = 7 => 2x = 10 => x = 5. TH2: 2x - 3 = -7 => 2x = -4 => x = -2.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_02",
    "question": "Rút gọn biểu thức |√5 - 3| ta được kết quả là:",
    "formula": "|\\sqrt{5} - 3| = ?",
    "options": [
      "√5 - 3",
      "3 - √5",
      "3 + √5",
      "-3 - √5"
    ],
    "answer": "3 - √5",
    "explanation": "Vì √5 ≈ 2.236 < 3 nên √5 - 3 < 0. Do đó |√5 - 3| = -(√5 - 3) = 3 - √5.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_03",
    "question": "Giá trị nhỏ nhất của biểu thức P = |x - 4| + 7 là:",
    "formula": "P = |x - 4| + 7 \\ge 7",
    "options": [
      "0",
      "4",
      "7",
      "11"
    ],
    "answer": "7",
    "explanation": "Vì |x - 4| ≥ 0 với mọi x nên P ≥ 7. Đạt được khi x = 4.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_04",
    "question": "Phương trình |x + 5| = -3 có bao nhiêu nghiệm?",
    "formula": "|x + 5| = -3",
    "options": [
      "Vô nghiệm",
      "1 nghiệm",
      "2 nghiệm",
      "Vô số nghiệm"
    ],
    "answer": "Vô nghiệm",
    "explanation": "Giá trị tuyệt đối của một biểu thức luôn không âm (|A| ≥ 0), không thể bằng số âm -3.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "TUYET_DOI",
    "level": "CO_BAN"
  },
  {
    "id": "TD_05",
    "question": "Tính giá trị của biểu thức: |-15| - |8 - 14| = ?",
    "formula": "|-15| - |-6| = 15 - 6 = ?",
    "options": [
      "9",
      "-9",
      "21",
      "-21"
    ],
    "answer": "9",
    "explanation": "|-15| = 15; |8 - 14| = |-6| = 6. Vậy 15 - 6 = 9.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "TUYET_DOI",
    "level": "CO_BAN"
  },
  {
    "id": "TD_06",
    "question": "Có bao nhiêu số nguyên x thỏa mãn bất phương trình: |x| ≤ 3?",
    "formula": "|x| \\le 3, \\; x \\in \\mathbb{Z}",
    "options": [
      "3",
      "6",
      "7",
      "8"
    ],
    "answer": "7",
    "explanation": "|x| ≤ 3 <=> -3 ≤ x ≤ 3. Các số nguyên x là: -3, -2, -1, 0, 1, 2, 3 (có 7 số).",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_07",
    "question": "Tìm x biết: |x - 2| + |y + 1| = 0",
    "formula": "|x - 2| + |y + 1| = 0",
    "options": [
      "x = 2, y = -1",
      "x = -2, y = 1",
      "x = 2, y = 1",
      "x = 0, y = 0"
    ],
    "answer": "x = 2, y = -1",
    "explanation": "Tổng hai số không âm bằng 0 khi cả hai số đồng thời bằng 0: x - 2 = 0 => x = 2 và y + 1 = 0 => y = -1.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_08",
    "question": "Cho a < b. Rút gọn biểu thức |a - b| - |b - a| = ?",
    "formula": "|a - b| - |b - a| = ?",
    "options": [
      "0",
      "2(b - a)",
      "2(a - b)",
      "Không xác định"
    ],
    "answer": "0",
    "explanation": "Khoảng cách giữa hai số là như nhau: |a - b| = |b - a|. Do đó hiệu của chúng luôn bằng 0.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_09",
    "question": "Tập nghiệm của phương trình |x² - 5| = 4 là:",
    "formula": "x^2 - 5 = \\pm 4",
    "options": [
      "{±1; ±3}",
      "{±3}",
      "{±1}",
      "{1; 3}"
    ],
    "answer": "{±1; ±3}",
    "explanation": "TH1: x² - 5 = 4 => x² = 9 => x = ±3. TH2: x² - 5 = -4 => x² = 1 => x = ±1.",
    "timeLimit": 55,
    "difficulty": 3,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_10",
    "question": "Giá trị lớn nhất của biểu thức M = 10 - |2x + 1| là:",
    "formula": "M = 10 - |2x + 1| \\le 10",
    "options": [
      "0",
      "5",
      "10",
      "11"
    ],
    "answer": "10",
    "explanation": "Vì |2x + 1| ≥ 0 nên 10 - |2x + 1| ≤ 10. Dấu \"=\" đạt được khi 2x + 1 = 0 => Max = 10.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_11",
    "question": "Tính giá trị: |-7| × |-3| - | -10 | = ?",
    "formula": "7 \\times 3 - 10 = ?",
    "options": [
      "11",
      "-11",
      "31",
      "-31"
    ],
    "answer": "11",
    "explanation": "7 × 3 - 10 = 21 - 10 = 11.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "TUYET_DOI",
    "level": "CO_BAN"
  },
  {
    "id": "TD_12",
    "question": "Với x > 3, biểu thức |3 - x| + x bằng bao nhiêu?",
    "formula": "|3 - x| + x \\; (x > 3)",
    "options": [
      "3",
      "2x - 3",
      "2x + 3",
      "-3"
    ],
    "answer": "2x - 3",
    "explanation": "Vì x > 3 nên 3 - x < 0 => |3 - x| = x - 3. Biểu thức bằng (x - 3) + x = 2x - 3.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_13",
    "question": "Tính: | -1/2 | + | -3/4 | = ?",
    "formula": "\\frac{1}{2} + \\frac{3}{4} = ?",
    "options": [
      "1/4",
      "5/4",
      "1",
      "7/4"
    ],
    "answer": "5/4",
    "explanation": "1/2 + 3/4 = 2/4 + 3/4 = 5/4.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "TUYET_DOI",
    "level": "CO_BAN"
  },
  {
    "id": "TD_14",
    "question": "Có bao nhiêu giá trị của x thỏa mãn: |x| = x?",
    "formula": "|x| = x \\iff x \\ge 0",
    "options": [
      "Chỉ x = 0",
      "Chỉ x > 0",
      "Vô số (mọi x ≥ 0)",
      "Không có giá trị nào"
    ],
    "answer": "Vô số (mọi x ≥ 0)",
    "explanation": "Theo định nghĩa, |x| = x với mọi số thực không âm x ≥ 0 (vô số giá trị).",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "TUYET_DOI",
    "level": "THCS"
  },
  {
    "id": "TD_15",
    "question": "Giải phương trình: |x| = 0",
    "formula": "|x| = 0 \\implies x = ?",
    "options": [
      "x = 0",
      "x = ±1",
      "x > 0",
      "Vô nghiệm"
    ],
    "answer": "x = 0",
    "explanation": "Số duy nhất có giá trị tuyệt đối bằng 0 là số 0.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "TUYET_DOI",
    "level": "CO_BAN"
  },
  {
    "id": "UB_01",
    "question": "Ước chung lớn nhất của 72 và 108 là số nào?",
    "formula": "\\text{ƯCLN}(72, 108) = ?",
    "options": [
      "18",
      "24",
      "36",
      "54"
    ],
    "answer": "36",
    "explanation": "72 = 2³ × 3² và 108 = 2² × 3³. ƯCLN(72, 108) = 2² × 3² = 4 × 9 = 36.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_02",
    "question": "Bội chung nhỏ nhất của 14 và 21 là số nào?",
    "formula": "\\text{BCNN}(14, 21) = ?",
    "options": [
      "28",
      "42",
      "56",
      "84"
    ],
    "answer": "42",
    "explanation": "14 = 2 × 7 và 21 = 3 × 7. BCNN(14, 21) = 2 × 3 × 7 = 42.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_03",
    "question": "Số tự nhiên 360 có tất cả bao nhiêu ước nguyên dương?",
    "formula": "360 = 2^3 \\times 3^2 \\times 5^1 \\implies d(360) = ?",
    "options": [
      "18",
      "20",
      "24",
      "28"
    ],
    "answer": "24",
    "explanation": "Phân tích: 360 = 2³ × 3² × 5¹. Số lượng ước số là (3 + 1)(2 + 1)(1 + 1) = 4 × 3 × 2 = 24 ước.",
    "timeLimit": 60,
    "difficulty": 3,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_04",
    "question": "Biết tích của hai số tự nhiên là 300 và ƯCLN của chúng là 5. BCNN của hai số đó bằng bao nhiêu?",
    "formula": "a \\times b = \\text{ƯCLN}(a,b) \\times \\text{BCNN}(a,b)",
    "options": [
      "30",
      "50",
      "60",
      "75"
    ],
    "answer": "60",
    "explanation": "Công thức: a × b = ƯCLN(a, b) × BCNN(a, b) => BCNN = 300 / 5 = 60.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_05",
    "question": "Hai số nguyên tố cùng nhau là hai số có ước chung lớn nhất bằng:",
    "formula": "\\text{ƯCLN}(a, b) = ?",
    "options": [
      "0",
      "1",
      "2",
      "Chính tích của chúng"
    ],
    "answer": "1",
    "explanation": "Theo định nghĩa, hai số nguyên tố cùng nhau khi ƯCLN của chúng bằng 1.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "UOC_BOI",
    "level": "CO_BAN"
  },
  {
    "id": "UB_06",
    "question": "Cặp số nào sau đây là hai số nguyên tố cùng nhau?",
    "formula": "\\text{ƯCLN}(a, b) = 1",
    "options": [
      "8 và 15",
      "9 và 21",
      "12 và 18",
      "14 và 35"
    ],
    "answer": "8 và 15",
    "explanation": "8 = 2³ và 15 = 3 × 5 không có thừa số nguyên tố chung nào nên ƯCLN(8, 15) = 1.",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_07",
    "question": "Có bao nhiêu bội chung nhỏ hơn 100 của cả 4 và 6?",
    "formula": "k \\times \\text{BCNN}(4, 6) < 100",
    "options": [
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "8",
    "explanation": "BCNN(4, 6) = 12. Các bội chung dương nhỏ hơn 100 là: 12, 24, 36, 48, 60, 72, 84, 96 (tổng cộng 8 số).",
    "timeLimit": 55,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_08",
    "question": "Tìm số tự nhiên x lớn nhất biết 48 chia hết cho x và 72 chia hết cho x:",
    "formula": "x = \\text{ƯCLN}(48, 72)",
    "options": [
      "12",
      "16",
      "24",
      "36"
    ],
    "answer": "24",
    "explanation": "x là ƯCLN(48, 72). 48 = 24 × 2, 72 = 24 × 3 => ƯCLN = 24.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_09",
    "question": "Số 100 có tất cả bao nhiêu ước nguyên dương?",
    "formula": "100 = 2^2 \\times 5^2 \\implies d(100) = ?",
    "options": [
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "9",
    "explanation": "100 = 2² × 5² => Số ước là (2 + 1)(2 + 1) = 3 × 3 = 9 ước (1, 2, 4, 5, 10, 20, 25, 50, 100).",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_10",
    "question": "Ước chung lớn nhất của hai số tự nhiên liên tiếp n và (n + 1) luôn bằng:",
    "formula": "\\text{ƯCLN}(n, n + 1) = ?",
    "options": [
      "1",
      "2",
      "n",
      "Không xác định"
    ],
    "answer": "1",
    "explanation": "Gọi d là ước chung của n và n+1 thì d là ước của (n+1) - n = 1 => d = 1. Hai số tự nhiên liên tiếp luôn nguyên tố cùng nhau.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_11",
    "question": "BCNN của 12, 15 và 20 là số nào?",
    "formula": "\\text{BCNN}(12, 15, 20) = ?",
    "options": [
      "40",
      "60",
      "90",
      "120"
    ],
    "answer": "60",
    "explanation": "12 = 2² × 3, 15 = 3 × 5, 20 = 2² × 5. BCNN = 2² × 3 × 5 = 60.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_12",
    "question": "Tổng tất cả các ước nguyên dương của số 12 bằng bao nhiêu?",
    "formula": "\\sigma(12) = 1 + 2 + 3 + 4 + 6 + 12 = ?",
    "options": [
      "24",
      "26",
      "28",
      "30"
    ],
    "answer": "28",
    "explanation": "Các ước của 12 là 1, 2, 3, 4, 6, 12. Tổng: 1 + 2 + 3 + 4 + 6 + 12 = 28.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_13",
    "question": "Số tự nhiên a nhỏ nhất khác 0 chia hết cho cả 18 và 24 là:",
    "formula": "a = \\text{BCNN}(18, 24)",
    "options": [
      "36",
      "48",
      "72",
      "96"
    ],
    "answer": "72",
    "explanation": "18 = 2 × 3², 24 = 2³ × 3 => BCNN(18, 24) = 2³ × 3² = 72.",
    "timeLimit": 50,
    "difficulty": 2,
    "category": "UOC_BOI",
    "level": "THCS"
  },
  {
    "id": "UB_14",
    "question": "Số nguyên nào sau đây là ước của mọi số nguyên?",
    "formula": "d \\mid a \\; (\\forall a \\in \\mathbb{Z})",
    "options": [
      "0",
      "1",
      "2",
      "Chính nó"
    ],
    "answer": "1",
    "explanation": "Số 1 (và -1) là ước của mọi số nguyên vì với mọi số nguyên a thì a = 1 × a.",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "UOC_BOI",
    "level": "CO_BAN"
  },
  {
    "id": "UB_15",
    "question": "Bội nhỏ nhất khác 0 của số 13 là số nào?",
    "formula": "b \\in B(13), \\; b > 0 \\; \\text{nhỏ nhất}",
    "options": [
      "0",
      "1",
      "13",
      "26"
    ],
    "answer": "13",
    "explanation": "Bội dương nhỏ nhất của một số nguyên dương chính là số đó (13 × 1 = 13).",
    "timeLimit": 50,
    "difficulty": 1,
    "category": "UOC_BOI",
    "level": "CO_BAN"
  }
];

// Helper to generate dynamic, challenging questions if repository runs out
function generateProceduralQuestion(category: MathCategory, level: MathLevel = 'THCS'): Question {
  const qId = `PROC_${category}_${Date.now()}_${randInt(10, 99)}`;

  switch (category) {
    case 'NGUYEN_TO': {
      const primes = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
      const targetPrime = primes[randInt(0, primes.length - 1)];
      const composites = [51, 57, 63, 69, 77, 81, 87, 91, 93, 95];
      const wrong = composites.sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [targetPrime.toString(), ...wrong.map(w => w.toString())].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        question: `Trong các số sau đây, số nào là số nguyên tố?`,
        formula: `p \\text{ là số nguyên tố}`,
        options: opts,
        answer: targetPrime.toString(),
        explanation: `${targetPrime} là số nguyên tố vì chỉ có hai ước số dương phân biệt là 1 và chính nó.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'CHINH_PHUONG': {
      const n = randInt(11, 25);
      const sq = n * n;
      const opts = [sq.toString(), (sq + 10).toString(), (sq - 10).toString(), (n * 20).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tính giá trị của ${n}² (${n} bình phương) = ?`,
        formula: `${n}^2 = ?`,
        options: opts,
        answer: sq.toString(),
        explanation: `${n}² = ${n} × ${n} = ${sq}.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'DAI_SO': {
      const a = randInt(2, 5);
      const xVal = randInt(3, 9);
      const b = randInt(5, 15);
      const rhs = a * xVal + b;
      const opts = [xVal.toString(), (xVal + 2).toString(), (xVal - 1).toString(), (xVal + 3).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tìm x biết: ${a}x + ${b} = ${rhs}`,
        formula: `${a}x + ${b} = ${rhs} \\implies x = ?`,
        options: opts,
        answer: xVal.toString(),
        explanation: `${a}x = ${rhs} - ${b} = ${a * xVal} \\implies x = ${xVal}.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'KHAI_CAN': {
      const n = randInt(11, 20);
      const sq = n * n;
      const opts = [n.toString(), (n + 1).toString(), (n - 1).toString(), (n + 2).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tính giá trị căn bậc hai: √${sq} = ?`,
        formula: `\\sqrt{${sq}} = ?`,
        options: opts,
        answer: n.toString(),
        explanation: `Vì ${n}² = ${sq} nên √${sq} = ${n}.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'LUY_THUA': {
      const base = 2;
      const exp = randInt(5, 8);
      const val = Math.pow(base, exp);
      const opts = [val.toString(), (val / 2).toString(), (val * 2).toString(), (val + 16).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tính giá trị lũy thừa: ${base}^${exp} = ?`,
        formula: `${base}^{${exp}} = ?`,
        options: opts,
        answer: val.toString(),
        explanation: `${base}^${exp} = ${val}.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'AM_SO': {
      const a = randInt(12, 25);
      const b = randInt(26, 45);
      const ans = a - b;
      const opts = [ans.toString(), (-ans).toString(), (ans - 5).toString(), (ans + 5).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tính giá trị: ${a} - ${b} = ?`,
        formula: `${a} - ${b} = ?`,
        options: opts,
        answer: ans.toString(),
        explanation: `${a} - ${b} = -(${b} - ${a}) = ${ans}.`,
        timeLimit: 50,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'CHIA_HET': {
      const mult = randInt(12, 35);
      const ans = mult * 9;
      const wrong1 = ans + 2;
      const wrong2 = ans + 4;
      const wrong3 = ans + 5;
      const opts = [ans.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Trong các số sau, số nào chia hết cho 9?`,
        formula: `n \\; \\vdots \\; 9`,
        options: opts,
        answer: ans.toString(),
        explanation: `${ans} có tổng các chữ số chia hết cho 9 nên ${ans} chia hết cho 9.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'PHAN_SO': {
      const a = randInt(1, 3);
      const b = 5;
      const c = randInt(1, 3);
      const num = a * 2 + c;
      const den = 10;
      const ansStr = `${num}/${den}`;
      const opts = [ansStr, `${num + 1}/${den}`, `${num - 1}/${den}`, '1/2'].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tính giá trị: ${a}/5 + ${c}/10 = ?`,
        formula: `\\frac{${a}}{5} + \\frac{${c}}{10} = ?`,
        options: opts,
        answer: ansStr,
        explanation: `Quy đồng mẫu 10: ${a * 2}/10 + ${c}/10 = ${num}/${den}.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    case 'TUYET_DOI': {
      const val = randInt(15, 60);
      const opts = [val.toString(), (-val).toString(), '0', (val * 2).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `Tính giá trị tuyệt đối: |-${val}| = ?`,
        formula: `|-${val}| = ?`,
        options: opts,
        answer: val.toString(),
        explanation: `Giá trị tuyệt đối của một số luôn không âm: |-${val}| = ${val}.`,
        timeLimit: 50,
        difficulty: 1,
        category,
        level,
      };
    }

    case 'UOC_BOI': {
      const g = randInt(3, 8);
      const x = g * 3;
      const y = g * 4;
      const opts = [g.toString(), (g * 2).toString(), '1', (g + 2).toString()].sort(() => Math.random() - 0.5);
      return {
        id: qId,
        question: `ƯCLN của ${x} và ${y} bằng bao nhiêu?`,
        formula: `\\text{ƯCLN}(${x}, ${y}) = ?`,
        options: opts,
        answer: g.toString(),
        explanation: `ƯCLN(${x}, ${y}) = ${g}.`,
        timeLimit: 55,
        difficulty: 2,
        category,
        level,
      };
    }

    default: {
      return CURATED_QUESTIONS[randInt(0, CURATED_QUESTIONS.length - 1)];
    }
  }
}

// Function to obtain a question matching category and level
export function getQuestionForCategory(category: MathCategory, level: MathLevel = 'THCS'): Question {
  const matched = CURATED_QUESTIONS.filter(q => q.category === category);
  if (matched.length > 0 && Math.random() > 0.15) {
    return matched[randInt(0, matched.length - 1)];
  }
  return generateProceduralQuestion(category, level);
}
