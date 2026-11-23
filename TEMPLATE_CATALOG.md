# TEMPLATE CATALOG — demo ver2

Ngày khảo sát: 2026-11-23
Phạm vi: `D:\Philao\code project\VSOT\demo ver2\template`
Trạng thái: chỉ đọc/khảo sát. Không sửa, xóa, di chuyển hoặc ghi đè file template. `git status` của template sạch.

## Tổng quan

| Thư mục | Loại website | Stack chính | Số trang HTML | Mức hoàn thiện | Tái sử dụng |
|---|---|---|---|---|---|
| `novena` | Website y tế/phòng khám, landing + nhiều trang nội dung | HTML5 tĩnh + Bootstrap 4.3.1 + jQuery 3.3.1 + SCSS + PHP mail | 13 | Giao diện đầy đủ, backend gần như chưa có | Cao cho site tĩnh; trung bình khi tách component; thấp nếu dự án dùng framework khác |

Chỉ có 1 template trong thư mục `template`: `novena`.

---

## 1. `template/novena`

### 1.1. Nhận diện

| Trường | Giá trị |
|---|---|
| Tên thư mục | `novena` |
| Tên template | Novena — Health & Care Medical template |
| Nguồn gốc | `https://github.com/technext/novena.git` (commit `f264889e2680f2735c6a476ef82ded6dc02bd067`, 2021-06-21) |
| Tác giả/nhà phát hành ghi trong file | Themefisher (`https://themefisher.com/`) |
| Phiên bản ghi trong `changelog.md` | 1.0.0 (25-08-2019), Bootstrap 4.3.1 |
| Giấy phép | File `license`: dùng cho personal/commercial, được sửa, được bàn giao cho client; **không được bán lại, phát hành lại hoặc sub-license template gốc** |
| Ngôn ngữ nội dung | Tiếng Anh |
| Loại website | Y tế, phòng khám/bệnh viện: giới thiệu, dịch vụ, khoa, bác sĩ, đặt lịch, blog, liên hệ |
| Trạng thái | Static site; form và backend chỉ ở mức demo |

### 1.2. Công nghệ và phiên bản

| Thành phần | Công nghệ | Phiên bản | Ghi chú |
|---|---|---|---|
| Markup | HTML5 | — | 13 file `.html`, không có template engine |
| CSS framework | Bootstrap | **4.3.1** | Bản local trong `plugins/bootstrap/` |
| CSS tùy biến | SCSS + CSS biên dịch sẵn | — | `scss/` (partials) → `css/style.css` + `css/maps/style.css.map` |
| CSS icon | IcoFont | Không khai báo số version (bản quyền 2015–2018) | `plugins/icofont/` |
| JavaScript | jQuery | **3.3.1** | `plugins/jquery/jquery.js` |
| JS UI | Bootstrap JS + Popper | 4.3.1 (đi kèm) | `plugins/bootstrap/js/` |
| Slider | Slick Carousel | Không khai báo số version | `plugins/slick-carousel/slick/` |
| Lọc/sắp xếp | Shuffle.js | Không khai báo số version | `plugins/shuffle/shuffle.min.js` |
| Đếm số | CounterUp + Waypoints + jQuery Easing | Không khai báo số version | `plugins/counterup/` |
| Bản đồ | Google Maps JavaScript API | — | Gọi từ các trang; `plugins/google-map/map.js` |
| Form backend | PHP `mail()` | Không xác định | `mail.php` |
| Build tool | Không có | — | Không có `package.json`, `vite`, `webpack`, `gulp`; SCSS không có script build kèm |
| Font | Google Fonts: Exo, Roboto | — | `@import` trong `css/style.css` |
| Docs page | Bootstrap 4.5.3 qua CDN + Helpscout beacon | — | Chỉ trong `documentation.html` |

### 1.3. Cấu trúc thư mục

```text
template/novena/
├── .git/                      # lịch sử git của template gốc; không copy sang dự án mới
├── .gitattributes
├── index.html                 # trang chủ
├── about.html
├── service.html
├── department.html
├── department-single.html
├── doctor.html
├── doctor-single.html
├── appoinment.html            # tên file gốc viết sai chính tả, giữ nguyên
├── confirmation.html
├── blog-sidebar.html
├── blog-single.html
├── contact.html
├── documentation.html         # trang tài liệu của template, không phải trang nghiệp vụ
├── changelog.md
├── license
├── mail.php                   # endpoint gửi mail demo
├── css/
│   ├── style.css              # CSS đã biên dịch (~22 KB)
│   └── maps/style.css.map
├── images/                    # 44 file ảnh: about, bg, blog, service, team, logo
├── js/
│   ├── script.js              # slider, counter, shuffle, scroll-top, map init
│   └── contact.js             # AJAX submit form liên hệ
├── plugins/
│   ├── bootstrap/{css,js}/
│   ├── counterup/
│   ├── google-map/map.js
│   ├── icofont/{fonts,css,demo}
│   ├── jquery/jquery.js
│   ├── shuffle/shuffle.min.js
│   └── slick-carousel/slick/
└── scss/
    ├── style.scss
    ├── _variables.scss
    ├── _mixins.scss
    ├── _media-query.scss
    ├── _typography.scss
    ├── _common.scss
    ├── _color.scss             # rỗng
    └── templates/              # 18 partial: header, navigation, slider, about, service, ...
```

Tổng dung lượng (không tính `.git`): khoảng 6.46 MB, 121 file.

### 1.4. Danh sách trang và thành phần

| File | Vai trò | Thành phần chính | Form |
|---|---|---|---|
| `index.html` | Trang chủ | Hero/banner, features, about, CTA, service, đặt lịch, testimonial, logo đối tác | Đặt lịch + subscribe |
| `about.html` | Giới thiệu | Page title, about, thành tựu, bác sĩ, testimonial | Subscribe |
| `service.html` | Danh sách dịch vụ | Page title, service grid, CTA | Subscribe |
| `department.html` | Danh sách khoa | Page title, department/service grid | Subscribe |
| `department-single.html` | Chi tiết khoa | Nội dung khoa, sidebar/dịch vụ liên quan | Subscribe |
| `doctor.html` | Danh sách bác sĩ | Doctor grid, CTA | Subscribe |
| `doctor-single.html` | Hồ sơ bác sĩ | Tiểu sử, bằng cấp, kỹ năng, sidebar | Subscribe |
| `appoinment.html` | Đặt lịch | Form đặt lịch, thông tin liên hệ | Đặt lịch + subscribe |
| `confirmation.html` | Xác nhận đặt lịch | Thông báo cảm ơn | Subscribe |
| `blog-sidebar.html` | Blog dạng lưới + sidebar | Bài viết, search, subscribe, phân trang | Search + subscribe |
| `blog-single.html` | Chi tiết bài viết | Nội dung bài, blockquote, tags, comment, sidebar | Comment + search + subscribe |
| `contact.html` | Liên hệ | Thông tin liên hệ, bản đồ, form liên hệ | Liên hệ → `mail.php` + subscribe |
| `documentation.html` | Tài liệu template | Banner, CTA, link docs Themefisher | Không có |

Thành phần giao diện tái sử dụng được: header top bar, navbar responsive có dropdown, hero/slider, section title, card dịch vụ, card khoa, card bác sĩ, counter, testimonial slider, CTA band, footer nhiều cột, back-to-top, breadcrumb/page-title.

### 1.5. Chức năng đã triển khai

Đã có ở mức front-end:

- Menu responsive bằng Bootstrap collapse, dropdown đa cấp.
- Slick Carousel: slider hero/portfolio, testimonial, logo đối tác.
- CounterUp cho số liệu thống kê.
- Shuffle.js cho lọc/masonry (khởi tạo trong `js/script.js`).
- AJAX submit form liên hệ trong `js/contact.js`.
- Google Maps khởi tạo trong `js/script.js` và `plugins/google-map/map.js`.
- Scroll-to-top.

Chưa hoàn chỉnh / chỉ là placeholder:

- Hầu hết `<form action="#">`; form đặt lịch và subscribe không gửi dữ liệu.
- Chỉ `contact.html` trỏ tới `mail.php`.
- `mail.php` là demo, chưa có CSRF, captcha, rate limit; có lỗi biến (`$phone` không được gán, `$content` bị ghi đè).
- Không có CMS, database, authentication, API.
- Không có trang 404, sitemap, robots.txt.
- Không có build pipeline cho SCSS.

### 1.6. Cách chạy thử

Không cần `npm install`.

Cách 1 — static server (khuyến nghị để kiểm tra giao diện):

```powershell
python -m http.server 8080
```

Chạy trong `template\novena`, sau đó mở `http://localhost:8080/`.

Hoặc:

```powershell
npx serve .
```

Cách 2 — PHP built-in server (chỉ cần khi thử `mail.php`):

```powershell
php -S localhost:8080
```

Lưu ý:

- Mở trực tiếp `index.html` bằng `file://` có thể làm hỏng một số hành vi (Google Maps, AJAX, đường dẫn tuyệt đối `/images/favicon.ico`).
- `mail.php` cần PHP và cấu hình `mail_to`; mặc định vẫn là email placeholder.
- Google Maps cần Internet và API key hợp lệ.

### 1.7. Mức độ hoàn thiện

| Hạng mục | Đánh giá |
|---|---|
| Giao diện | Cao: đủ trang, responsive, asset đầy đủ |
| Nội dung | Demo: text/ảnh mẫu, nhiều dữ liệu giả |
| Tương tác front-end | Trung bình: slider/counter/filter hoạt động; form chủ yếu không gửi |
| Backend | Rất thấp: chỉ 1 file PHP demo |
| Accessibility | Chưa đạt: nhiều `alt=""`, màu/contrast chưa kiểm chứng, thiếu skip link, heading không đồng nhất |
| SEO | Chưa đạt: title/description lặp lại và sai chủ đề, `lang="zxx"`, thiếu canonical/OG/sitemap/robots, favicon tham chiếu nhưng không tồn tại |
| Bảo mật | Cần sửa trước khi dùng thật: API key Google Maps hard-code, mail.php thiếu bảo vệ |
| Build/reproducibility | Thấp: không có manifest dependency, SCSS không có script build |

### 1.8. Khả năng tái sử dụng

**Phù hợp nhất:** website tĩnh/landing nhiều trang cho phòng khám, bệnh viện, dịch vụ sức khỏe; bản demo nhanh; dự án cần Bootstrap 4 + jQuery.

**Tái sử dụng theo loại dự án:**

| Dự án đích | Khả năng | Cách dùng |
|---|---|---|
| HTML/CSS/JS tĩnh | Cao | Copy `novena` (bỏ `.git`), thay nội dung/ảnh, sửa metadata |
| Bootstrap 4 | Cao | Giữ nguyên grid/component; tránh nâng Bootstrap tùy tiện |
| Tailwind CSS | Thấp | Không trộn Bootstrap + Tailwind trong cùng layout; cần viết lại style |
| React/Vue/Svelte/Next/Nuxt | Trung bình | Tách header/footer/section thành component; chuyển jQuery plugin sang lifecycle hoặc thư viện tương đương |
| ASP.NET Core / Razor | Trung bình–cao | Đặt asset vào `wwwroot`, tách `_Layout`/partial cho header/footer; thay `mail.php` bằng endpoint/controller và `IEmailSender` |
| Flutter/mobile | Không | Không tái sử dụng trực tiếp |
| CMS (WordPress...) | Trung bình | Cần chuyển thủ công sang theme; không có sẵn template CMS |

**Điểm cần kiểm tra trước khi tái sử dụng:**

1. Xác nhận giấy phép Themefisher cho mục đích dự án; không bán lại/redistribute template gốc.
2. Bỏ thư mục `.git` khi copy sang dự án mới.
3. Thay toàn bộ title/meta description; hiện tại mọi trang dùng chung title và description sai chủ đề ("Orbitor,business...").
4. Sửa `lang`, favicon (`/images/favicon.ico` không tồn tại), alt text, heading.
5. Thay/giới hạn Google Maps API key; không commit key thật.
6. Viết lại `mail.php`: gán đúng `$phone`, không ghi đè `$content`, thêm CSRF/captcha/rate limit, dùng SMTP thay `mail()` nếu production.
7. Nối hoặc vô hiệu hóa các form `action="#"`.
8. Kiểm tra tương thích Bootstrap 4.3.1/jQuery 3.3.1 (đã cũ) và lỗ hổng bảo mật của dependency.
9. Nếu dự án dùng Tailwind v4: không chuyển tự động; đây là template Bootstrap, cần quyết định thay framework rõ ràng.
10. Kiểm tra font Google và CDN (trang `documentation.html`) khi triển khai offline/nội bộ.

### 1.9. Dependency cần lưu ý

| Dependency | Vị trí | Rủi ro/Ghi chú |
|---|---|---|
| Bootstrap 4.3.1 | `plugins/bootstrap/` | Bản cũ, không còn hỗ trợ chính thức; không tự nâng cấp nếu chưa test |
| jQuery 3.3.1 | `plugins/jquery/` | Bản cũ; nhiều plugin phụ thuộc jQuery |
| Slick Carousel | `plugins/slick-carousel/` | Không rõ version; phụ thuộc jQuery |
| Shuffle.js | `plugins/shuffle/` | Không rõ version |
| CounterUp/Waypoints/Easing | `plugins/counterup/` | Không rõ version; phụ thuộc jQuery |
| IcoFont | `plugins/icofont/` | Font icon local; dung lượng CSS lớn |
| Google Maps JS API | `about.html`, `appoinment.html`, ... | API key hard-code trong template; cần thay/restrict |
| Google Fonts | `css/style.css` | Gọi mạng ngoài |
| Bootstrap 4.5.3 CDN + Helpscout | `documentation.html` | Không dùng cho trang nghiệp vụ; có beacon bên thứ ba |
| PHP `mail()` | `mail.php` | Cần PHP; không phù hợp production nếu chưa cấu hình SMTP |

### 1.10. Kết luận

`novena` là template y tế tĩnh cổ điển, giao diện đầy đủ và dễ thay nội dung, nhưng là **demo front-end**, không phải ứng dụng hoàn chỉnh. Tái sử dụng tốt nhất cho site tĩnh/Bootstrap 4. Trước khi dùng thật phải xử lý metadata/SEO, accessibility, API key, form backend và các dependency cũ.

---

## 2. Quyết định cho demo ver2

- **Không dùng `novena` làm nền kỹ thuật.** Template là Bootstrap 4.3.1 + jQuery 3.3.1 tĩnh,
  trong khi yêu cầu programme/faculty/CMS/SEO/DB cần framework component hoá và server rendering.
- Trộn Bootstrap 4 với Tailwind 4 sẽ tạo hai hệ style xung đột và tăng nợ kỹ thuật.
- Chỉ tham khảo ý tưởng bố cục y tế (hero, card, section title); toàn bộ UI v2 viết mới bằng
  Tailwind theo design token VSOT.
- Không copy asset/ảnh/font IcoFont của template; không redistributing template gốc.
- Giữ nguyên thư mục `template/` read-only và loại khỏi git (`template/` trong `.gitignore`).
