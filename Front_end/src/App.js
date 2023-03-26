import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

//import UploadForm from './upload_form'
import {STREAM_URL} from "./config"



const HeroBannerContainer = styled.div`
  background-color: #0e245c;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeroBannerText = styled.div`
  text-align: center;
  color: #FFE133;
`;

const HeroBannerHeading = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
`;

const HeroBannerDescription = styled.p`
  font-size: 1.3rem;
`;



function App() {

  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);

  // handle file upload form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log("upload resp data: ", data)
    setJobs(jobs.concat([{ id: data.job_id, filename: data.filepath, status: 'pending' }]));

  };

  //    .filter(job =>
  // listen for SSE messages from server for each job
  useEffect(() => {
    const eventSources = jobs
      .filter(job => job.status === "pending")
      .map((job) => {
        console.log("STREAM_URL:", STREAM_URL)
        const eventSource = new EventSource(`${STREAM_URL}/api/status/${job.id}`);
        console.log("job:", job)
        eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log("closing event source", event)
        setJobs(
          jobs.map((j) =>
            j.id === job.id ? { ...j, status: data.status, result: data.result, error: data.error } : j
          )
        );
        if (data.status === "finished") {
          console.log("closing event source", eventSource)
          eventSource.close();
        }
      };
      return eventSource;
    });
    return () => {
      eventSources.forEach((eventSource) => eventSource.close());
    };
  }, [jobs]);

  // handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const downloadDirFile = (filepath) => {
    console.log("download logic goes here: ", filepath)
    const downloadUrl = `/api`.concat(`/zip-folder?ddir=${encodeURIComponent(filepath)}`);
    const link = document.createElement('a');
    link.href = downloadUrl;
    console.log("downloadUrl:", downloadUrl)
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <>
      <style>{`
        table{
          border:1px solid black;
          border-collapse: collapse;
          }
          table th, td {
            border: 1px solid #333;
            padding: 15px;
        }
      `}</style>
      <HeroBannerContainer>
        <HeroBannerText>
          <HeroBannerHeading>Redis MQ Demo frontend</HeroBannerHeading>
          <HeroBannerDescription>Upload some file to Process</HeroBannerDescription>
        </HeroBannerText>
      </HeroBannerContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 30
          }}
        >
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Submit</button>
          </form>
          </div>
          <div   style={{ 
             padding: "1em 0em",
             overflowX: "auto",
             width: "100%",
             direction: "ltr",
             boxSizing: "border-box" }}>
        <h2>Job status:</h2><p/>
        <table  >

            <tr>
              <th >Job ID</th>
              <th>Filename</th>
              <th>Status</th>
              <th>Results</th>
            </tr>

          {jobs.map((job) => (

            <tr>
            <td> {job.id}</td>
            <td>{job.filename}</td>
            <td>{job.status}</td>
            {job.status==='finished' && 
              <td>
              <div className="btnDiv">
                 <button id="downloadBtn" value="download" onClick={() => downloadDirFile(job.filename)} >Download</button>
               </div>
              </td>}
            </tr>

          ))}
        </table>
        </div>

    </>
  );
}

export default App;

///<div key={job.id}>
///<p>Job ID: {job.id}</p>
///<p>Status: {job.status}</p>
///{job.status === 'finished' && <p>Result: {job.result}</p>}
///{job.status === 'failed' && <p>Error: {job.error}</p>}
///</div>
