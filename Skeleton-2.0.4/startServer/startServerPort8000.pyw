import os
from bs4 import BeautifulSoup
import urllib.request
from urllib.parse import urlparse
from http.server import HTTPServer, CGIHTTPRequestHandler, SimpleHTTPRequestHandler
import socket
import logging

log_filename = "server.log"
logging.basicConfig(filename=log_filename, filemode='w', format='%(asctime)s - %(levelname)s - %(message)s', level = logging.INFO)

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        logging.info(self.path)
        if self.path.startswith('/get-page-title'):
            # Get the URL from the query string and decode it
            # Parse the URL
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            # Extract the query parameters
            logging.info(query_params)
            if "url" in query_params and "userAgent" in query_params:
                url = urllib.parse.unquote(query_params['url'][0])
                userAgent = urllib.parse.unquote(query_params['userAgent'][0])
            else:
                logging.error("query doesn't contain the required parameters")
                self.send_response(400)  # Bad request
                self.end_headers()
                return

            logging.info(self.path + " entered the page title search with url : " + url )
            # if not is_valid_url(url):  
            #     print("url is not valid : " + url)
            #     self.send_response(204)
            #     self.end_headers()
            # else:
                # Fetch the page and extract the title
            try:
                sendOkResponseWithText(self, createRequest(url, userAgent))
            # except urllib.error.HTTPError as e:
            #     try:
            #         logging.info(str(e) + " resulted in trying to falseflag as a user :)")
            #         # try again, but with a user agent if servers are blacklisted
            #         userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36'
            #         sendOkResponseWithText(self, createRequest(url,userAgent))

            #     except Exception as e:
            #         logging.info(str(e) + " - falseflagging failed, aborting mission, I repeat... it's over")
            #         raise
            except Exception as e:
                logging.error(str(e))
                self.send_response(204)
                self.end_headers()
                return
        else:
            super().do_GET()

# def is_valid_url(url):
#     """Returns True if the URL is likely to be valid, False otherwise"""
#     parse_result = urlparse(url)
#     if not parse_result.scheme:
#         # URL does not have a valid scheme
#         return False
#     try:
#         # Validate the hostname
#         hostname, aliaslist, _ = socket.gethostbyname_ex(parse_result.hostname)
#         if aliaslist:
#             # Hostname has aliases, use the first one
#             hostname = aliaslist[0]
#         else:
#             # Hostname does not have aliases, use the hostname itself
#             hostname = parse_result.hostname
#     except socket.gaierror:
#         # Hostname is not a valid domain name or IP address
#         return False
#     return True

# This function creates an HTTP request with a user agent header
# and returns the page title of the specified URL
def createRequest(url, userAgent = None):
    # Create the request object
    request = urllib.request.Request(url)
    # Check if a user agent is provided
    if userAgent is not None:
        # Add the user agent header to the request
        request.add_header('User-Agent', userAgent)
        logging.info("User agent : " + userAgent + " was used")
    # Scrape the page title and return it
    return scrapePageTitle(request)
        
# This function scrapes the page title from an HTTP response
def scrapePageTitle(request):
    # Open the request and read the response
    with urllib.request.urlopen(request, timeout=5) as response:
        html = response.read()
        # Parse the HTML using Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')
        # Get the page title
        title = soup.title.string
        # Return the page title
        return title

def sendOkResponseWithText(self, response):
    # Set the response status code
    self.send_response(200)

    # Set the content type to plain text
    self.send_header('Content-type', 'text/plain')
    self.end_headers()

    # Write the page title in the response body
    logging.info(response.encode())
    self.wfile.write(response.encode())

# This is the main function that starts the web server
def main():
    # Change the current working directory to the specified path
    os.chdir('D:\\bureau\wallpaper\ProjectHomeGround\Skeleton-2.0.4')
    # Create a server object listening on port 8000
    server_object = HTTPServer(server_address=('', 8000), RequestHandlerClass=CustomHTTPRequestHandler)
    # Set the timeout for the server (optional)
    server_object.timeout = 10
    # Start the web server and handle requests indefinitely
    server_object.serve_forever()


if __name__ == '__main__':
    main()
