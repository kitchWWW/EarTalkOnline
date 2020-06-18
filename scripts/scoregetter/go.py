import os

# go to /listAllScores and copy paste:

# url = http://www.eartalk.org
url = 'localhost:3000'
scores = [".DS_Store","score_1589594236903.json","score_1589595278752.json","score_1589595282474.json","score_1592453874751.json","score_1592453878945.json","score_1592453883579.json","score_1592453895244.json","score_1592453908659.json","score_1592453914124.json","score_1592453947038.json","score_1592453950227.json","score_1592453994444.json","score_1592454652511.json","score_1592454653355.json","score_1592454786366.json","score_1592454790476.json","score_1592454796298.json","score_1592455014877.json","score_1592455017490.json","score_1592455019229.json","score_1592455021970.json","score_1592455025925.json","score_1592455833269.json","score_1592455834799.json","score_1592455836070.json","score_1592456184157.json","score_1592456753484.json","score_1592456802053.json","score_1592458685684.json","score_1592458688516.json","score_1592458692440.json","score_1592458693709.json","score_1592458974027.json","score_1592459295397.json"]


for s in scores:
	os.system("curl "+url+'/old_scores/'+s+' > '+s)