import React, { createContext, useReducer } from 'react';

import Reducer from "./Reducer";

const initialState = {
    coloursOptions: [
        'maroon',
        'red',
        'purple',
        'green',
        'yellow',
        'blue',
        'pink',
        'aqua',
        'teal',
        'lime'
    ],
    audioIsPlaying: false,
    notes: [],  
    currentNote: 0,
    canSetCameraPos: true,
    cameraZPos: -1050,
    cameraRotateSpeed: -2
}

export const Context = createContext(initialState);

export const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const updateIsAudioPlaying = (playing) => {
        dispatch({ type: "UPDATE_AUDIO_STATE", payload: playing });
    }

    const updateNotes = (newNote) => {
        dispatch({ type: "UPDATE_NOTES", payload: newNote });
    }

    const resetNotes = () => {
        dispatch({ type: "RESET_NOTES" });
    }

    const updateCurrentNote = (newNote) => {
        dispatch({ type: "UPDATE_CURRENT_NOTE", payload: newNote });
    }

    const updateCanSetCameraPos = () => {
        dispatch({ type: "UPDATE_CAN_SET_CAMERA_POS" });
    }

    const updateCameraZPos = (newCue) => {
        dispatch({ type: "UPDATE_CAMERA_ZPOS", payload: newCue  });
    }

    const updateCameraRotateSpeed = () => {
        dispatch({ type: "UPDATE_CAMERA_ROTATE_SPEED"  });
    }

    return <Context.Provider
        value={
            {
                coloursOptions: state.coloursOptions,
                audioIsPlaying: state.audioIsPlaying,
                updateIsAudioPlaying,
                notes: state.notes,
                updateNotes,
                resetNotes,
                currentNote: state.currentNote,
                updateCurrentNote,
                canSetCameraPos: state.canSetCameraPos,
                updateCanSetCameraPos,
                cameraZPos: state.cameraZPos,
                updateCameraZPos,
                cameraRotateSpeed: state.cameraRotateSpeed,
                updateCameraRotateSpeed
            }
        }
    >
        {children}
    </Context.Provider>
};
