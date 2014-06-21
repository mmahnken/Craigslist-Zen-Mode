import requests
import BeautifulSoup as bs
import HTMLParser as hp
import urlparse

def get_base(link):
    split = urlparse.urlsplit(link)
    return split[0]+'://'+split[1]

def get_soup(link):
    soup = bs.BeautifulSoup(requests.get(link).text).\
        find('div', {'class': 'content'}).\
        findAll('a')
    base_url = get_base(link)
    return soup, base_url

def parse_title(title):
    parser = hp.HTMLParser()
    return parser.unescape(title)

# slow
def get_images(soup, base_url):
    images = {}
    for link in soup:
        print link['href']
        try:
            more_soup = bs.BeautifulSoup(requests.get(base_url+link['href']).text)
            title = parse_title(more_soup.find('h2',{'class':'postingtitle'}).text)
            links_array = [a_link['href'] for a_link in more_soup.find('div', {'id':'thumbs'}).findAll('a')]
            images[base_url+link['href']] = {"pics":links_array, "title":title}
        except:
            print "Not a link"
    return images
