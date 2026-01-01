# Raspberry Pi Temperature & Humidity Monitor

This project uses a Raspberry Pi and a DHT22 sensor to log temperature and humidity data to a local database and display it on a beautiful web dashboard.

## 🚀 Features

- **Automated Logging**: Reads sensor data every minute.
- **Data Persistence**: Stores readings in a lightweight SQLite database.
- **Web Dashboard**: View real-time values and historical graphs on any device in your local network.
- **Modern UI**: Dark mode, responsive design, and interactive charts.

## 🛠 Hardware Required

- **Raspberry Pi** (3B+, 4, or Zero W)
- **DHT22** Sensor (AM2302)
- **Jumper Wires** (Female-to-Female or Female-to-Male depending on your header)

## 🔌 Wiring

Connect the DHT22 sensor to the Raspberry Pi:

| DHT22 Pin | Raspberry Pi Pin |
|-----------|------------------|
| **VCC (+)** | 3.3V (Pin 1) |
| **GND (-)** | GND (Pin 9) |
| **DATA** | GPIO 4 (Pin 7) |

> [!NOTE]
> If you are using a bare DHT22 module (white grid), you may need a 10k resistor between VCC and DATA. Most PCB-mounted modules (blue/black board) already include this.

## 💿 Installation

1. **Clone or Copy the Code**
   Download this project to your Raspberry Pi, preferably at `/home/pi/pi_temp_sensor`.

2. **Install System Dependencies**
   The Adafruit DHT library requires `libgpiod3` and `python3-pip`.
   ```bash
   sudo apt-get update
   sudo apt-get install -y python3-pip libgpiod3
   ```

3. **Install Python Dependencies**
   ```bash
   # Create a virtual environment (Recommended)
   python3 -m venv venv
   source venv/bin/activate

   # Install requirements
   pip install -r requirements.txt
   ```
   > If you cannot create a virtualenv, you can install globally with `pip3 install --break-system-packages -r requirements.txt` (Raspberry Pi OS Bookworm+ requirement).

## 🏃 Running the Application

### Method 1: Manual Run (Testing)
Open two terminal windows:

**Terminal 1 (Logger):**
```bash
python3 logger.py
```
*You should see temperature readings printed to the console.*

**Terminal 2 (Web Server):**
```bash
python3 app.py
```
*Access the dashboard at `http://<YOUR_PI_IP>:5000`*

### Method 2: Systemd Service (Auto-start on Boot)

1. **Edit the Service Files**
   Check `sensor-logger.service` and `sensor-web.service` to ensure the paths match your installation (default assumes `/home/pi/pi_temp_sensor`).

2. **Install Services**
   ```bash
   sudo cp sensor-logger.service /etc/systemd/system/
   sudo cp sensor-web.service /etc/systemd/system/
   
   sudo systemctl daemon-reload
   sudo systemctl enable sensor-logger
   sudo systemctl enable sensor-web
   sudo systemctl start sensor-logger
   sudo systemctl start sensor-web
   ```

3. **Check Status**
   ```bash
   sudo systemctl status sensor-logger
   sudo systemctl status sensor-web
   ```

## 📊 Usage

Navigate to `http://raspberrypi.local:5000` or `http://<IP_ADDRESS>:5000` in your browser.
The charts will update every minute with new data properly stored in `sensor_data.db`.

## 🐛 Troubleshooting

- **"Failed to retrieve data"**: DHT22 sensors can be finicky. The script retries automatically. Check wiring if it fails constantly.
- **Permission Errors**: Ensure the user running the script has GPIO access (`gpio` group).
