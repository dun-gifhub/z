<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1de04df5-ba18-43f6-b856-29d5373bd282

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Cơ sở dữ liệu (Neon Postgres)

Dữ liệu người dùng, hồ sơ, lịch sử trận đấu, gói Premium... được lưu vĩnh viễn
trên [Neon](https://neon.tech) (Postgres serverless, có gói miễn phí):

1. Tạo tài khoản tại https://neon.tech, tạo 1 project mới.
2. Vào **Connection Details**, copy connection string dạng:
   `postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require`
3. Đặt biến môi trường `DATABASE_URL` bằng chuỗi đó (trong file `.env` khi chạy
   local, hoặc trong Render Dashboard -> Environment khi deploy).
4. Chạy server — bảng dữ liệu sẽ **tự động được tạo** trong lần khởi động đầu
   tiên, không cần chạy tay file `database/schema.sql` (file đó chỉ để tham khảo).

Nếu chưa đặt `DATABASE_URL`, server vẫn chạy bình thường nhưng dữ liệu chỉ lưu
tạm trong RAM và sẽ **mất khi restart** — chỉ nên bỏ trống lúc code/test cục bộ.

