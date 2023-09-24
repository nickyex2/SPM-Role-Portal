FROM python:3.9-slim

WORKDIR /usr/src/app

ENV PYTHONUNBUFFERED=1
COPY ./requirements.txt ./
RUN apt update && apt install pkg-config default-libmysqlclient-dev build-essential -y --no-install-recommends
RUN pip install --no-cache-dir -r ./requirements.txt

COPY ./skills .

EXPOSE 5001

CMD [ "python", "./skills.py" ]