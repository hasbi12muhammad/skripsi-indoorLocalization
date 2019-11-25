from bluepy.btle import Scanner, DefaultDelegate
import requests 
  
# defining the api-endpoint  
API_ENDPOINT = "http://192.168.9:8080/"

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleDiscovery(self, dev, isNewDev, isNewData):
        if isNewDev:
            print ("Discovered device", dev.addr)
        elif isNewData:
            print ("Received new data from", dev.addr)

scanner = Scanner().withDelegate(ScanDelegate())

while True:
    devices = scanner.scan(1)

    for dev in devices: 
        data = {'RSSI':dev.rssi}
        r = requests.post(url = API_ENDPOINT, data = data) 
        pastebin_url = r.text 
        print("The pastebin URL is:%s"%pastebin_url) 

        #print("RSSI ", dev.rssi)


    #print ("Device %s (%s), RSSI=%d dB" % (dev.addr, dev.addrType, dev.rssi))
    #for (adtype, desc, value) in dev.getScanData():
    #    print ("  %s = %s" % (desc, value))