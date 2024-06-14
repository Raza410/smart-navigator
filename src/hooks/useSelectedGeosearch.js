import { useState, useEffect } from 'react';
import { signal } from '@preact/signals-core';

const selectedGeosearch = signal([]);

export default () => {
    const [state, setState] = useState(selectedGeosearch.peek());

    useEffect(() => {
        const unsub = selectedGeosearch.subscribe(setState);
        return unsub;
    }, []);

    return state;
};

export const setSelectedGeosearch = (value) => {
    selectedGeosearch.value = value;
};
