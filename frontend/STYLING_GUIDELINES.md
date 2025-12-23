# Frontend Styling Guidelines & Conventions

Tài liệu này quy định các chuẩn mực về styling, cấu trúc CSS/SCSS, và cách kết hợp Tailwind CSS với Ant Design trong dự án. Mục tiêu là đảm bảo tính nhất quán giữa Light/Dark mode và dễ dàng bảo trì.

## 1. Kiến trúc Styling (Overview)

Hệ thống styling hoạt động theo luồng dữ liệu sau để đảm bảo tính đồng bộ:

1.  **CSS Variables (`_styles.scss`):** Định nghĩa Design Tokens (màu sắc, spacing, border) cho cả Light và Dark mode.
2.  **Tailwind Configuration (`tailwind.preset.ts`):** Map các CSS Variables vào hệ thống utility classes của Tailwind.
3.  **Semantic Classes (`_shared.scss`):** Sử dụng `@apply` của Tailwind để tạo ra các class tái sử dụng (Button, Card, Input).
4.  **Ant Design Theme (`App.tsx`):** Đồng bộ tokens của Ant Design với CSS Variables của dự án thông qua `ConfigProvider`.

---

## 2. Màu sắc & Dark Mode (Color System)

Dự án sử dụng cơ chế **CSS Variables** để tự động chuyển đổi giao diện.
**Quy tắc:** Không hardcode mã màu Hex (ví dụ: `#F2385A`) trực tiếp trong component. Hãy sử dụng **Tailwind Class** hoặc **CSS Variable**.

### Bảng màu Semantic (Palette)
Các màu này được định nghĩa trong `tailwind.preset.ts` và map về `_styles.scss`.

| Role | Class Tailwind | CSS Variable | Mô tả |
| :--- | :--- | :--- | :--- |
| **Primary** | `text-primary`, `bg-primary` | `--accent-primary` | Màu thương hiệu chính. |
| **Secondary** | `text-secondary`, `bg-secondary` | `--accent-secondary` | Màu phụ trợ. |
| **Success** | `text-success`, `bg-success` | `--color-success` | Trạng thái thành công. |
| **Warning** | `text-warning`, `bg-warning` | `--color-warning` | Cảnh báo. |
| **Danger** | `text-danger`, `bg-danger` | `--color-danger` | Lỗi hoặc hành động xóa. |
| **Info** | `text-info`, `bg-info` | `--color-info` | Thông tin. |

### Màu nền & Text (Context Aware)
Các class này tự động thay đổi theo theme (Light/Dark):

* **Backgrounds:**
    * `bg-body` / `--bg-body`: Nền chính của toàn trang.
    * `bg-container` / `--bg-container`: Nền của Card, Modal, Input.
    * `bg-hover` / `--bg-hover`: Nền khi hover vào item.
    * `bg-secondary` / `--bg-container-secondary`: Nền phụ (ví dụ: dropdown active item).

* **Text:**
    * `text-primary` / `--text-primary`: Màu chữ chính (Đậm nhất).
    * `text-secondary` / `--text-secondary`: Màu chữ phụ (Nhạt hơn).
    * `text-tertiary`: Dùng cho text bị disable hoặc placeholder.

---

## 3. Typography

Sử dụng các class ngữ nghĩa trong `_shared.scss` để đảm bảo thống nhất font-size và weight.
**Font Family:** `Open Sans`.

| Class Name | Tailwind Mapping (Approx) | Usage |
| :--- | :--- | :--- |
| `.text-heading-1` | `text-3xl font-bold` | Tiêu đề trang chính |
| `.text-heading-2` | `text-2xl font-semibold` | Tiêu đề section lớn |
| `.text-heading-3` | `text-xl font-semibold` | Tiêu đề card, modal |
| `.text-heading-4` | `text-lg font-medium` | Tiêu đề nhỏ |
| `.text-body` | `text-sm` | Nội dung văn bản thường |
| `.text-caption` | `text-xs text-secondary` | Chú thích, text phụ |
| `.text-label` | `text-sm font-medium` | Label của input, form |

---

## 4. Reusable Components (SCSS Classes)

Các component cơ bản được định nghĩa trong `_shared.scss`.

### Buttons
Sử dụng class `.btn-*` thay vì viết utility dài dòng.

* `.btn-base`: Cấu trúc cơ bản (padding, rounded, transition).
* `.btn-primary`: Nền màu Primary, chữ trắng.
* `.btn-secondary`: Nền màu Secondary, chữ trắng.
* `.btn-outline`: Nền trong suốt, viền Primary.
* `.btn-danger` / `.btn-success`: Nút trạng thái.

```html
<button className="btn-primary">Save Changes</button>
```

### Cards
 
 * `.card-base`: Cấu trúc cơ bản (padding, rounded, transition).
 * `.card-hover`: Kế thừa card-base, thêm hiệu ứng shadow và đổi màu border khi hover.
 * `.card-elevated`: Shadow đậm hơn, dùng cho các phần tử nổi (dropdown, modal).

 ### Inputs

 * `.input-base`: Style chuẩn cho input text, placeholder màu secondary.
 * `.input-error`: Viền đỏ, focus ring màu đỏ (dùng khi validation fail).

 ### Badges

 Dùng để hiển thị trạng thái (Status). Cấu trúc: Nền nhạt + Chữ đậm + Border nhạt.

* `.badge-primary`: Primary style.
* `.badge-success`: Thành công (Xanh lá).
* `.badge-warning`: Cảnh báo (Vàng).
* `.badge-danger`: Lỗi (Đỏ).
* `.badge-info`: Thông tin (Xanh dương).

 ### Links

* `.link-base`: Màu Primary, hover có underline.
* `.link-subtle`: Màu Secondary, hover chuyển sang màu Primary.

## 5. Layout & Utilities

### Container

Được định nghĩa trong `_shared.scss` để kiểm soát max-width.

* `.container-base`: Max-width `80rem` (1280px), padding responsive.
* `.container-narrow`: Max-width `56rem` (896px).

### Flex Helpers

* `.flex-center`: flex items-center justify-center.
* `.flex-between`: flex items-center justify-between.
* `.flex-col-center`: Flex column + center.

### Shadows

Định nghĩa trong `tailwind.preset.ts`:

* `Standard`: `shadow-ssm`, `shadow-lg`.
* `Dark Mode`: `shadow-dark-sm`, `shadow-dark-md`, `shadow-glow` (tự động map theo biến).

### Dividers

* `.divider-horizontal`: Đường kẻ ngang, margin dọc 4px.
* `.divider-vertical`: Đường kẻ dọc, margin ngang 4px.

## 6. Ant Design Integration

### ConfigProvider
Theme của Ant Design được config trong `App.tsx` để đồng bộ với CSS Variables:
* `colorBgBase` ➜ `var(--bg-body)`
* `colorTextBase` ➜ `var(--text-primary)`
* `colorBgContainer` ➜ `var(--bg-container)`
* `colorBorder` ➜ `var(--border-color)`
* Algorithm: Tự động chuyển `darkAlgorithm` hoặc `defaultAlgorithm`.

### Custom Overrides (`_shared.scss`)
Một số component Antd được override style thủ công để khớp với Design System:

1.  **Pagination (`.ant-pagination`):**
    * Custom màu active item (theo primary color).
    * Custom màu text và link (theo text-primary/secondary).
    * Style lại input jump và select options.
2.  **Select (`.ant-select`):**
    * Mũi tên (arrow) đổi màu khi hover/focus.
    * Dropdown background theo `bg-container`.
    * Active option background theo `bg-container-secondary`.
3.  **Steps (`.ant-steps`):**
    * Custom icon step (Process: Primary bg, Finish: Transparent bg + Primary text).
    * Line color đồng bộ với theme.
4.  **Popover (`.ant-popover`):**
    * Ẩn mũi tên mặc định.
    * Tinh chỉnh shadow riêng cho Dark mode để nổi bật hơn trên nền tối.

## 7. Quy trình thêm Style mới

1.  **Thêm biến:** Nếu cần màu mới, khai báo vào `:root` và `[data-theme='dark']` trong `_styles.scss`.
2.  **Config Tailwind:** Map biến đó vào `tailwind.preset.ts` nếu muốn dùng dạng utility class (ví dụ: `bg-new-color`).
3.  **Tạo Component:** Nếu là cụm style phức tạp dùng nhiều lần, dùng `@apply` trong `_shared.scss`.

```scss
// Ví dụ thêm vào _shared.scss
.new-component {
  @apply p-4 rounded bg-container border border-border;
}