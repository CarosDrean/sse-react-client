import {useState} from "react";

const useBufferedState = (len) => {
    const [buffer, setBuffer] = useState([]);

    const push = (str) => {
        setBuffer((currentBuffer) => {
            if (len === currentBuffer.length) {
                return [str, ...currentBuffer.slice(0, buffer.length - 1)];
            } else {
                return [str, ...currentBuffer];
            }
        });
    };

    return [buffer, push];
};

export { useBufferedState };