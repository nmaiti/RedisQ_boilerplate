import os
import re
from urllib.parse import unquote
from flask import Flask, request, Response
from flask_cors import CORS
from redis import Redis
from rq import Queue
from rq.job import Job
import os
import zipfile
import json
from nanoid import generate


# temp
import time

from worker import process_file_task

app = Flask(__name__)
CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})

#CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

REDIS_HOST = '192.168.7.104'
REDIS_PORT = 6379



redis_conn = Redis(host=REDIS_HOST, port=REDIS_PORT)
queue = Queue(connection=redis_conn)


@app.route("/")
def helloWorld():
  return "Hello, cross-origin-world!"



@app.route('/upload', methods=['POST'])
def process_file():
    file = request.files['file']
    # save the file to disk
    directory = str(generate())
    path = os.path.join(app.config['UPLOAD_FOLDER'], directory)
    os.mkdir(path, 0o666)
    file_path = os.path.join(path, file.filename)

    print(f'file_path : {file_path}---', flush=True)
#    file.save(file_path)
    file.save(file_path)

    # add the file to the queue for processing
    job = queue.enqueue(process_file_task, file_path)
    # return the job ID to the client
    return json.dumps({'job_id': job.id, 'filepath': file_path})

@app.route('/status/<job_id>')
def job_status(job_id):
    def send_event(event, data):

        message = 'event: {}\ndata: {}\n\n'.format(event, json.dumps(data))
        print(f'Msg to return {message}', flush=True)
        return message

    # create an SSE response object
    response = Response(status=200, mimetype='text/event-stream')
    response.headers.add('Cache-Control', 'no-cache')
    response.headers.add('Connection', 'keep-alive')

    # send initial connection acknowledgement
    initial_data = {'status': 'connected'}
    response.data = send_event('connected', initial_data)

    print('Here before job check!', flush=True)
    # wait for job to finish
    job = queue.fetch_job(job_id)
    while job and not job.is_finished and not job.is_failed:
        # wait for 1 second before checking job status again
        time.sleep(1)
        job = queue.fetch_job(job_id)
        # send status update to client
        status_data = {'status': 'in progress' }
    #    response.data += send_event('status', status_data)
        response.data = '{}{}'.format(response.data, send_event('status', status_data))

        # job has finished, send final status update
        if job and job.is_finished:
            result_data = {'status': 'finished', 'result': job.result}
        # result_data = {'status': 'finished', 'result': job.result, 'filename': job.worker.process_file_task}
        #    response.data += send_event('status', result_data)
            response.data = '{}{}'.format(response.data, send_event('status', result_data))
            break
        elif job and job.is_failed:
            error_data = {'status': 'failed', 'error': str(job.exc_info)}
        #    response.data += send_event('status', error_data)
            response.data = '{}{}'.format(response.data, send_event('status', error_data))
            break
        else :
            continue

    # return the SSE response object
    return response


@app.route('/zip-folder', methods=['GET'])
def zip_and_download():
#    print(f"In zip-folder", flush=True)
    # Get the path to the folder to zip
    encoded_folder_path  = request.args.get('ddir')
    folder_path = unquote(encoded_folder_path)

    print(f"folder_path: {folder_path}", flush=True)
    pattern ='^(/uploads/\S+)/\S+\..*$'

    only_folder=""

    mlist = re.findall(pattern, folder_path)
    if mlist and mlist[0] != '' :
        only_folder = mlist[0]
    else:
        return

    folder_path = only_folder
    folder_name  = os.path.basename(only_folder)
    zip_path = folder_name + '.zip'
    with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                zip_file.write(os.path.join(root, file))

    return Response(
        open(zip_path, 'rb'),
        mimetype='application/zip',
        headers={'Content-Disposition': f'attachment;filename={folder_name}.zip'}
    )

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = '/uploads'
    app.run(host='0.0.0.0', debug=True, threaded=True)


