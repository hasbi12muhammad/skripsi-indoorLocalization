from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report
from sklearn.utils import shuffle
from sklearn import model_selection
from warnings import simplefilter
import pandas
import logging
from flask import Flask
from flask import request
from datetime import datetime
import csv

app = Flask(__name__)


log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

url_dt = "rssi_collected.csv"
header_dt = ['ruang', 'time', 'node1',
             'node2', 'node3', 'node4', 'node5']
data_training = pandas.read_csv(url_dt, names=header_dt)

del data_training['time']

arr = data_training.values

arr = shuffle(arr, random_state=8)

x_dt = arr[:, 1:6]
y_dt = arr[:, 0]

x_ds = []
y_ds = []

simplefilter(action='ignore', category=FutureWarning)

knn = KNeighborsClassifier()
knn.fit(x_dt, y_dt)

# Mac 1 dan Mac 2 untuk ESP32 pada Ruang 1
# Mac 3 dan Mac 4 untuk ESP32 pada Ruang 2
# Mac 5 dan Mac 6 untuk ESP32 pada Ruang 3

mac = ["3C:71:BF:C4:E1:F4", "B4:E6:2D:B7:72:45", "B4:E6:2D:B7:6B:91",
       "3C:71:BF:88:A0:B4", "B4:E6:2D:B3:57:E5"]

# rssi[0] untuk Mac 1, rssi[1] untuk Mac 2, dst...
rssi = [None, None, None, None, None]
node = [None, None, None, None, None]


@app.route("/", methods=['POST'])
def main():
    try:
        data = request.get_json(force=True)
        global rssi, node
        for i in range(len(node)):
            if data['mac'] == mac[i]:
                if node[i] == None:
                    node[i] = "OK"
                    print('Node ', i+1, 'is Online')
                rssi[i] = data['rssi']
                break
        if not any(x is None for x in rssi):
            nTemp = -120
            bEqual = True

            for item in rssi:
                if nTemp != item:
                    bEqual = False
                    break

            if bEqual:
                print("iTAG tidak terdeteksi")
            else:
                global x_ds
                x_ds = [[rssi[0], rssi[1], rssi[2], rssi[3], rssi[4]]]
                if x_ds != None:
                    predictions = knn.predict(x_ds)
                    print("Pada Jam ", datetime.now().time().replace(
                        microsecond=0), "iTAG berada di", predictions[0])
                    new_row = [predictions[0], datetime.now(
                    ).time().replace(microsecond=0)]

                    with open('real_time_result.csv', 'a', newline='') as csv_file:
                        writer = csv.writer(
                            csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
                        writer.writerow(new_row)

                    csv_file.close()
        return ""
    except Exception as e:
        return print('error', e)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
