import React from 'react'
import Icon from '../common/Icon'
import { classJoin } from '../util/functions'
import { useLayers } from '../contexts/LayersContext'

function CategoriesBar() {
    const { layers, handleToggleLayer } = useLayers()

    return (
        <div className='fixed top-0 left-0 h-full z-[1000] flex items-center'>
            <aside className='bg-slate-100'>
                <div className="p-1 flex flex-col gap-1 ">
                    {layers.map((cat) => (
                        <button
                            key={cat.id}
                            className={classJoin(
                                cat.active ? 'bg-slate-400' : 'bg-slate-100',
                                'h-8 pr-2 flex items-center gap-2 bg-slate-100 rounded-sm'
                            )}
                            onClick={() => handleToggleLayer(cat.id)}
                        >
                            <Icon icon={cat.icon} /> {cat.name}
                        </button>
                    ))}
                </div>
            </aside >
        </div>
    )
}

export default CategoriesBar