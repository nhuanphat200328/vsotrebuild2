# OPENCODE GLOBAL SKILLS GUIDE

Hướng dẫn dùng chung cho mọi dự án OpenCode trên máy này.
Cài đặt ngày: 2026-11-23.

## 1. Môi trường đã kiểm tra

| Thành phần | Giá trị |
|---|---|
| Windows | Windows 11, build 26100 |
| PowerShell | 5.1 |
| OpenCode | 1.18.32 (`C:\Users\nhuan\.opencode\bin\opencode.exe`) |
| Node.js | v24.17.0 (đạt yêu cầu tối thiểu 20.12) |
| npm | 11.13.0 |
| Global config | `C:\Users\nhuan\.config\opencode\opencode.jsonc` (giữ nguyên, không sửa) |
| Global skills | `C:\Users\nhuan\.config\opencode\skills\` |
| Project skills | Không cài trong `demo ver2\.opencode\skills` |

Không cần khai báo `skills.paths` trong `opencode.jsonc`: OpenCode tự quét thư mục global mặc định.

## 2. Danh sách 8 skills đã cài

| STT | Skill | Slug / thư mục | Nhóm | Version | License | Nguồn |
|---|---|---|---|---|---|---|
| 1 | Frontend Design | `frontend-design` | design | 1.0.0 | MIT | https://opencodeskills.dev/skills/design/frontend-design/ |
| 2 | Code Review | `code-review` | code-quality | 1.0.0 | MIT | https://opencodeskills.dev/skills/code-quality/code-review/ |
| 3 | SEO Optimization | `seo-optimization` | writing | 1.0.0 | MIT | https://opencodeskills.dev/skills/writing/seo-optimization/ |
| 4 | .NET Core | `dotnet-core` | framework | 1.0.0 | MIT | https://opencodeskills.dev/skills/framework/dotnet-core/ |
| 5 | Architecture Diagrams | `architecture-diagrams` | architecture | 1.0.0 | MIT | https://opencodeskills.dev/skills/architecture/architecture-diagrams/ |
| 6 | Mermaid Diagrams | `mermaid-diagrams` | documentation | 1.0.0 | MIT | https://opencodeskills.dev/skills/documentation/mermaid-diagrams/ |
| 7 | Flutter Patterns | `flutter-patterns` | framework | 1.0.0 | MIT | https://opencodeskills.dev/skills/framework/flutter-patterns/ |
| 8 | Tailwind CSS | `tailwind-css` | design | 1.0.0 | MIT | https://opencodeskills.dev/skills/design/tailwind-css/ |

Tất cả là bản miễn phí. Không cài gói Pro, không phát sinh chi phí.

Cấu trúc đã xác minh:

```text
C:\Users\nhuan\.config\opencode\skills\
├── architecture-diagrams\SKILL.md
├── code-review\SKILL.md
├── code-review\references\review-checklist.md
├── dotnet-core\SKILL.md
├── flutter-patterns\SKILL.md
├── frontend-design\SKILL.md
├── mermaid-diagrams\SKILL.md
├── seo-optimization\SKILL.md
└── tailwind-css\SKILL.md
```

Không có lỗi lồng `skill-name\skill-name\SKILL.md`. `name` trong frontmatter khớp tên thư mục. Nội dung từng file khớp SHA-256 với file trong zip chính thức.

## 3. Vai trò từng skill

| Skill | Dùng khi | Không dùng khi |
|---|---|---|
| `frontend-design` | Xây/sửa UI, layout, design system, responsive, accessibility, animation | Chỉ sửa backend, CLI, tài liệu |
| `code-review` | Review PR/diff/commit, đánh giá thay đổi do AI tạo, self-review | Chỉ viết code mới chưa có diff cần review |
| `seo-optimization` | Website công khai cần search index: metadata, heading, sitemap, robots, structured data, CWV | Trang admin, dashboard nội bộ, API, trang không cần index |
| `dotnet-core` | Dự án thực tế dùng C#/ASP.NET Core | Dự án không dùng .NET; không chuyển framework chỉ vì có skill |
| `architecture-diagrams` | Cần sơ đồ kiến trúc tương tác dạng HTML self-contained | Cần sơ đồ nhúng trong Markdown/GitHub |
| `mermaid-diagrams` | Flowchart, sequence, ER, state, gantt trong README/ADR/docs | Cần sơ đồ HTML động/click-through |
| `flutter-patterns` | Dự án thực tế dùng Flutter/Dart | Dự án web/backend không dùng Flutter |
| `tailwind-css` | Dự án thực tế dùng Tailwind CSS | Dự án dùng Bootstrap/CSS thuần; không thêm Tailwind nếu không được yêu cầu |

Skill là **hướng dẫn cho agent**, không phải thư viện hay dependency. Không thêm package vào dự án chỉ vì skill nhắc tới package đó.

## 4. Cách OpenCode nhận diện và dùng skill

- OpenCode quét `**/SKILL.md` trong thư mục skill.
- Global: `%USERPROFILE%\.config\opencode\skills\<name>\SKILL.md`.
- Project: `<repo>\.opencode\skills\<name>\SKILL.md` (hoặc `.opencode\skill\`).
- `name` phải lowercase, hyphen-separated, tối đa 64 ký tự, khớp tên thư mục.
- `description` phải nói rõ **làm gì** và **khi nào dùng**, nếu thiếu skill bị bỏ qua.
- Skill được nạp khi session bắt đầu. Sau khi cài/sửa/xóa phải mở session mới.
- Agent tự chọn skill theo `description` và ngữ cảnh; có thể gọi rõ bằng tên skill.

## 5. Cách kiểm tra skill

### 5.1. Kiểm tra bằng CLI

```powershell
opencode debug skill
```

Xem gọn tên và đường dẫn:

```powershell
opencode debug skill | ConvertFrom-Json | Select-Object name, location | Format-Table -AutoSize
```

Kỳ vọng: thấy đủ 8 tên với `location` nằm dưới `C:\Users\nhuan\.config\opencode\skills\...`.

### 5.2. Kiểm tra trong session mới

Mở session mới tại workspace bất kỳ, hỏi:

> Liệt kê các skill đang có. Không sửa file.

Hoặc kiểm tra nội dung thật:

> Dùng skill `mermaid-diagrams`, tạo một flowchart nhỏ minh họa request đi qua API và database. Không ghi file.

Nếu agent gọi được skill và trả lời đúng nội dung `SKILL.md`, skill đã nạp.

### 5.3. Kiểm tra không cần mở TUI

```powershell
opencode run --agent build "Dùng skill frontend-design và nêu 3 bước kiểm tra responsive. Không sửa file."
```

## 6. Cách cập nhật skill

Cập nhật 1 skill (ghi đè đúng thư mục, không ảnh hưởng skill khác):

```powershell
irm https://opencodeskills.dev/cli.mjs -OutFile "$env:TEMP\opencode-skills.mjs"
node "$env:TEMP\opencode-skills.mjs" install tailwind-css --yes
```

Cập nhật cả 8:

```powershell
irm https://opencodeskills.dev/cli.mjs -OutFile "$env:TEMP\opencode-skills.mjs"
node "$env:TEMP\opencode-skills.mjs" install frontend-design code-review seo-optimization dotnet-core architecture-diagrams mermaid-diagrams flutter-patterns tailwind-css --yes
```

Sau cập nhật: mở session mới. Không cần sửa `opencode.jsonc`.

Cách thủ công tương đương (ví dụ Tailwind):

```powershell
Invoke-WebRequest -Uri https://opencodeskills.dev/downloads/design/tailwind-css.zip -OutFile "$env:TEMP\tailwind-css.zip"
Expand-Archive -Path "$env:TEMP\tailwind-css.zip" -DestinationPath "$env:USERPROFILE\.config\opencode\skills\" -Force
```

Kiểm tra không bị lồng thư mục sau khi giải nén.

## 7. Cách gỡ riêng một skill

Chỉ xóa đúng thư mục của skill đó:

```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.config\opencode\skills\tailwind-css"
```

Không xóa thư mục cha:

```powershell
# KHÔNG chạy: sẽ mất toàn bộ skill global
# Remove-Item -Recurse -Force "$env:USERPROFILE\.config\opencode\skills"
```

Sau khi xóa, mở session mới để OpenCode bỏ skill khỏi danh sách.

## 8. Global skill và project skill

| Tiêu chí | Global | Project |
|---|---|---|
| Đường dẫn | `%USERPROFILE%\.config\opencode\skills\<name>\SKILL.md` | `<repo>\.opencode\skills\<name>\SKILL.md` |
| Phạm vi | Mọi dự án trên máy | Chỉ repo đó |
| Dùng cho | Thói quen, quy trình cá nhân, skill công nghệ dùng lại | Quy ước riêng của repo, lệnh build/test riêng |
| Cài 8 skill này | Có (đã cài) | Không |
| Khi trùng tên | Tránh đặt trùng; project dành cho skill đặc thù của repo | — |

Không copy 8 skill global vào workspace. Nếu cần dùng ở máy khác, cài lại global theo mục 6.

## 9. Nguyên tắc chọn skill theo công nghệ thực tế

| Dự án thực tế | Skill nên dùng | Skill không dùng |
|---|---|---|
| Website HTML/CSS/JS, Bootstrap, React, Vue, Next, Nuxt | `frontend-design`; thêm `seo-optimization` nếu public; `tailwind-css` chỉ khi đúng Tailwind | `dotnet-core`, `flutter-patterns` |
| ASP.NET Core / C# | `frontend-design` (nếu có UI), `dotnet-core`, `code-review`, `mermaid-diagrams` | `flutter-patterns`; `tailwind-css` nếu không dùng Tailwind |
| Flutter/Dart | `flutter-patterns`, `code-review` | `dotnet-core`, `frontend-design` cho web |
| Dự án Tailwind | `tailwind-css` + `frontend-design`; kiểm tra version trước | Không áp cú pháp v4 cho dự án v3 |
| Tài liệu kiến trúc | `architecture-diagrams` hoặc `mermaid-diagrams` | `seo-optimization` cho tài liệu nội bộ |
| Mọi thay đổi code | `code-review` sau khi hoàn thành | Không dùng `seo-optimization` cho admin/API |

## 10. Nguyên tắc sử dụng từng skill

### Frontend Design

- Mobile-first; bắt đầu từ 375px rồi mở rộng.
- Dùng design tokens cho spacing, màu, typography.
- Kiểm tra 375px, 768px, 1280px; không tràn ngang.
- Semantic HTML trước ARIA; label cho form; heading đúng thứ tự.
- Kiểm tra hover, focus, active, disabled; focus phải nhìn thấy.
- WCAG AA: body text tương phản tối thiểu 4.5:1.
- Reserve space cho ảnh/embed để tránh layout shift.
- Không tạo giao diện chỉ đẹp ở một kích thước màn hình.

### Code Review

- Xác định mục tiêu thay đổi trước khi đọc code.
- Đọc test trước; kiểm tra logic, regression, security, data/migration, concurrency, performance, maintainability.
- Gắn mức độ: `blocker`, `suggestion`, `nit`, `question`, `praise`.
- Mỗi finding nêu file:line, điều kiện tái hiện, hậu quả, cách sửa.
- Không coi style/format là lỗi kỹ thuật; để formatter/linter xử lý.
- Kiểm tra lại finding có ảnh hưởng thật; tránh báo động giả.
- Với code do AI tạo: kiểm tra API/version thật, default sai, test tautology.

### SEO Optimization

Chỉ áp dụng cho trang công khai cần index. Checklist:

- Title ≤ 60 ký tự; meta description ≤ 160 ký tự, viết cho người đọc.
- Một H1/trang; H2–H6 theo thứ tự.
- Alt text mô tả ảnh; ảnh có `width`/`height` khi cần.
- URL mô tả nội dung; canonical đúng.
- `sitemap.xml`, `robots.txt`, structured data JSON-LD khi phù hợp.
- Core Web Vitals: LCP, INP, CLS.
- Internal link, không keyword stuffing, cập nhật nội dung cũ.
- Không áp SEO máy móc cho admin/dashboard/API/trang nội bộ.

### .NET Core

Chỉ dùng khi dự án thực tế là C#/ASP.NET Core:

- Dependency Injection cho service; controller mỏng, logic ở service.
- Middleware pipeline: auth, logging, error handling.
- EF Core + migration; không thay bằng SQL thủ công tùy tiện.
- Minimal API hoặc controller theo kiến trúc hiện có.
- Authentication/Authorization; CORS cho API client.
- Health checks cho external dependency; `IHttpClientFactory` cho outbound HTTP.
- Logging có cấu trúc; unit/integration test.
- Không chuyển dự án sang .NET chỉ vì đã cài skill.

### Architecture Diagrams

- Xác định frontend, backend, API, database, external service, data flow.
- Tạo HTML self-contained, SVG/CSS nhúng, không dependency ngoài.
- Có nhãn cho từng luồng dữ liệu; màu semantic; fallback tĩnh.
- Đọc được ở 1280px.
- Không đưa credential, token, secret, hostname nội bộ nhạy cảm vào sơ đồ.

### Mermaid Diagrams

- Chọn đúng loại: `flowchart`, `sequenceDiagram`, `erDiagram`, `stateDiagram-v2`, `gantt`.
- Dùng `LR` cho pipeline, `TD` cho hierarchy; khoảng ≤ 15 node/diagram.
- Quote label có ký tự đặc biệt; dùng `subgraph` cho boundary.
- Kiểm tra cú pháp để render được trên GitHub và Markdown viewer.
- Cập nhật diagram cùng PR với thay đổi kiến trúc.

### Flutter Patterns

Chỉ dùng khi dự án thực tế là Flutter/Dart:

- Widget nhỏ, một trách nhiệm; composition thay vì inheritance.
- `const` constructor khi có thể.
- `setState` cho local state; Riverpod/Bloc cho app-wide state.
- Navigation rõ ràng; animation có kiểm soát.
- Platform channel khi cần native; test unit + widget.
- Không thêm Flutter vào dự án web nếu không có yêu cầu.

### Tailwind CSS

- Kiểm tra version trước khi viết class:
  - `package.json` / lockfile, hoặc `npm ls tailwindcss`.
  - v4: CSS-first, `@import "tailwindcss"`, `@theme`, `@utility`.
  - v3: `tailwind.config.js`, `@tailwind base/components/utilities`.
- Không tự nâng v3 → v4; kiểm tra dependency, plugin, build tool trước.
- Dùng design tokens; semantic color cho dark mode.
- Mobile-first; responsive/container/state variants đúng.
- Tách component khi class lặp; dùng `prettier-plugin-tailwindcss`, `tailwind-merge` nếu dự án đã có.
- Không ghép class động kiểu `bg-${color}-500`.
- Không trộn Bootstrap và Tailwind trong cùng layout.

## 11. Quy tắc an toàn

- Không sửa/xóa template trong `template/`.
- Không cài 8 skill vào project scope.
- Không ghi đè `opencode.jsonc` hoặc cấu hình global hiện có.
- Không gỡ skill khác đã cài trước đó.
- Không cài skill ngoài danh sách 8.
- Không cài gói Pro hoặc phát sinh chi phí.
- Không tự đổi framework/dependency dự án.
- Không tự nâng Tailwind.
- Không đưa token/API key/credential vào log, tài liệu hoặc sơ đồ.
- Không báo skill hoạt động nếu chưa kiểm tra bằng `opencode debug skill` hoặc session mới.

## 12. Tài liệu liên quan

- `TEMPLATE_CATALOG.md`: khảo sát template `novena` trong workspace này.
- Hướng dẫn cài chính thức: https://opencodeskills.dev/guides/install-opencode-skills/
- Danh sách skill: https://opencodeskills.dev/best-opencode-skills/
