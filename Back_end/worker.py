import time



def process_file_task(file_path):
    # simulate some processing time
    print(f"work start: {file_path} -----------", flush=True)

    time.sleep(13)
    # return the result
    print("process_file work done", flush=True)
    return {'status': 'success'}
