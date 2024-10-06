import React, { useState, useEffect, useMemo } from 'react';
import axios from '../config/api';
import { useTable, usePagination } from 'react-table';
import { VoiceRecorder } from 'react-voice-recorder-player';
import '../Home.css';

function Home() {
  const [audioURL, setAudioURL] = useState(null);
  const [notes, setNotes] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false); // Trigger re-render on upload
  const [voiceMemos, setVoiceMemos] = useState([]); // To store fetched voice memos
  const [loading, setLoading] = useState(true);

  // Handler when the recording is stopped
  const handleAudioStop = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
    setAudioBlob(blob);
  };

  // Function to handle the upload of audio and notes
  const sendAudioFile = async () => {
    setUploadComplete(prev => !prev);
    if (!audioBlob || !notes.trim()) {
      alert('Please provide both the recorded audio and notes.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', localStorage.getItem('userId'));
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('notes', notes);

    try {
      const response = await axios.post('/api/v1/voicememo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Upload successful!');
      setUploadComplete(prev => !prev);
      setNotes("");
      setAudioBlob(null);
      setAudioURL(null);
    } catch (error) {
      console.error('Error uploading audio and notes:', error);
    }
  };

  // Fetch voice memos when the page loads
  useEffect(() => {
    

    fetchVoiceMemos();
  }, [uploadComplete]);
  const fetchVoiceMemos = async () => {
    try {
      const response = await axios.post('/api/v1/voicememo/getall',{ userId: localStorage.getItem('userId') });
      setVoiceMemos(response.data.data); // Set the voice memos from the response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching voice memos:', error);
      setLoading(false);
    }
  };
  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: 'S.No',
        accessor: (row, index) => index + 1, // Auto-generate serial numbers
      },
      {
        Header: 'Notes',
        accessor: 'notes', // Access the "notes" key in the data
      },
      {
        Header: 'Audio',
        accessor: 'file',
        Cell: ({ value }) => <audio controls src={value} />, // Render the audio player
      },
    ],
    []
  );

  const data = useMemo(() => voiceMemos, [voiceMemos]);

  // Create the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Default pagination settings
    },
    usePagination
  );

  return (
    <div className="home">
      <h1>Welcome to the Home Page</h1>
      <p>You are logged in!</p>

      <div className="recorder">
        {
          !uploadComplete &&
          <VoiceRecorder
            onRecordingEnd={handleAudioStop}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
          />
        }
        
      </div>

      {audioURL && (
        <div className="audio-player">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here"
            rows="4"
            className="notes-textarea"
          />
          <button onClick={sendAudioFile} className="upload-button">
            Upload Audio & Notes
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="table-container">
        <h2>Uploaded Voice Memos</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table {...getTableProps()} className="voice-memo-table">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                Previous
              </button>
              <span>
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </span>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                Next
              </button>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
