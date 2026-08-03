import React from 'react'

type props = {
    class?: string;
}

const SectionLoader = (props: props) => {

    return (
        <div className={`flex items-center justify-center bg-black py-24 px-6 ${props?.class ? props.class : ''}`}>
            <img src="/assets/images/white-logo.png" alt="" className='max-w-80' />
        </div>
    )
}

export default SectionLoader;
