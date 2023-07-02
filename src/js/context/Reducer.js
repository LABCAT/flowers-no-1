function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function Reducer(state, action) {
    switch (action.type) {
        case "UPDATE_AUDIO_STATE": {
            return {
                ...state,
                audioIsPlaying: action.payload
            }
        }
        case "UPDATE_CURRENT_NOTE": {
            return {
                ...state,
                currentNote: action.payload
            }
        }
        case "RESET_NOTES": {
            return {
                ...state,
                notes: []
            }
        }
        case "UPDATE_NOTES": {
            return {
                ...state,
                notes: [...state.notes, action.payload]
            }
        }
        case "UPDATE_CAN_SET_CAMERA_POS": {
            return {
                ...state,
                canSetCameraPos: false
            }
        }
        case "UPDATE_CAMERA_ZPOS": {
            const note = action.payload,
             { currentCue } = note;  
            let zPos = state.cameraZPos;
            if(currentCue > 14) {
                if(currentCue % 14 === 1 && currentCue > 28 && currentCue < 84) {
                    return {
                        ...state,
                        canSetCameraPos: true,
                        cameraZPos: randomIntFromInterval(-325, -225)
                    }
                }
                return { 
                    ...state,
                    canSetCameraPos: false
                }; 
            } 
            else if(currentCue) {
                zPos = zPos + 60;
            }
            return {
                ...state,
                canSetCameraPos: true,
                cameraZPos: zPos
            }
        }
        case "UPDATE_CAMERA_ROTATE_SPEED": {
            return {
                ...state,
                cameraRotateSpeed: state.cameraRotateSpeed * -1
            }
        }
        default:
            throw new Error('Action type does not exist!')
    }
}