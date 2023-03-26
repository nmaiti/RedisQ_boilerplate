import time
from redis import Redis
from rq import Worker, Queue, Connection

REDIS_HOST = 'mq_redis'
REDIS_PORT = 6379
redis_conn = Redis(host=REDIS_HOST, port=REDIS_PORT)
listen = ['default']

if __name__ == '__main__':
    with Connection(redis_conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
