"""Đóng gói PNG trong sprites/ thành data/sprites-packed.js (dùng khi mở index.html trực tiếp bằng file://).
Cũng ghi lại data/sprite-manifest.js từ sprites/manifest.json (sửa ox/oy ở đó nếu cần dịch vị trí sprite)."""
import json, base64, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
M = json.loads((R/'sprites/manifest.json').read_text(encoding='utf-8')); pack = {}
for kind in ('b', 't'):
    for k, v in M[kind].items():
        pack[kind+k] = 'data:image/png;base64,' + base64.b64encode((R/v['f']).read_bytes()).decode()
(R/'data/sprite-manifest.js').write_text('window.SPRITES=' + json.dumps(M, ensure_ascii=False, separators=(',', ':')) + ';', encoding='utf-8')
(R/'data/sprites-packed.js').write_text('window.SPRITE_PACK=' + json.dumps(pack, separators=(',', ':')) + ';', encoding='utf-8')
print('Đã đóng gói', len(pack), 'sprite')
