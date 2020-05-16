fs = open("log.txt").readlines()
names = []
for l in fs:
	name = " ".join(l.split(' - ')[1].split(" ")[:-2])
	print(name)
	names.append(name)

print(set(names))

print(len(set(names)))