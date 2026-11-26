import glob,json,subprocess,sys,pypdf
d,out=sys.argv[1],sys.argv[2]
titles=json.load(open(d+'/titles.json')); w=pypdf.PdfWriter()
files=sorted(glob.glob(d+'/[0-9][0-9].pdf'))
for f,t in zip(files,titles):
    r=pypdf.PdfReader(f); start=len(w.pages); kept=0
    for i,p in enumerate(r.pages):
        txt=subprocess.run(['pdftotext','-f',str(i+1),'-l',str(i+1),f,'-'],capture_output=True,text=True).stdout.strip()
        if i>0 and len(txt)<320 and ('Shared under' in txt or 'Last updated' in txt or 'Version' in txt or not txt): continue
        w.add_page(p); kept+=1
    label={'AI and Your Teaching':'Cover'}.get(t,t) if f!=files[0] else 'Title page'
    if f==files[1]: label='About this workbook and contents'
    w.add_outline_item(label,start)
w.add_metadata({'/Title':'AI and Your Teaching: A workbook for new vet tech faculty','/Author':'Stephanie Self','/Subject':'Week 7, AVTE Vet Tech New Faculty Academy','/Keywords':'AI, teaching, veterinary technology, faculty development'})
w._root_object.update({pypdf.generic.NameObject('/Lang'):pypdf.generic.TextStringObject('en-US')})
w.page_mode='/UseOutlines'
w.write(out); print(len(w.pages),'pages')
