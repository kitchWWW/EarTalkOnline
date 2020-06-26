import os
import json
import time
import unicodedata
import requests




x = requests.get('http://www.eartalk.org/teleListRecordings')
x2 = json.loads(x.content)
print(x2);
url = 'https://eartalk.org/otherProjects/tele/';
out='output2/'


data = requests.get(url+'/tree.json')
outFD = open(out+'tree.json','w')
outFD.write(data.content)
outFD.close()

tree = json.loads(data.content)

try:
	os.mkdir(out+'/recordings')
except:
	pass
try:
	os.mkdir(out+'/recordings_all')
except:
	pass

maxItoCountTo = 0;
shouldContinue=0
i = 0
while shouldContinue<10:
	url2use = url+'recordings_all/s'+str(i)+'_Anon'
	data = requests.get(url2use)
	print(url2use)
	print(data)
	if(data.status_code == 404):
		shouldContinue+=1
		i+=1
		continue
	print(data.status_code)
	outFD = open(out+'recordings_all/s'+str(i)+'_Anon','wb')
	outFD.write(data.content)
	outFD.close()
	i+=1
	maxItoCountTo = i

for i in range(maxItoCountTo+10):
	url2use = url+'recordings/s'+str(i)+'_Anon'
	data = requests.get(url2use)
	print(url2use)
	if(data.status_code == 404):
		continue
	print(data.status_code)
	outFD = open(out+'recordings/s'+str(i)+'_Anon','wb')
	outFD.write(data.content)
	outFD.close()




os.system('mv '+out+'/tree.json ../../app/otherProjects/tele/')
os.system('mv '+out+'/recordings/* ../../app/otherProjects/tele/recordings')
os.system('mv '+out+'/recordings_all/* ../../app/otherProjects/tele/recordings_all')


