import requests
import BeautifulSoup as bs
import HTMLParser as hp
import urlparse
import json
import datetime
import mapping_helpers

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
        try:
            more_soup = bs.BeautifulSoup(requests.get(base_url+link['href']).text)
            title = parse_title(more_soup.find('h2',{'class':'postingtitle'}).text)
            links_array = [a_link['href'] for a_link in more_soup.find('div', {'id':'thumbs'}).findAll('a')]
            images[base_url+link['href']] = {"pics":links_array, "title":title}
        except:
            print "Not a link"
    return images


#for AJAX step 1
def get_links(link):
    links = []
    all_links = bs.BeautifulSoup(requests.get(link).text).\
        findAll('a')
    # links.extend(link['href'] for link in all_links if link.has_key('href') and link not in links)
    for l in all_links:
        if l.has_key('href') and l['href'] not in links and l['href'][0] != '//':
            if 'search' not in l['href'] and '.org' not in l['href'] and 'about' not in l['href'] and '/' in l['href']:
                print 'DEBUG %s' % l['href']
                links.append(l['href'])
    base_url = get_base(link)
    return json.dumps({'list_of_links': links, 'base_url': base_url})


#for AJAX step 2
def get_one_listing(link):
    images = []
    try:
        more_soup = bs.BeautifulSoup(requests.get(link).text)
        images = [a_link['href'] for a_link in more_soup.find('div', {'id': 'thumbs'}).findAll('a')]
    except:
        raise Exception('Not a listing with images.')
        return None
    try:
        maps = more_soup.find('p', {'class': 'mapaddress'}).findAll('a')
        latlng = mapping_helpers.get_lat_longs(maps[0]['href'])
    except:
        raise Exception('No map on this listing.')
        latlng = None

    return json.dumps({'images': images, 'postingUrl': link, 'latlng': latlng})
