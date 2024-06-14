import * as L from 'leaflet';
import React from 'react';
import ReactDOM from "react-dom/client";
import { Marker, useMap } from 'react-leaflet';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { legacy_createStore as createStore } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowsUpDownLeftRight, faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { disallowQuery } from './QueryMarker';
import { Input } from '@mantine/core';


const AnnotationStore = createStore((state = { annotations: [], visible: false }, action) => {
    switch (action.type) {
        case 'SET_ANNOTATION':
            return action.payload
        case 'TOGGLE_ANNOTATION':
            return { ...state, visible: !state.visible }
        default:
            return state
    }
})

export const addAnnotation = (annotation) => {
    AnnotationStore.dispatch({
        type: 'SET_ANNOTATION',
        payload: { annotations: [...AnnotationStore.getState().annotations, annotation] }
    })
}

export const toggleAnnotation = () => {
    AnnotationStore.dispatch({
        type: 'TOGGLE_ANNOTATION'
    })
}

export const removeAnnotation = (annotation) => {
    AnnotationStore.dispatch({
        type: 'SET_ANNOTATION',
        payload: { annotations: AnnotationStore.getState().annotations.filter(a => a !== annotation) }
    })
}

export const updateAnnotation = (annotation) => {
    AnnotationStore.dispatch({
        type: 'SET_ANNOTATION',
        payload: { annotations: AnnotationStore.getState().annotations.map(a => a === annotation ? annotation : a) }
    })
}

export const useAnnotations = () => {
    const [annotations, setAnnotations] = React.useState(AnnotationStore.getState())
    React.useEffect(() => {
        const unsubscribe = AnnotationStore.subscribe(() => {
            setAnnotations(AnnotationStore.getState())
        })
        return () => unsubscribe()
    }, [])
    return annotations
}

export const clearAnnotations = () => {
    AnnotationStore.dispatch({
        type: 'SET_ANNOTATION',
        payload: { annotations: [] }
    })
}



export default () => {

    const map = useMap()
    const annotations = useAnnotations()?.annotations || []

    return (
        <>
            {annotations.map((annotation, index) => <Annotation key={index} annotation={annotation} index={index} center={map.getCenter()} />)}



        </>
    );
}

const JSXMarker = React.forwardRef(
    ({ children, iconOptions, ...rest }, refInParent) => {
        const [ref, setRef] = React.useState();

        const node = React.useMemo(
            () => (ref ? ReactDOM.createRoot(ref.getElement()) : null),
            [ref]
        );

        return (
            <>
                {React.useMemo(
                    () => (
                        <Marker
                            {...rest}
                            ref={(r) => {
                                setRef(r);
                                if (refInParent) {
                                    // @ts-expect-error fowardref ts defs are tricky
                                    refInParent.current = r;
                                }
                            }}
                            icon={L.divIcon({
                                ...iconOptions,
                                iconAnchor: [100, 45],
                            })}
                        />
                    ),
                    []
                )}
                {ref && node.render(children)}
            </>
        );
    }
);

const Annotation = ({ annotation, index, center }) => {


    const createCssClass = (annotation) => {
        const cssClass = `annotation-${index}`
        const style = document.createElement('style')
        style.innerHTML = `
      .${cssClass} {
        background-color: ${annotation.color};
        border-radius: 20% 20% 0 20%;
        height: 50px;
        padding: 5px;
        border: 1px solid white;
        color: ${annotation.textcolor};
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 0 0 2px white;
        cursor: pointer;
        width: 100px;
      }
      .${cssClass}:hover {
        box-shadow: 0 0 0 4px white;
      }
    `
        document.body.appendChild(style)
        return cssClass
    }
    const cssClass = createCssClass(annotation)


    return (
        <JSXMarker
            draggable={true}

            key={index} position={annotation?.position ? annotation?.position : center}
            eventHandlers={{
                dragend: (e) => {
                    annotation.position = e.target.getLatLng()
                    removeAnnotation(annotation)
                    addAnnotation(annotation)
                },

                contextmenu: (e) => {
                    removeAnnotation(annotation)
                }
            }}


        >
            <div className={cssClass}>
                <AnnotationText annotation={annotation} />
            </div>
        </JSXMarker>
    )
}

const AnnotationText = ({ annotation }) => {
    const [editing, setEditing] = React.useState(false)
    return (
        <div className='flex flex-col'>
            {editing ?
                <div className='flex flex-col'>
                    <Input
                        className=''
                        value={annotation.text}
                        onChange={(e) => {
                            annotation.text = e.target.value
                            updateAnnotation(annotation, annotation.text)
                        }}
                    />
                    <div className='flex justify-end'>
                        <button className='bg-gray-200 text-gray-400 rounded-full w-4 h-4 flex justify-center items-center' onClick={() => setEditing(false)}>
                            <FontAwesomeIcon icon={faCheck} size='xs' />
                        </button>
                    </div>
                </div>
                :
                <div className='flex flex-col' onClick={() => setEditing(true)}>
                    {
                        annotation.text
                    }
                </div>


            }
        </div>
    )
}

export const AnnotationMaker = () => {
    const [color, setColor] = useColor("hex", "#bd0808");
    const [textcolor, setTextcolor] = useColor("hex", "#ffffff");
    const [colorPanelPreview, setColorPanelPreview] = React.useState('background');
    const [opacity, setOpacity] = React.useState(0.5);
    const [size, setSize] = React.useState(100);
    const [text, setText] = React.useState("");
    const annotations = useAnnotations().visible

    return (
        <div className='w-36' style={{
            display: annotations ? 'block' : 'none',
        }}>
            <div className='flex'>

                {/* Close Button */}
                <div className='flex justify-start pr-2' onClick={() => toggleAnnotation()}>

                    <div className='w-4 h-4 bg-gray-200 text-gray-400 rounded-full flex justify-center items-center cursor-pointer'>
                        <FontAwesomeIcon icon={faClose} size='xs' />
                    </div>
                </div>
                {/* Drag Button */}
                <div className='flex justify-start pr-2'>
                    <div className='w-4 h-4 bg-gray-200 text-gray-400 rounded-full flex justify-center items-center cursor-move'>
                        <FontAwesomeIcon icon={faArrowsUpDownLeftRight} size='xs' />
                    </div>
                </div>
            </div>

            {colorPanelPreview === 'background' ?
                <>
                    <p className='border-b-2 border-gray-300 text-sm font-bold'>BG Color : {color.hex}</p>
                    <ColorPicker height={50} width={145} color={color} onChange={setColor} hideHEX hideHSV hideRGB alpha />
                    <div onClick={() => setColorPanelPreview('text')} className='text-xs text-gray-400 cursor-pointer'>Switch to Text Color</div>
                </>
                :
                <>
                    <p className='border-b-2 border-gray-300 text-sm font-bold'>Text Color : {color.hex}</p>
                    <ColorPicker height={50} width={145} color={textcolor} onChange={setTextcolor} hideHEX hideHSV hideRGB alpha />
                    <div onClick={() => setColorPanelPreview('background')} className='text-xs text-gray-400 cursor-pointer'>Switch to BG Color</div>
                </>
            }


            <Input
                required
                placeholder='Enter text here'
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />


            <br />

            <button
                className="bg-slate-800 w-full text-xs text-white font-bold p-1 rounded-md"
                onClick={() => {
                    addAnnotation({
                        text,
                        textcolor: textcolor.hex,
                        color: color.hex,
                        opacity,
                        size,
                    });
                    disallowQuery()
                }}
            >
                <FontAwesomeIcon icon={faAdd} /> Add Annotation
            </button>
            <br />
            <button
                className="bg-red-800 w-full text-xs text-white font-bold p-1 rounded-md"
                onClick={() => {
                    clearAnnotations()
                }}
            >
                Clear Annotations
            </button>


        </div>
    )
}


