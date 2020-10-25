import useSound from 'use-sound';
import { Button } from '@material-ui/core'


const ButtonWrapper = ({ children, variant, color, size, className, style, click }) => {

    let audio = React.useRef(null)

    const play = () => {
        if (click) click()
        audio.current.play()
    }

    return (
        <>
            <Button
                variant={variant}
                color={color}
                size={size}
                className={className}
                onClick={play}
                style={style}
            >
                {children}
            </Button>
            <audio src="/sounds/click.mp3" ref={audio}></audio>
        </>
    )
}

export default ButtonWrapper