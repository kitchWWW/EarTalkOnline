import os
import json
import time
import unicodedata
import requests




x = requests.get('http://www.eartalk.org/listAllScores')
x2 = json.loads(x.content)
print(x2);
url = 'http://www.eartalk.org';
out='output/'


data = requests.get(url+'/server.log')
outFD = open(out+'server.log','w')
outFD.write(data.content)
outFD.close()

data = requests.get(url+'/chat.log')
outFD = open(out+'chat.log','w')
outFD.write(data.content)
outFD.close()

data = requests.get(url+'/score.json?id=id_bnleu667so5=|=|=|=|=Brian&timeOffset=0')
outFD = open(out+'score.json','w')
outFD.write(data.content)
outFD.close()

try:
	os.mkdir(out+'/samples')
except:
	pass
try:
	os.mkdir(out+'/scores')
except:
	pass


allAudioFiles = []

for s in x2:
	s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore')

	if s.startswith('.DS_Store'):
		continue
	data = requests.get(url+'/old_scores/'+s)
	score = json.loads(data.content)
	outFD = open(out+'scores/'+s,'w')
	outFD.write(data.content)
	outFD.close()
	for item in score:
		allAudioFiles.append(item)
	allAudioFiles = list(set(allAudioFiles))

print allAudioFiles

for a in allAudioFiles:
	data = requests.get(url+'/samples/'+a)
	outFD = open(out+'samples/'+a,'wb')
	outFD.write(data.content)
	outFD.close()





os.system('mv '+out+'/chat.log ../../app/')
os.system('mv '+out+'/server.log ../../app/')
os.system('mv '+out+'/score.json ../../app/')
os.system('mv '+out+'/samples/* ../../app/samples/')
os.system('mv '+out+'/scores/* ../../app/old_scores/')