import geocoder
from urllib import unquote
from urlparse import urlparse, parse_qs


def get_lat_longs(url):
    if '@' in url:
        latlong = url.split('@')[1].split(',')  # ['37.850154', '-122.254508', '16z']
        return {'lat': latlong[0], 'lng': latlong[1]}
    elif 'loc' in url:
        decoded = unquote(url).decode('utf8')
        parsed = urlparse(decoded)
        query = parse_qs(parsed.query)
        address = query['q'][0].split(':')[1].lstrip()  # '1927 5th Ave Oakland CA US'
        latlong = geocoder.google(address).latlng  # [37.8275134, -122.2537803]
        return {'lat': latlong[0], 'lng': latlong[1]}
    else:
        Exception('Not a google maps link.')
        return None
