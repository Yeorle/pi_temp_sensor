import time
import board
import adafruit_dht
import database

# Initialize the DHT device, with data pin connected to:
# GPIO 4 (active)
dhtDevice = adafruit_dht.DHT22(board.D4)

def main():
    print("Starting Data Logger...")
    database.init_db()
    
    while True:
        try:
            # Print the values to the serial port
            temperature_c = dhtDevice.temperature
            humidity = dhtDevice.humidity
            
            if humidity is not None and temperature_c is not None:
                print(f"Temp: {temperature_c:.1f} C    Humidity: {humidity:.1f}%")
                database.log_data(temperature_c, humidity)
            else:
                print("Failed to retrieve data from humidity sensor")

        except RuntimeError as error:
            # Errors happen fairly often, DHT's are hard to read, just keep going
            print(error.args[0])
            time.sleep(2.0)
            continue
        except Exception as error:
            dhtDevice.exit()
            raise error

        # Wait 60 seconds before next reading
        time.sleep(60.0)

if __name__ == "__main__":
    main()
