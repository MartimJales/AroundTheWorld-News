import React, { useEffect, useState } from 'react'
import { useLayers } from '../contexts/LayersContext'
import { classJoin } from '../util/functions'
import Icon from '../common/Icon'

function CityNews() {
    const { news, setNews } = useLayers()

    const close = () => {
        setNews([])
    }

    useEffect(() => {
        console.log("Stored News", news)
    }, [news])

    return (
        <>
            {news.length > 0 && (
                <div className='fixed z-[2000] top-0 left-0 h-full w-full flex items-center justify-center'>
                    <div className={classJoin("flex flex-col bg-slate-200 p-8 rounded-md")}>
                        <div className=''>
                            <button
                                onClick={close}
                            ><Icon icon="close" /></button>
                        </div>
                        <div className='flex flex-col'>
                            {news.map(n => (
                                <a
                                    href={n.URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='text-blue-600 hover:underline'
                                >{n.title}</a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CityNews