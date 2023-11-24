from http.server import SimpleHTTPRequestHandler, HTTPServer

class NoCacheRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Override the caching headers to set max-age=0
        self.send_header('Cache-Control', 'max-age=0')
        super().end_headers()

# Create a simple HTTP server with the custom request handler
port = 8000
httpd = HTTPServer(('localhost', port), NoCacheRequestHandler)

print(f"Serving on port {port}")
httpd.serve_forever()
