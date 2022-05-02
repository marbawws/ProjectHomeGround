import os
from http.server import HTTPServer, CGIHTTPRequestHandler

def main():
    os.chdir('D:\\bureau\wallpaper\ProjectHomeGround\Skeleton-2.0.4')
    # Create server object listening the port 80
    server_object = HTTPServer(server_address=('', 8000), RequestHandlerClass=CGIHTTPRequestHandler)
    # Start the web server
    server_object.serve_forever()

if __name__ == '__main__':
    main()
