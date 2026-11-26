# HNUE Pixel Campus — game 2D pixel theo bản đồ thật

Game đi dạo khuôn viên Trường ĐH Sư phạm Hà Nội dựng từ dữ liệu bản đồ thật (1.783 công trình, đường, hồ, sân, cây, ranh giới trường).
Vị trí GPS của bạn là vị trí nhân vật; trên PC dùng WASD / mũi tên (Shift chạy, E xem toà nhà, nhấp chuột để đi tới đó).

## Chạy game
- **Khuyên dùng:** chạy `run.bat` (Windows) hoặc `sh run.sh` (Mac/Linux) → mở http://localhost:8000. Cần có Python 3.
  Sửa PNG xong chỉ cần **F5** (Ctrl+F5 nếu trình duyệt còn cache). localhost cũng cho phép xin quyền GPS.
- Mở thẳng `index.html` (file://) cũng chạy được, nhưng sửa PNG xong phải chạy `python tools/pack_sprites.py` rồi mới F5, và GPS thường bị chặn.
- Đưa lên web: tải cả thư mục lên GitHub Pages / hosting https là có GPS thật trên điện thoại.

## Cấu trúc thư mục
```
index.html                 trang chính, nạp các file bên dưới
css/style.css              giao diện (HUD, thẻ thông tin, nút)
data/map-data.js           dữ liệu bản đồ: toà nhà, đường, khu đất, cây, điểm tiện ích, ranh giới trường (mét)
data/sprite-manifest.js    bảng tra sprite (sinh từ sprites/manifest.json)
data/sprites-packed.js     PNG đóng gói dạng base64 cho chế độ file:// (sinh bởi tools/pack_sprites.py)
js/00-core … 10-loop.js    mã game, chia theo phần: bản đồ, mặt đất, sprite, nhân vật, ngày/đêm, vẽ, giao diện, GPS, minimap, vòng lặp
sprites/buildings/<loại>/  MỖI CÔNG TRÌNH MỘT PNG:  <ID>_<tên>.png   ← vẽ pixel ở đây
sprites/_guides/           ảnh khung hướng dẫn (cùng tên file) cho công trình loại 1–9
sprites/trees/             6 kiểu cây (3 cỡ × thường / phượng đỏ)
sprites/manifest.json      ID → file, vị trí (ox, oy), kích thước
sprites/DANH-SACH.md       tra ID theo tên công trình
tools/serve.py             server localhost
tools/pack_sprites.py      đóng gói PNG cho file://
rust/pixel-core/           lõi Rust cho xử lý màu mặt đất
wasm/pixel_core.wasm       mô-đun WebAssembly được game nạp trên web
build-wasm.bat             biên dịch lõi Rust sang WebAssembly
```
Thư mục loại: 00-nha-dan, 01-giang-duong, 02-thu-vien, 03-can-tin, 04-khan-dai, 05-chua-dinh, 06-ky-tuc-xa, 07-ga-metro, 08-thuong-mai, 09-cong-trinh-khac.

## Cách vẽ pixel từng công trình
> **Đã nâng độ phân giải x2.5 (toàn bộ cảnh):** PNG công trình trong `sprites/buildings/` và cây trong `sprites/trees/` được phóng **2.5 lần mỗi chiều** (viền khử răng cưa, màu cửa sổ giữ nguyên); mặt đất cũng được dựng ở lưới ×2.5 với viền mượt (đường, vỉa hè, vạch kẻ), bóng đổ tô vector nét ở độ phân giải màn hình. Vị trí trong game không đổi — game tự thu nhỏ về đúng chỗ, nên 1 pixel cũ giờ là khối 2.5×2.5. Toàn bộ chi tiết vẽ (cửa sổ, cửa, màu) được giữ nguyên 100%.
1. Tìm công trình trong `sprites/DANH-SACH.md` (ví dụ ID `0012`) rồi mở PNG tương ứng. Xem nhanh trong game: `http://localhost:8000/?b=12` (thêm `&night=1` để xem ban đêm).
2. Mở PNG bằng trình vẽ pixel (Aseprite, LibreSprite, Piskel, Photoshop…). **Tắt khử răng cưa/làm mịn, không đổi kích thước canvas.**
3. Vẽ đè lên. Ảnh gồm mái (nửa trên), tường nam (phía dưới), nền trong suốt. Viền đen 1 px quanh hình giúp sprite nổi trên nền.
4. Mở `sprites/_guides/<cùng tên>.png` để canh: **đường hồng = chân toà nhà trên mặt đất** (khớp với vùng va chạm và bóng đổ), **đường xanh lơ = mép mái**. Dán guide thành layer phụ rồi xoá trước khi lưu.
5. Lưu PNG (RGBA), F5 để xem. Điểm nào trong suốt thì coi như trống.

**Quy ước màu**
- Pixel có màu `#8fbfe8` và `#6fa4d8` được coi là **cửa sổ**: ban đêm game sẽ thắp sáng các pixel này. Muốn có đèn đêm thì giữ đúng hai màu đó cho kính cửa sổ.
- Khi toà nhà che nhân vật, game dựa vào pixel không trong suốt của sprite để làm mờ toà nhà: vẽ phần mái/tường phủ tới đâu thì mờ tới đó.
- Muốn dịch cả sprite: sửa `ox`, `oy` của ID đó trong `sprites/manifest.json` rồi chạy `python tools/pack_sprites.py`.
- Có thể đổi kích thước PNG (mở rộng mái, thêm cột cờ…): góc trên-trái vẫn ở (`ox`,`oy`). Nhớ điều chỉnh `oy` nếu cao thêm.
- Vẽ lại cây: `sprites/trees/tree_r{6,8,10}_v{0,1}.png` (v1 = phượng đỏ). Sprite nhân vật hiện còn sinh bằng mã trong `js/03-sprites.js` (hàm `chSp`).

## Đưa chỉnh sửa vào bản chơi
- Chạy bằng localhost: không cần làm gì thêm, F5.
- Chạy bằng file:// hoặc đưa lên hosting: chạy `python tools/pack_sprites.py` để cập nhật `data/sprites-packed.js` trước khi tải lên.

## Ghi chú dữ liệu
Dữ liệu từ dự án tinytown (hnue-2d-lite-rust.zip) và OpenStreetMap contributors (ODbL). Toạ độ trong `map-data.js` là mét so với tâm bản đồ (x = đông, y = nam); đổi sang kinh/vĩ độ bằng `c` (tâm) và `ml` (mét trên mỗi độ).

## Bản v3 — gameplay + ánh sáng shader
- `js/11-game.js`: nhiệm vụ **Thu thập 24 cuốn Sách tri thức** (mỗi cuốn ở một công trình có tên), combo điểm, 6 cấp bậc, mũi tên chỉ hướng, âm thanh 8-bit + nhạc nền (nút ), lưu tiến độ bằng localStorage.
- Lớp ánh sáng: nắng xiên mềm (soft-light), vignette, đèn lồng quanh nhân vật và bloom cửa sổ ban đêm — vẫn 100% pixel art.
- Mở thẳng `index.html` là chạy (đã đóng gói sprite). Đổi giờ bằng nút để xem ánh sáng ngày/hoàng hôn/đêm.

## Bản v4 — pixel thật
- `js/12-pixel.js`: sprite công trình & cây được đưa về **đúng lưới pixel gốc** (lấy mẫu tâm khối 2.5×2.5), vẽ bằng số nguyên Z, tắt làm mịn → cạnh sắc nét, không nhoè; cửa sổ/cửa/viền giữ nguyên.
- Mặt đất không còn phóng + blur: vẽ trực tiếp ở lưới 3 pixel = 1 mét. Bóng đổ cũng được lượng tử hoá theo lưới pixel.

## Bản v5 — zoom, người nhỏ, ánh sáng 3D
- Zoom: cuộn chuột, chụm 2 ngón, nút ＋ － hoặc phím + / - (bước nguyên để pixel luôn sắc).
- Nhân vật/NPC thu nhỏ 9×16 px.
- Ánh sáng (`js/13-view.js`): bóng đổ động theo giờ (sáng dài sang tây, trưa ngắn, chiều dài sang đông), viền sáng/tối + AO chân tường nướng vào sprite, tông màu hoàng hôn, tia nắng, đèn lồng + bloom cửa sổ ban đêm.

## Bản v6 — sửa lỗi
- Sửa lỗi `chSm is not defined` (file 13-view.js nạp trước vòng lặp; `14-init.js` đặt lại zoom sau khi khởi động). Đã chạy thử bằng Chromium: không còn lỗi, đi bộ/zoom/đổi giờ đều hoạt động.

## Bản v7
- Sửa lỗi shader (trùng tên `FS` với hằng số chunk) — ánh sáng WebGL hoạt động; có nút bật/tắt.
- Giao diện mới: panel kính mờ tối giản, biểu tượng SVG thay emoji, thanh tiến độ nhiệm vụ, tìm kiếm địa điểm, nút chụp ảnh, đồng hồ trong ngày.

## Bản v8 — học từ BSL Shaders v10.1.8 và Faithful 64x
Chỉ tham khảo thông số/ý tưởng, không sao chép mã nguồn hay texture nguyên bản.
- **BSL → `js/15-shader.js`:** bảng màu ánh sáng + ambient theo giờ (sáng/chiều cam, ban ngày xanh lạnh, ban đêm xanh dương) tính bình phương như BSL; chiếu sáng trong không gian tuyến tính (gamma 2.2); tonemap `x / (x²+1)^½`; giảm bão hoà ban đêm; đèn lồng rơi theo bình phương (kiểu lightmap); tia nắng có hàm pha tán xạ tập trung quanh mặt trời; nước gợn sóng + nhuốm xanh.
- **Faithful → `data/tex-detail.js`:** 9 bản đồ chi tiết 32×32 (cỏ, cát, nước, rêu, đá mịn, gạch đá, sỏi, gạch đỏ, đá cuội) rút từ độ sáng/tối của texture 64x, điều biến nền pixel trong `02-ground.js` (xoay/lật theo ô để không lặp). Màu gốc của bản đồ giữ nguyên.
- Credit: BSL Shaders © capttatsu; Faithful © Faithful Team — dùng theo giấy phép của từng gói.

## Bản v9
- **edit.html** viết lại theo bố cục Aseprite (thanh menu, bảng màu trái, thanh công cụ phải, nền canvas tím xám, panel Layers + danh sách sprite phía dưới, thanh trạng thái): Pencil/Eraser/Fill/Eyedropper/Line/Rect/Pan, hoàn tác 60 bước, zoom bằng cuộn chuột, lưới, giữ viền ngoài. "Lưu vào game" ghi sprite đã chỉnh (pixel gốc 1×) vào localStorage; game tự dùng khi tải lại (`hnueEdits`). Xuất PNG để lưu ngoài.
- **UI game:** kính tối trong suốt + pixel hiện đại (góc vát bậc thang, viền bevel 2px, vân quét mờ, nhãn monospace).
- **Chiều sâu 3D (HD-2D):** làm mờ nghiêng-dịch chuyển (tilt-shift) theo vị trí nhân vật + khói mờ chân trời; nút tầng lớp để bật/tắt.

## Bản v10 — cấu trúc mới: bản đồ 2.5D là trang chính
- `index.html` (+ `app/map.js`, `app/map.css`): **bản đồ 2.5D** toàn khuôn viên — công trình đùn khối theo chiều cao thật, bóng đổ, cây, đường, hồ, nhãn tự tránh chồng. Kéo để di chuyển, cuộn/chụm để zoom, chuột phải hoặc Shift+kéo để xoay/nghiêng (hai ngón: xoay), nút 2D/2.5D, la bàn, chế độ tối.
- **Tìm kiếm** tòa nhà, quán ăn, khoa, cổng, đường ngõ (không dấu cũng được, phím `/`), chip lọc nhanh (Ăn uống, Cà phê, ATM, Bus·Metro, Thư viện, Khoa, Cổng, Giảng đường, Ký túc xá).
- **Định vị GPS** (chấm xanh, vòng sai số, hướng). Không có GPS: nhấn giữ / chuột phải trên bản đồ → "Đặt vị trí của tôi ở đây".
- **Chỉ đường**: đồ thị đường đi dựng từ dữ liệu đường (tự nối giao lộ & cụm rời), thuật toán Dijkstra; điểm xuất phát mặc định là vị trí của tôi; đi bộ / xe đạp; thời gian, quãng đường, danh sách rẽ từng bước.
- **Dẫn đường trực tiếp**: bám theo vị trí, báo "Sau X m: Rẽ…", tự tính lại khi đi lệch >35 m, đọc giọng nói tiếng Việt (bật trong Lớp bản đồ), xoay theo hướng đi; nút **Mô phỏng** để thử trên máy tính.
- **Game pixel** nằm ở nút góc dưới phải: mở trong cửa sổ phủ (`game.html`), nút "Về bản đồ" để quay lại. Trình chỉnh sprite `edit.html` vẫn truy cập từ game.
- Chia sẻ địa điểm bằng liên kết `#b=Tên`.

## Bản v11 — phối cảnh và ánh sáng điện ảnh
- `game.html`: phối cảnh thu nhẹ về phía xa, đặt nhân vật thấp hơn trong khung và giữ nhãn theo đúng vị trí chiếu.
- `js/15-shader.js`: tăng chiều sâu bằng vignette và cân lại độ sáng; phối cảnh vẫn giữ khi tắt shader ánh sáng trên thiết bị hỗ trợ WebGL.

## Bản v12 — xây dựng bản đồ và nâng cấp sprite editor
- **Xây dựng bản đồ:** nút chỉnh sửa trên bản đồ mở bảng chọn loại công trình, kích thước và chiều cao. Đặt/xóa công trình tự tạo, hoàn tác/làm lại, tự lưu trong trình duyệt, nhập/xuất JSON; dữ liệu nền không bị sửa.
- **Sprite editor:** danh sách sprite có thumbnail, tìm kiếm và tải tiếp theo từng đợt; thêm lật ngang/dọc, xoay 90° và xóa ảnh. Lịch sử hoàn tác giữ đúng kích thước ảnh; thông tin sprite đang chọn hiển thị ở panel dưới.

## Bản v13 — layer tham chiếu và thay đổi kích thước sprite
- Sprite editor có layer pixel bên dưới và layer ảnh tham chiếu phủ mờ bên trên; có thể ẩn/hiện, chỉnh độ mờ hoặc gỡ ảnh tham chiếu. Ảnh tham chiếu không bị gộp vào sprite khi xuất PNG/lưu game.
- Nhập ảnh trực tiếp thành sprite pixel; ảnh lớn được thu về tối đa 512 px mỗi chiều. Công cụ Resize: kéo tay nắm giữa cạnh trên để đổi chiều cao, kéo góc để phóng/thu theo tỷ lệ. Hoàn tác khôi phục cả ảnh và kích thước.

## Bản v14 — giọng đọc dẫn đường tiếng Việt
- Khi bật **Đọc chỉ đường bằng tiếng Việt**, trình duyệt chọn voice `vi-VN`/`vi-*`, đặt ngôn ngữ và tốc độ đọc phù hợp; lựa chọn được lưu trên thiết bị. Nếu chưa cài giọng tiếng Việt, bản đồ báo để người dùng cài trong cài đặt đọc văn bản thay vì âm thầm dùng giọng sai ngôn ngữ.

## Bản v15 — Rust/WASM và bộ biểu tượng pixel riêng
- `rust/pixel-core/` xử lý vòng lặp màu cho 73.984 pixel mỗi khối mặt đất; Canvas, dựng hình và giao tiếp DOM vẫn ở JavaScript. Benchmark Chromium trên máy phát triển cho thấy vòng lặp WASM nhanh khoảng **2,3 lần** (5,8 ms JavaScript so với 2,5 ms WASM; kết quả thay đổi tùy máy).
- Cài Rust stable, chạy `rustup target add wasm32-unknown-unknown`, rồi `build-wasm.bat` để tạo `wasm/pixel_core.wasm`. Khi mở qua localhost/hosting, game tự nạp mô-đun; nếu thiếu WASM, trình duyệt không hỗ trợ hoặc mở bằng `file://`, game dùng lại đường JavaScript.
- `js/16-ui.js` dùng bộ SVG pixel-art 16×16 tự vẽ cho điều hướng, địa điểm, thời gian, âm thanh, zoom, chụp ảnh, ánh sáng, sprite và chiều sâu; tên điều khiển/tooltip vẫn giữ nguyên.
