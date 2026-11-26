import json, re, sys
from bs4 import BeautifulSoup, NavigableString
d=json.load(open(sys.argv[1])); out=sys.argv[2]
SITE='https://octc-id.github.io/avte-ai-workbook/'
stems={x['page'].split('/')[-1][:-5]:x for x in d}
def stem(p): return p.split('/')[-1][:-5]
parts=[]
for x in d:
    st=stem(x['page']); s=BeautifulSoup('<div id="root">'+x['html']+'</div>','lxml'); root=s.find(id='root')
    for sel in ['script','button','.btn-row','.page-tools','nav.chapter-nav','.done-btn','.save-note','.print-copy','.status','.cover-access','section.download','canvas','.jump','.prompt-tools','.soon','style']:
        for e in root.select(sel): e.decompose()
    for e in root.select('.padlet'):
        n=s.new_tag('p',attrs={'class':'note'}); n.string='In the web version, the class Padlet wall is built in here. The password is on the Before the Live Session page in Canvas.'; e.replace_with(n)
    for e in root.select('.no-print'): e.decompose()
    for e in root.select('.pulled'):
        n=s.new_tag('p',attrs={'class':'note'}); n.string='In the web version, your answers from earlier chapters appear here.'; e.replace_with(n)
    for sel in root.select('select'):
        opts=[o.get_text(strip=True) for o in sel.find_all('option')]
        n=s.new_tag('span',attrs={'class':'opts'}); n.string='Choices: '+'; '.join(opts); sel.replace_with(n)
    for ch in root.select('.choices'):
        ul=s.new_tag('ul',attrs={'class':'choice-list'})
        for lab in ch.find_all('label'):
            li=s.new_tag('li'); li.string=lab.get_text(' ',strip=True); ul.append(li)
        ch.replace_with(ul)
    for e in root.select('input, textarea'): e.decompose()
    for e in root.select('.field'):
        e['class']=e.get('class',[])+['pad']
    for e in root.find_all(attrs={'style':True}): del e['style']
    for e in root.find_all(['label']):
        e.name='p'; e.attrs={'class':['q']}
    for e in root.find_all(attrs={'aria-live':True}): del e['aria-live']
    for e in root.find_all(True):
        for a in ['data-save','data-from','data-builder','for','name','aria-labelledby','aria-describedby','data-action','data-lock','role','tabindex','hidden','download','data-file']:
            if a in e.attrs: del e[a]
    if st=='week7-takeaway':
        art=root.find('article') or root
        h1=art.find('h1'); keep=s.new_tag('div')
        p=s.new_tag('p'); p.append('Your Week 7 takeaway is a one-page summary that builds itself from your answers in Chapters 3 to 7. It only works in the web version, because your answers are saved in your browser. ')
        a=s.new_tag('a',href=SITE+'chapters/week7-takeaway.html'); a.string='Open the takeaway in the web version'; p.append(a); p.append('.')
        for c in list(art.children): c.extract()
        art.append(h1); art.append(p)
    if st=='label-maker':
        for e in root.select('section.try'):
            p=s.new_tag('p'); p.append('The label maker draws No AI, AI-supported, and AI-integrated labels you can save as images. It works in the web version: ')
            a=s.new_tag('a',href=SITE+'resources/label-maker.html'); a.string='open the label maker'; p.append(a); p.append('.'); e.replace_with(p)
    if st=='index':
        for e in root.select('li.chapter'):
            pass
    # ids and links
    for e in root.find_all(id=True): e['id']=st+'--'+e['id']
    for a in root.find_all('a',href=True):
        h=a['href']
        if h.startswith('http') or h.startswith('mailto:'): continue
        m=re.match(r'^(?:\.\./)?(?:chapters/|resources/)?([\w-]+)\.html(?:#(.*))?$',h)
        if h.startswith('#'): a['href']='#'+st+'--'+h[1:]; continue
        if m and m.group(1) in stems:
            a['href']='#'+(m.group(1)+'--'+m.group(2) if m.group(2) else 'ch-'+m.group(1))
        else:
            a['href']=SITE+re.sub(r'^(\.\./)+','',h if not h.startswith('../') else h[3:]) if not h.startswith('downloads') else SITE+h
            if h.startswith('../'): a['href']=SITE+h[3:]
    for e in root.select('strong.empty, span.empty, dd.empty'):
        par=e.find_parent('p')
        (par or e).decompose()
    for e in root.select('details.worked'):
        e.name='div'; e.attrs={'class':['worked']}
        sm=e.find('summary')
        if sm: sm.name='h3'; sm.attrs={'class':['worked-title']}
    for e in root.select('legend'):
        e.name='p'; e.attrs={'class':['q']}
    for e in root.select('.prompt-out'):
        e.name='pre'; e.attrs={}
    for e in root.find_all('p', class_=True):
        cls=e['class']; del e['class']
        w=s.new_tag('div',attrs={'class':cls}); e.wrap(w)
    # heading: one h1 at top, kicker after
    h1=root.find('h1')
    if not h1:
        h1=s.new_tag('h1'); h1.string='About this workbook'; root.insert(0,h1)
    h1.extract(); h1['id']='ch-'+st
    kick=root.find('p',class_='kicker')
    root.insert(0,h1)
    parts.append(str(root.decode_contents()))
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AI and Your Teaching</title></head><body>\n'+'\n'.join(parts)+'\n</body></html>'
open(out,'w').write(html)
