from datetime import datetime, timedelta
import pytz

stockholm_tz = pytz.timezone("Europe/Stockholm")

stockholmTime = datetime.utcnow().replace(tzinfo=pytz.UTC).astimezone(stockholm_tz)

print("Stockholm:", stockholmTime)
