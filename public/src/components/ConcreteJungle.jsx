//! -----===== \\\ MAIN COMPONENT - FATHER ///=====-----
import React, { useState, useEffect } from "react";
import InstrumentRack from "./InstrumentRack";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./MusicComponent.css";
function EnsambleRack() {
  //! -----=====\\\ States ///=====-----
  //? create new audio context for the session (global)
  const [ctx, setCtx] = useState(null);
  //----------------------------------------------------------------------
  //? State to hold the global play/stop state
  const [playState, setPlayState] = useState(false);
  //----------------------------------------------------------------------
  //? State to hold the loaded state of the InstrumentRack components (drums, bass, guitar, piano)
  //? each index of the array represents the loaded state of each InstrumentRack component
  const [loaded, setLoaded] = useState([false, false, false, false]);
  //----------------------------------------------------------------------
  //? State to verify if all the InstrumentRack components are loaded
  //? When all loaded array stsate is true, the play button will be enabled
  //TODO - this state is not working properly
  const [allLoaded, setAllLoaded] = useState(false);
  //----------------------------------------------------------------------
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["jwt"]);
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          toast.success("Swing baby, Swing!!", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  //----------------------------------------------------------------------
  //? State to hold the active audio file in each InstrumentRack component
  //TODO - this state is not working properly
  const [activeAudioFile, setActiveAudioFile] = useState([
    null,
    null,
    null,
    null,
  ]);
  //----------------------------------------------------------------------
  //? state to trigger PLay/Stop in child components
  const [playTrigger, setPlayTrigger] = useState(false);
  //======================================================================
  //! -----=====\\\ Audio Files ///=====-----
  //? complete url list to be paeeed to each kit
  const audioFiles = {
    drums: [
      { src: "./samples/CosoDrum1.mp3" },
      { src: "./samples/CosoDrum2.mp3" },
      { src: "./samples/CosoDrum3.mp3" },
      { src: "./samples/CosoDrum4.mp3" },
    ],
    bass: [
      { src: "./samples/CosoBass1.mp3" },
      { src: "./samples/CosoBass2.mp3" },
      { src: "./samples/CosoBass3.mp3" },
      { src: "./samples/CosoBass4.mp3" },
    ],
    guitar: [
      { src: "./samples/CosoLead1.mp3" },
      { src: "./samples/CosoLead2.mp3" },
      { src: "./samples/CosoLead3.mp3" },
      { src: "./samples/CosoLead4.mp3" },
    ],
    piano: [
      { src: "./samples/CosoKeys1.mp3" },
      { src: "./samples/CosoKeys2.mp3" },
      { src: "./samples/CosoKeys3.mp3" },
      { src: "./samples/CosoKeys4.mp3" },
    ],
  };
  //======================================================================
  //! -----=====\\\ Functions ///=====-----
  //? setting the global audio context and passing it to the child components
  const setContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    // console.log("audioContext inside setContext func", audioContext);
    setCtx(audioContext);
  };
  //? Function to load the audio context
  const loadContext = () => {
    if (!ctx) {
      setContext();
    }
  };
  //----------------------------------------------------------------------
  //? Function to handle the click event of the play/stop button
  const handlePlayClick = () => {
    // console.log("CLick on button", "playState", playState);
    setPlayState(!playState);
    playState ? setPlayTrigger("stop") : setPlayTrigger("play");
    // console.log("|playTrigger in Father|", playTrigger, "playState", playState);
  };
  //----------------------------------------------------------------------
  // function checkLOADED() {
  //   // console.log("loaded", loaded);
  //   // console.log("activeAudioFile", activeAudioFile);
  //   const allLoaded = loaded.every((item) => item === true);
  //   // console.log("allLoaded", allLoaded);
  // }

  //----------------------------------------------------------------------
  //! -----=====\\\ UseEffect to Update Changes ///=====-----
  useEffect(() => {
    // if (ctx && playState) {
    //   //* Start playing all of the audio files in the InstrumentRack components
    //   // ctx.start(); //? this is not a function - just a placeholder
    // } else if (ctx && !playState) {
    //   //* Stop playing all of the audio files in the InstrumentRack components
    //   // ctx.stop(); //? this is not a function - just a placeholder
    // }
    //? Function to check the loaded state of the InstrumentRack components
    if (loaded.every((item) => item === true)) {
      setAllLoaded(true);
      // console.log("All is Loaded!", "allLoaded", allLoaded, "loaded", loaded);
    } else if (allLoaded === false) {
      console.log(`allLoad state is ${allLoaded}, not all instrument loaded`);
      // console.log("Not all Loaded!", "allLoaded", allLoaded, "loaded", loaded);
    }
  }, [ctx, playState, loaded, allLoaded]);

  const btnColor = playState ? "redBtn" : "greenBtn";
  // console.log("activeAudioFile in EnsambleRack", activeAudioFile);
  return (
    <div className="container">
      <div className="ensamble">
        <h2 className="scene-head">
          <span className="orange">Concrete</span>Jungle
        </h2>
        {ctx ? (
          <button className={btnColor} onClick={handlePlayClick}>
            {playState ? "Stop" : "Play"}
          </button>
        ) : (
          <button onClick={loadContext}>Load</button>
        )}
        {ctx && (
          <div key={"set1"}>
            <InstrumentRack
              Links={audioFiles.drums}
              ctx={ctx}
              setLoaded={setLoaded}
              loadedIndex={0}
              activeAudioFile={activeAudioFile}
              setActiveAudioFile={setActiveAudioFile}
              playTrigger={playTrigger}
              allLoaded={allLoaded}
              key={"drums"}
            />
            <InstrumentRack
              Links={audioFiles.bass}
              ctx={ctx}
              setLoaded={setLoaded}
              loadedIndex={1}
              activeAudioFile={activeAudioFile}
              setActiveAudioFile={setActiveAudioFile}
              playTrigger={playTrigger}
              allLoaded={allLoaded}
              key={"bass"}
            />
            <InstrumentRack
              Links={audioFiles.guitar}
              ctx={ctx}
              setLoaded={setLoaded}
              loadedIndex={2}
              activeAudioFile={activeAudioFile}
              setActiveAudioFile={setActiveAudioFile}
              playTrigger={playTrigger}
              allLoaded={allLoaded}
              key={"guitar"}
            />
            <InstrumentRack
              Links={audioFiles.piano}
              ctx={ctx}
              setLoaded={setLoaded}
              loadedIndex={3}
              activeAudioFile={activeAudioFile}
              setActiveAudioFile={setActiveAudioFile}
              playTrigger={playTrigger}
              allLoaded={allLoaded}
              key={"piano"}
            />
          </div>
        )}
        <button className="logout-btn" onClick={logOut}></button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EnsambleRack;
