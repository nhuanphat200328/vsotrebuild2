# SPEAKER DATA AUDIT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguồn và phạm vi

Đọc/đối chiếu:
- `PrototypeClone/public_html/hoinghi2026/data/programme.json` (read-only).
- Toàn bộ DB Supabase hiện tại: `people`, `session_people`, `presentation_people`,
  tất cả ngày/phòng/phiên của VSOT 2026.

Không sửa file nguồn. Không tách máy móc mọi dấu phẩy/gạch; chỉ tách khi đoạn sau
bắt đầu bằng học hàm/học vị/chức danh.

## 2. Kết quả audit

- Tổng người trước xử lý: **245 published**.
- Chuỗi bị gộp phát hiện trong DB: **8 people** (7 chuỗi nhiều người + 1 chuỗi trùng
  cùng một người).
- Tổng entry nguồn có dạng gộp: **9** (một chuỗi xuất hiện ở 2 presentation).
- Sau xử lý:
  - **246 published**, **8 archived** (ẩn hoàn toàn, không còn assignment).
  - Tạo **9 profile mới**; tái sử dụng **6 profile đã tồn tại**.
  - `presentation_people`: 221 → **229** (thêm người thứ 2 cho các bài bị gộp).
  - `session_people`: **127** (không có chair/discussant bị gộp).
  - **0** chuỗi nhiều người còn published.
  - **8/8** parent archived không còn tham chiếu.

## 3. Mapping đã tách

| Parent ban đầu | Người sau tách | Xử lý |
|---|---|---|
| `PGS.TS. Dương Đức Hùng – PGS.TS. Phùng Duy Hồng Sơn` | Dương Đức Hùng; Phùng Duy Hồng Sơn | Tái sử dụng profile có sẵn |
| `TS. Bùi Đức An Vinh - ThS.BS Nguyễn Đức Dũng` | Bùi Đức An Vinh; Nguyễn Đức Dũng | Tạo mới + tái sử dụng |
| `BSCK1. Nguyễn Hữu Nghiệm / TS. Phạm Văn Đông` | Nguyễn Hữu Nghiệm; Phạm Văn Đông | Tạo mới + tái sử dụng |
| `BSCK2 Đặng Thế Uyên, ThS. Nguyễn Thành Luân` | Đặng Thế Uyên; Nguyễn Thành Luân | Tạo mới cả hai |
| `TS. Đặng Quốc Việt / BS Trần Bình Dương` | Đặng Quốc Việt; Trần Bình Dương | Tạo mới cả hai |
| `TS.BS Ngô Tuấn Anh - ThS.BS Lê Hữu Công` | Ngô Tuấn Anh; Lê Hữu Công | Tái sử dụng + tạo mới |
| `TS. Nguyễn Thị Thu Hà - ThS. Diêm Thị Vân` | Nguyễn Thị Thu Hà; Diêm Thị Vân | Tạo mới + tái sử dụng; áp dụng cho 2 presentation |
| `Young Hoon Kim, Prof. Young Hoon Kim` | Young Hoon Kim | Cùng một người lặp lại → 1 profile, không tạo 2 |

Profile mới: Bùi Đức An Vinh, Nguyễn Hữu Nghiệm, Đặng Thế Uyên, Nguyễn Thành Luân,
Đặng Quốc Việt, Trần Bình Dương, Lê Hữu Công, Nguyễn Thị Thu Hà, Young Hoon Kim.

## 4. Trường hợp không tách / cần kiểm tra

- `Dr Nguyen Thi Hoai An, Da Nang Hospital`: **một người + tên đơn vị**, không phải hai
  người. Migration `0029` đã sửa `full_name = Nguyen Thi Hoai An`, `title = Dr`,
  `institution = Da Nang Hospital`; giữ slug cũ để không gãy URL.
- `Young Hoon Kim, Prof. Young Hoon Kim`: hai cách ghi của cùng một người → gộp một
  profile, không tạo hai hồ sơ.
- Các profile trùng tên **đã tồn tại trước** (ví dụ `phung-duy-hong-son` và `-2`,
  `nguyen-duc-dung` và `-2`, `pham-van-dong` và `-2`, `ngo-tuan-anh` và `-2`) không do
  lần split này tạo; lần này tái sử dụng profile đầu tiên. Cần kiểm tra thủ công nếu
  muốn gộp các duplicate cũ.

## 5. Script / tầng dữ liệu

- `scripts/split_combined_people.py`: dry-run/`--apply`; parse title-aware, tạo/tái sử
  dụng người, chuyển assignment, archive parent.
- `scripts/repair_split_assignments.py`: dry-run/`--apply`; đọc source programme để gắn
  **tất cả** người đã tách vào đúng presentation/session, idempotent.
- Không sửa `programme.json` gốc; không xóa dữ liệu lịch sử (parent được archive).

## 6. Kiểm tra UI

- `/vi/hoi-nghi/2026/phien/<session của 2026-10-17-6-2>`: có cả Ngô Tuấn Anh và
  Lê Hữu Công, link hồ sơ riêng.
- Các presentation `6-0`, `6-3`, `13-2`, `23-0`, `23-1`, `37-4`, `16-6-2` đều có
  đủ 2 presenter đúng thứ tự.
- Faculty directory có 246 người; profile mới mở 200:
  `le-huu-cong`, `dang-the-uyen`, `nguyen-thi-thu-ha`.
- Không còn profile tên gộp có `/`, `–`, ` - ` trong danh sách published.

## 7. Tồn tại

- Duplicate profile cũ (không do lần này tạo) chưa gộp; cần quyết định thủ công.
- `Dr Nguyen Thi Hoai An` đã tách đơn vị khỏi tên; slug/URL cũ vẫn giữ để bảo toàn liên kết.
- DB đã thay đổi; nếu chạy lại `import_2026.py`, cần chạy lại 2 script split/repair
  hoặc bổ sung normalize vào import.
- Live Vercel chưa deploy commit UI mới.
