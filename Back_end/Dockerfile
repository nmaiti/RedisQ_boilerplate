FROM python:alpine3.16

RUN pip install --upgrade pip

COPY . /app
WORKDIR /app

RUN chmod +x /app/start.sh

RUN apk --no-cache add --virtual build-dependencies \
      build-base \
      musl-dev \
      && pip install -r requirements.txt \
      && rm -rf .cache/pip \
      && rm -rf /app/*.whl \
      && rm -rf ~/.cache/pip \
      && apk del build-dependencies


CMD ["sh"]