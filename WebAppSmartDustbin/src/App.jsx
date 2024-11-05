import axios from "axios"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client'

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = io('https://iotbackend.nabilnewaz.com', {
      // path: import.meta.env.VITE_SOCKET_URL=='http://localhost:9000' ? '' : '/socket/socket.io',
      secure: true
    })
    socket.on("connect", () => {
      setSocket(socket);
      console.log("Socket connected");
    })
    socket.on("error", (error) => {
      console.error("Socket connection error:", error);
      setSocket(null)
    });

    socket.on("dustbin_status", (data) => {
      setIsOpen(data)
    });
  }, []);

  const openDustbin = () => {
    const toastId = toast.loading('Posting...');
    axios.get('https://pos.nvisionbd.net/api/smart_dustbin_api/open_dustbin')
      .then(res => {
        console.log(res.data)
        setIsOpen(true);
        toast.update(toastId, {
          render: 'Dustbin has been opened',
          type: 'success',
          isLoading: false,
          autoClose: 2000 // Automatically close after 3 seconds
        });
      })
      .catch(err => {
        setIsOpen(false);
        toast.update(toastId, {
          render: 'Failed to open dustbin',
          type: 'error',
          isLoading: false,
          autoClose: 2000 // Automatically close after 3 seconds
        });
        console.log(err)
      })
  }

  const closeDustbin = () => {
    const toastId = toast.loading('Posting...');
    axios.get('https://pos.nvisionbd.net/api/smart_dustbin_api/close_dustbin')
      .then(res => {
        console.log(res.data)
        setIsOpen(false);
        toast.update(toastId, {
          render: 'Dustbin has been closed',
          type: 'success',
          isLoading: false,
          autoClose: 2000 // Automatically close after 3 seconds
        });
      })
      .catch(err => {
        setIsOpen(true);
        toast.update(toastId, {
          render: 'Failed to close dustbin',
          type: 'error',
          isLoading: false,
          autoClose: 2000 // Automatically close after 3 seconds
        });
        console.log(err)
      })
  }

  return (
    <div className='min-h-screen mx-auto flex justify-center items-center'>
      <ToastContainer
        autoClose={2000}
        position="bottom-center"
        limit={5}
      />
      <div>
        <p className='text-center mb-7 text-2xl font-bold'>Control Smart Dustbin</p>
        <div className='flex gap-3'>
          <button disabled={isOpen} onClick={openDustbin} type="button" className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mb-2  gap-5 flex-col disabled:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
            <svg className='w-20 h-fit fill-white' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
              width="800px" height="800px" viewBox="0 0 555.377 555.378"
              xmlSpace="preserve">
              <g>
                <g>
                  <path d="M409.442,226.725h-293.76v328.653h293.76V226.725z M193.712,510.497h-15.3V271.605h15.3V510.497z M270.212,510.497h-15.3
			V271.605h15.3V510.497z M346.712,510.497h-15.301V271.605h15.301V510.497z"/>
                  <path d="M439.696,165.521l-59.808-34.783l31.897-54.847L281.292,0l-31.897,54.844l-63.633-37.007L155.508,69.86l253.934,147.685
			L439.696,165.521z M292.36,41.836l77.59,45.125l-16.515,28.394L275.842,70.23L292.36,41.836z"/>
                </g>
              </g>
            </svg>
            <p>Open Dustbin</p>
          </button>
          <button disabled={!isOpen} onClick={closeDustbin} type="button" className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mb-2  gap-5 flex-col disabled:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
            <svg className='w-[3.8rem] mt-5 h-fit fill-white' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
              width="800px" height="800px" viewBox="0 0 468.36 468.36"
              xmlSpace="preserve">
              <g>
                <g>
                  <path d="M381.048,64.229l-71.396,0.031L309.624,0L158.666,0.064l0.027,64.26l-71.405,0.031l0.024,60.056h293.76L381.048,64.229z
			 M189.274,30.652l89.759-0.04l0.016,33.66l-89.759,0.04L189.274,30.652z"/>
                  <path d="M87.312,468.36h293.76V139.71H87.312V468.36z M303.042,184.588h15.301v238.891h-15.301V184.588z M226.542,184.588h15.3
			v238.891h-15.3V184.588z M150.042,184.588h15.3v238.891h-15.3V184.588z"/>
                </g>
              </g>
            </svg>
            <p>Close Dustbin</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
