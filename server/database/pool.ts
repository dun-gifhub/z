import pg from 'pg';

const { Pool } = pg;

// DATABASE_URL: connection string lấy từ Neon (https://console.neon.tech)
// Dạng: postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require
const connectionString = process.env.DATABASE_URL;

export const hasDatabase = !!connectionString;

// Neon luôn yêu cầu kết nối qua SSL. rejectUnauthorized: false vì Neon dùng
// chứng chỉ được ký bởi CA công khai nhưng driver `pg` mặc định đôi khi không
// nhận diện được chuỗi chứng chỉ trung gian trên một số môi trường container.
export const pool = hasDatabase
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    })
  : null;

if (pool) {
  pool.on('error', (err) => {
    console.error('❌ Lỗi kết nối Neon Postgres (idle client):', err.message);
  });
} else {
  console.warn(
    '⚠️  Chưa đặt DATABASE_URL — server đang chạy ở chế độ TẠM (dữ liệu chỉ lưu trong RAM, sẽ mất khi restart).\n' +
    '   Hãy tạo database miễn phí tại https://neon.tech rồi đặt biến môi trường DATABASE_URL để lưu dữ liệu vĩnh viễn.'
  );
}
