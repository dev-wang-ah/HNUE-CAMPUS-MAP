"""Chạy server cục bộ (localhost) để sửa PNG xong chỉ cần F5; localhost cũng cho phép xin GPS."""
import http.server, socketserver, webbrowser, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', 8000), H) as s:
    print('Mở http://localhost:8000  (Ctrl+C để dừng)'); webbrowser.open('http://localhost:8000/'); s.serve_forever()
