import pandas
from sklearn.utils import shuffle
from warnings import simplefilter



url_dt = "data_pengujian_1.csv"

header_dt = ['predict','time','true_loc','sub_loc','compatiblity']

data = pandas.read_csv(url_dt, names=header_dt)

del data['time']

arr = data.values
arr = shuffle(arr, random_state=8)

# ignore all future warnings
simplefilter(action='ignore', category=FutureWarning)

mismatch = 0
for i in range(len(arr)):
    if arr[i][2] == "Mismatch":
        mismatch = mismatch + 1
    
percent = mismatch / len(arr) * 100    
print("Akurasi kesalahan sistem =",round(percent,2),"%")



