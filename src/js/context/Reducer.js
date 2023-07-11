function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function Reducer(state, action) {
    console.log(action);
    switch (action.type) {
        case "UPDATE_AUDIO_STATE": {
            return {
                ...state,
                audioIsPlaying: action.payload
            }
        }
        case "UPDATE_NOTES": {
            return {
                ...state,
                notes: [...state.notes, action.payload]
            }
        }
        default:
            throw new Error('Action type does not exist!')
    }
}