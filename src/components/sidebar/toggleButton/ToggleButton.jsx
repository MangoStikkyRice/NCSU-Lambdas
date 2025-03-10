import { motion } from 'framer-motion'

function ToggleButton({ setOpen }) {

    /** Sets the click event for the SideBar button. */
    return (

        <button
            onClick={() => setOpen(prev => !prev)}
            style={{
                position: 'fixed',
                top: '27px',
                left: '25px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1000,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
            }}
            onFocus={(e) => e.target.blur()} // To remove focus outline
        >

            {/** Sets the properties of the SideBar button. */}
            <svg width="23" height="23" viewBox="0 0 23 23">

                {/** Draws the hamburger lines in the SideBar button. */}
                <motion.path
                    strokeWidth="3"
                    stroke="rgb(20, 20, 20)"
                    strokeLinecap="round"
                    initial={{ d: "M 2 2.5 L 20 2.5" }}
                    variants={{
                        closed: { d: "M 2 2.5 L 20 2.5" },
                        open: { d: "M 3 16.5 L 17 2.5" }
                    }} />
                <motion.path
                    strokeWidth="3"
                    stroke="rgb(20, 20, 20)"
                    strokeLinecap="round"
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                        closed: { opacity: 1 },
                        open: { opacity: 0 }
                    }} />
                <motion.path
                    strokeWidth="3"
                    stroke="rgb(20, 20, 20)"
                    strokeLinecap="round"
                    initial={{ d: "M 2 16.346 L 20 16.346" }}
                    variants={{
                        closed: { d: "M 2 16.346 L 20 16.346" },
                        open: { d: "M 3 2.5 L 17 16.346" }
                    }} />
            </svg>
        </button>
    )
}

export default ToggleButton;