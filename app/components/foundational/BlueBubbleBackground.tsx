import LightBlueBubble from '~/assets/foundational/light_blue_bubbles.svg'
import "./BlueBubbleBackground.css"

export function BlueBubbleBackground({ children }: { children: React.ReactNode }) {
    return <div className='relative bg-jc-dark-blue-100 overflow-hidden z-0'>
        <img src={LightBlueBubble} alt="left Bubble Background" className='absolute z-1 h-[300%] top-[-100%] -translate-x-1/2 hidden sm:block' />
        <img src={LightBlueBubble} alt="right Bubble Background" className='absolute z-1 min-w-[200%] -left-2/4 bottom-0 translate-y-2/3  rotate-90 sm:min-w-[100%] sm:translate-y-0 sm:rotate-0 sm:h-[300%] sm:top-[-100%] sm:left-[100%] sm:-translate-x-1/2' />
        <div className='z-2'>{children}</div>
    </div>
}