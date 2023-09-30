FROM python:3.9-slim

WORKDIR /usr/src/app

ENV PYTHONUNBUFFERED=1
COPY ./requirements.txt ./
RUN apt-get update && apt-get install pkg-config=1.8.1-1 default-libmysqlclient-dev=1.1.0 build-essential=12.9 -y --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r ./requirements.txt

COPY ./role_listing .

EXPOSE 5002

CMD [ "python", "./role_listing.py" ]