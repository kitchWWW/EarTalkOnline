
#import the pyplot and wavfile modules 

import matplotlib.pyplot as plot

from scipy.io import wavfile

 

# Read the wav file (mono)

samplingFrequency, signalData = wavfile.read('voice2.m4a')

if(signalData.shape[1] == 2):
	plot.plot(signalData[:, 0]) # get the first channel for display
else:
	plot.plot(signalData)

 

plot.show()