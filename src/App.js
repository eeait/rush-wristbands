import "./App.css"
import { useCallback, useEffect, useState } from "react"

const Firstrow = ({ heading, time }) => {
  return (
    <div className="row">
      <Clock time={time}></Clock>
      <Header heading={heading}></Header>
    </div>
  )
}

const Header = ({ heading }) => {
  return (
    <div className="right header_font">
      <h1>{heading}</h1>
    </div>
  )
}

const Clock = ({ time }) => {
  return (
    <div className="left header_font">
      <h1>{time}</h1>
    </div>
  )
}

const Wristband = ({ color, countdown, size }) => {
  return (
    <div className={`row wristband ${color}`}>
      <Color color={color} size={size}></Color>
      <Countdown countdown={countdown} size={size}></Countdown>
    </div>
  )
}

const Color = ({ color, size }) => {
  return (
    <div className={`left black_text color_name_font ${size}_font`}>
      <h2>{color.toUpperCase()}</h2>
    </div>
  )
}

const Countdown = ({ countdown, size }) => {
  return (
    <div className={`right black_text header_font ${size}_font`}>
      <h1>{countdown}</h1>
    </div>
  )
}

const App = () => {
  const localTime = () => {
    let t = new Date()
    if (false) {
      let h = 3
      let m = 0
      let s = 0
      t.setHours(t.getHours()+h, t.getMinutes()+m, t.getSeconds()+s)
    }
    return t
  }

  const [time, setTime] = useState(localTime())
  const [stack, setStack] = useState(["white", "white", "white", "white", "white"],)
  
  const selectStack = useCallback(() => {
    let stacks = [
      ["yellow", "white", "green", "blue", "pink", ],
      ["pink", "yellow", "white", "green", "blue", ],
      ["blue", "pink", "yellow", "white", "green", ],
      ["green", "blue", "pink", "yellow", "white", ],
      ["white", "green", "blue", "pink", "yellow", ],
    ]

    let now = localTime()
    let midnight = clone(now)
    midnight.setHours(0, 0, 0, 0)
    let diff = now - midnight
    let slot = Math.floor(diff/(1800*1000))
    let index = slot%5

    return stacks[index]
  }, [])

  const zeroPad = (num, places) => String(num).padStart(places, '0')
  const makeTimePretty = (time) => {

    const h = zeroPad(time.getHours(), 2)
    const m = zeroPad(time.getMinutes(), 2)
    const s = zeroPad(time.getSeconds(), 2)
    return `${h}:${m}:${s}`
  }

  const clone = (date) => {
    let copy = new Date()
    copy.setTime(date.getTime())
    return copy
  }

  const nextChange = () => {
    let nextChange = clone(time)
    if (time.getMinutes() < 30) {
      nextChange.setHours(nextChange.getHours())
      nextChange.setMinutes(30, 0, 0)
    } else {
      nextChange.setHours(nextChange.getHours() + 1)
      nextChange.setMinutes(0, 0, 0)
    }
    return nextChange
  }

  const timeLeft = (n) => {
    let endTime = clone(nextChange())
    let diff = endTime - time
    diff += n*1800*1000

    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(localTime())
      setStack(selectStack(time))

    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time, selectStack]);

  return (
    <div className="parent">
      <Firstrow heading="JUMP TIME LEFT" time={makeTimePretty(time)}/>
      <Wristband color={stack[0]} countdown={timeLeft(3)}></Wristband>
      <Wristband color={stack[1]} countdown={timeLeft(2)}></Wristband>
      <Wristband color={stack[2]} countdown={timeLeft(1)}></Wristband>
      <Wristband color={stack[3]} countdown={timeLeft(0)} size="thick"></Wristband>
      <Wristband color={stack[4]} countdown="EXPIRED" size="thin"></Wristband>
    </div>
  )
}

export default App;